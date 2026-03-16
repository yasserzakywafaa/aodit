/**
 * Execution engine — orchestrates real AI agent testing for AODIT-5.
 *
 * Flow:
 * 1. Load report config + scenarios from DB
 * 2. For each model being tested, create a ReportRun
 * 3. For each scenario: generate prompts, run 8-turn conversation, score with judge
 * 4. Aggregate scores and finalize the ReportRun
 */

import {
  DBCollectionsEnum,
  getDocumentsByQueryFromDb,
} from "../../models/mongoDb";
import { FeedItem, ReportRun } from "../../models/types/reportRun";
import { ScenarioResult, TurnResult } from "../../models/types/scenarioResult";
import {
  aggregateDimensionScores,
  computeCalibrationGap,
  computeComposite,
  determineDeploymentVerdict,
  determineOutlook,
  getRating,
} from "./scoring";
import {
  buildScenarioGenerationPrompt,
  buildScoringPrompt,
  buildSelfScoreExtractionPrompt,
  buildTurnEscalationPrompt,
} from "./prompts";
import {
  createDocument,
  readDocument,
  updateDocument,
} from "../../models/mongoDb/crudOperations";
import { resolveEvaluatorModelId, resolveModelId } from "./modelRegistry";

import { ObjectId } from "mongodb";
import { Report } from "../../models/types/report";
import { Scenario } from "../../models/types/scenario";
import { handleOpenRouterAIRequest } from "../../utils/openRouterClient";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TURN_TYPES = [
  "Baseline",
  "Extension",
  "Contradiction",
  "Challenge",
  "Escalation",
  "Synthesis",
  "SelfAssessment",
  "Recovery",
];

const MAX_FEED_ITEMS = 8;
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 2000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const callModel = async (
  modelId: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  jsonMode = false,
): Promise<string> => {
  const options: any = { max_tokens: 2000 };
  if (jsonMode) {
    options.response_format = { type: "json_object" };
  }

  const response = await handleOpenRouterAIRequest(modelId, messages, options);
  return response.choices?.[0]?.message?.content?.trim() ?? "";
};

const callWithRetry = async (
  modelId: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  jsonMode = false,
): Promise<string> => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await callModel(modelId, messages, jsonMode);
    } catch (err: any) {
      const isLast = attempt === MAX_RETRIES - 1;
      if (isLast) throw err;

      const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
      console.warn(
        `[AODIT] Retry ${attempt + 1}/${MAX_RETRIES} for ${modelId}: ${err.message}. Waiting ${delay}ms`,
      );
      await sleep(delay);
    }
  }
  throw new Error("Unreachable");
};

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const parseJsonSafe = <T>(text: string, fallback: T): T => {
  try {
    // Strip markdown code fences if present
    const cleaned = text
      .replace(/^```json?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
};

const classifyScore = (score: number): "pass" | "warn" | "fail" => {
  if (score >= 4) return "pass";
  if (score >= 3) return "warn";
  return "fail";
};

// ---------------------------------------------------------------------------
// Progress tracking
// ---------------------------------------------------------------------------

const updateRunProgress = async (
  runId: string,
  fields: Partial<ReportRun>,
): Promise<void> => {
  await updateDocument<ReportRun>(
    runId,
    { ...fields, updatedAt: new Date().toISOString() },
    DBCollectionsEnum.reportRuns,
  );
};

const computeProgressPercent = (
  completedScenarios: number,
  totalScenarios: number,
): number => {
  if (totalScenarios === 0) return 0;
  // Reserve 0-5% for setup, 5-90% for scenarios, 90-100% for aggregation
  const scenarioProgress = (completedScenarios / totalScenarios) * 85;
  return Math.round(5 + scenarioProgress);
};

const getProgressStep = (progress: number): string => {
  if (progress < 5) return "Generating scenarios";
  if (progress < 40) return "Running conversations";
  if (progress < 80) return "Evaluating responses";
  if (progress < 95) return "Calculating scores";
  return "Generating report";
};

// ---------------------------------------------------------------------------
// Core: Run a single scenario (8 turns)
// ---------------------------------------------------------------------------

const executeScenario = async (params: {
  scenario: Scenario;
  modelId: string;
  evaluatorModelId: string;
  reportDescription?: string;
  reportType?: string;
  onTurnStart?: (turnIndex: number, turnType: string) => Promise<void>;
}): Promise<{
  turns: TurnResult[];
  rawScore: number;
  selfScore?: number;
}> => {
  const { scenario, modelId, evaluatorModelId, reportDescription, reportType, onTurnStart } =
    params;

  const conversationHistory: Array<{ role: string; content: string }> = [];
  const turns: TurnResult[] = [];
  let selfScore: number | undefined;

  for (let turnIdx = 0; turnIdx < TURN_TYPES.length; turnIdx++) {
    const turnType = TURN_TYPES[turnIdx];
    const turnNumber = turnIdx + 1;

    // Broadcast the current turn before the expensive LLM calls so the UI updates live
    if (onTurnStart) {
      await onTurnStart(turnNumber, turnType);
    }

    // --- Generate the user prompt ---
    let userPrompt: string;

    if (turnIdx === 0) {
      // Baseline: generate from scenario description
      const genMessages = buildScenarioGenerationPrompt({
        dimension: scenario.categoryId,
        reportDescription,
        reportType,
        severity: scenario.severity,
        scenarioTitle: scenario.title ?? "",
        scenarioDescription: scenario.description ?? "",
      });
      userPrompt = await callWithRetry(evaluatorModelId, genMessages);
    } else {
      // Turns 2-8: escalation based on conversation history
      const escMessages = buildTurnEscalationPrompt({
        dimension: scenario.categoryId,
        turnType,
        conversationHistory,
        reportDescription,
      });
      userPrompt = await callWithRetry(evaluatorModelId, escMessages);
    }

    // --- Send prompt to model under test ---
    conversationHistory.push({ role: "user", content: userPrompt });

    const modelMessages = conversationHistory.map((m) => ({
      role: m.role as "system" | "user" | "assistant",
      content: m.content,
    }));

    const modelResponse = await callWithRetry(modelId, modelMessages);
    conversationHistory.push({ role: "assistant", content: modelResponse });

    // --- Score the response with the judge ---
    const scoreMessages = buildScoringPrompt({
      dimension: scenario.categoryId,
      turnType,
      prompt: userPrompt,
      response: modelResponse,
      conversationHistory,
    });

    const scoreRaw = await callWithRetry(evaluatorModelId, scoreMessages, true);
    const parsed = parseJsonSafe<{ score: number; reasoning: string }>(
      scoreRaw,
      { score: 3, reasoning: "Parse error — defaulting to 3" },
    );

    const score = Math.max(1, Math.min(5, Math.round(parsed.score)));

    // --- Extract self-score from SelfAssessment turn ---
    if (turnType === "SelfAssessment") {
      const selfScoreMessages = buildSelfScoreExtractionPrompt({
        modelResponse,
      });
      const selfScoreRaw = await callWithRetry(
        evaluatorModelId,
        selfScoreMessages,
        true,
      );
      const selfParsed = parseJsonSafe<{ selfScore: number }>(selfScoreRaw, {
        selfScore: 3,
      });
      selfScore = Math.max(1, Math.min(5, Math.round(selfParsed.selfScore)));
    }

    turns.push({
      turnIndex: turnNumber,
      turnType,
      prompt: userPrompt,
      response: modelResponse,
      score,
      evaluatorReasoning: parsed.reasoning,
    });
  }

  // Raw score = average of all turn scores
  const rawScore = turns.reduce((sum, t) => sum + t.score, 0) / turns.length;

  return {
    turns,
    rawScore: Math.round(rawScore * 100) / 100,
    selfScore,
  };
};

// ---------------------------------------------------------------------------
// Core: Execute all scenarios for a single model
// ---------------------------------------------------------------------------

const executeModelRun = async (params: {
  reportId: string;
  runId: string;
  batchId: string;
  modelName: string;
  modelId: string;
  evaluatorModelId: string;
  scenarios: Scenario[];
  reportDescription?: string;
  reportType?: string;
  dimensionWeights?: Report["dimensionWeights"];
}): Promise<void> => {
  const {
    reportId,
    runId,
    modelName,
    modelId,
    evaluatorModelId,
    scenarios,
    reportDescription,
    reportType,
    dimensionWeights,
  } = params;

  const totalScenarios = scenarios.length;
  const dimCounters: Record<string, number> = {};

  // Build per-dimension totals from the scenarios list
  const dimTotals: Record<string, number> = {};
  for (const s of scenarios) {
    dimTotals[s.categoryId] = (dimTotals[s.categoryId] ?? 0) + 1;
  }
  const dimCompleted: Record<string, number> = {};

  // --- Resume support: load any ScenarioResults already saved for this run ---
  const existingResults = await getDocumentsByQueryFromDb<ScenarioResult>(
    { reportRunId: runId } as any,
    DBCollectionsEnum.scenarioResults,
  );
  const completedScenarioIds = new Set(existingResults.map((r) => r.scenarioId));
  const allScenarioResults: ScenarioResult[] = [...(existingResults as unknown as ScenarioResult[])];
  const scenarioResultIds: string[] = existingResults.map((r) => String(r._id));
  let completedScenarios = existingResults.length;

  // Seed dimCompleted from existing results so dimension progress is accurate on resume
  for (const r of existingResults) {
    dimCompleted[r.dimensionId] = (dimCompleted[r.dimensionId] ?? 0) + 1;
  }

  const isResuming = completedScenarios > 0;

  let feedItems: FeedItem[] = [];

  if (isResuming) {
    // Rebuild feed items from existingResults (already loaded above) so the UI shows
    // all completed scenarios — not just whatever fragment was saved in the run doc.
    // Sort ascending by createdAt so we can assign sequential dim-prefixed IDs in order.
    const scenarioTitleMap = new Map<string, string>(
      scenarios.map((s) => [String(s._id), s.title ?? ""]),
    );
    const sortedByTime = [...existingResults]
      .filter((r) => r.createdAt)
      .sort(
        (a, b) =>
          new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime(),
      );

    const localDimCounters: Record<string, number> = {};
    const DIM_PREFIX: Record<string, string> = {
      reliability: "R",
      integrity: "I",
      judgment: "J",
      resistance: "T",
      resilience: "Z",
    };
    const allRebuilt: FeedItem[] = sortedByTime.map((r) => {
      const prefix = DIM_PREFIX[r.dimensionId.toLowerCase()] ?? "X";
      localDimCounters[prefix] = (localDimCounters[prefix] ?? 0) + 1;
      const lastTurn = r.turns[r.turns.length - 1];
      return {
        id: `${prefix}${localDimCounters[prefix]}`,
        dim: r.dimensionId.toUpperCase(),
        model: r.modelName.toUpperCase(),
        turn: lastTurn?.turnIndex ?? 8,
        text: lastTurn ? `${lastTurn.turnType} — score ${lastTurn.score}/5` : "",
        score: String(r.rawScore),
        type: classifyScore(r.rawScore),
        scenarioTitle: scenarioTitleMap.get(r.scenarioId) ?? "",
        scenarioSeverity: r.severity,
      };
    });

    // Seed dimCounters so new scenarios after resume continue numbering correctly
    // (e.g. if last was R12, next will be R13 not R1)
    Object.assign(dimCounters, localDimCounters);

    // Show all completed scenarios newest-first — no cap on historical data
    feedItems = allRebuilt.reverse();

    console.log(
      `[AODIT] Resuming run ${runId}: ${completedScenarios}/${totalScenarios} scenarios already done`,
    );
    await updateRunProgress(runId, {
      status: "running",
      currentStep: "Resuming conversations",
      feedItems: [...feedItems], // Push rebuilt feed immediately so UI reflects history
    });
  } else {
    await updateRunProgress(runId, {
      status: "running",
      progress: 5,
      currentStep: "Running conversations",
      totalScenarios,
      completedScenarios: 0,
    });
  }

  for (const scenario of scenarios) {
    // Skip scenarios already completed in a previous run (resume support)
    if (completedScenarioIds.has(String(scenario._id))) continue;

    try {
      const result = await executeScenario({
        scenario,
        modelId,
        evaluatorModelId,
        reportDescription,
        reportType,
        onTurnStart: async (_turnIndex, turnType) => {
          await updateRunProgress(runId, { currentTurnName: turnType });
        },
      });

      // Save ScenarioResult to DB
      const now = new Date().toISOString();
      const scenarioResult: Omit<ScenarioResult, "_id"> = {
        reportRunId: runId,
        reportId,
        scenarioId: String(scenario._id),
        modelName,
        dimensionId: scenario.categoryId,
        severity: scenario.severity,
        turns: result.turns,
        rawScore: result.rawScore,
        weightedScore: result.rawScore, // Severity weighting applied during aggregation
        selfScore: result.selfScore,
        status: "completed",
        createdAt: now,
        updatedAt: now,
      };

      const insertedId = await createDocument(
        scenarioResult,
        DBCollectionsEnum.scenarioResults,
      );
      scenarioResultIds.push(String(insertedId));
      allScenarioResults.push(scenarioResult as ScenarioResult);

      // Update feed items
      const lastTurn = result.turns[result.turns.length - 1];
      dimCompleted[scenario.categoryId] = (dimCompleted[scenario.categoryId] ?? 0) + 1;

      const dimPrefix =
        { reliability: "R", integrity: "I", judgment: "J", resistance: "T", resilience: "Z" }[
          scenario.categoryId.toLowerCase()
        ] ?? "X";
      dimCounters[dimPrefix] = (dimCounters[dimPrefix] ?? 0) + 1;
      const feedItem: FeedItem = {
        id: `${dimPrefix}${dimCounters[dimPrefix]}`,
        dim: scenario.categoryId.toUpperCase(),
        model: modelName.toUpperCase(),
        turn: lastTurn.turnIndex,
        text: `${lastTurn.turnType} — score ${lastTurn.score}/5`,
        score: String(result.rawScore),
        type: classifyScore(result.rawScore),
        scenarioTitle: scenario.title ?? "",
        scenarioSeverity: scenario.severity ?? "",
      };
      feedItems.unshift(feedItem);
      if (feedItems.length > MAX_FEED_ITEMS) feedItems.pop();

      completedScenarios++;
      const progress = computeProgressPercent(
        completedScenarios,
        totalScenarios,
      );

      const dimensionProgress = Object.fromEntries(
        Object.entries(dimTotals).map(([dim, total]) => [
          dim,
          { completed: dimCompleted[dim] ?? 0, total },
        ]),
      );
      await updateRunProgress(runId, {
        completedScenarios,
        progress,
        currentStep: getProgressStep(progress),
        feedItems: [...feedItems],
        dimensionProgress,
      });
    } catch (err: any) {
      console.error(
        `[AODIT] Scenario ${scenario._id} failed for ${modelName}: ${err.message}`,
      );
      // Save failed scenario result
      const now = new Date().toISOString();
      const failedResult: Omit<ScenarioResult, "_id"> = {
        reportRunId: runId,
        reportId,
        scenarioId: String(scenario._id),
        modelName,
        dimensionId: scenario.categoryId,
        severity: scenario.severity,
        turns: [],
        rawScore: 0,
        weightedScore: 0,
        status: "failed",
        error: err.message,
        createdAt: now,
        updatedAt: now,
      };
      await createDocument(failedResult, DBCollectionsEnum.scenarioResults);
      completedScenarios++;

      const progress = computeProgressPercent(
        completedScenarios,
        totalScenarios,
      );
      await updateRunProgress(runId, {
        completedScenarios,
        progress,
        currentStep: getProgressStep(progress),
      });
    }
  }

  // --- Aggregation ---
  await updateRunProgress(runId, {
    progress: 92,
    currentStep: "Calculating scores",
  });

  const completedResults = allScenarioResults.filter(
    (sr) => sr.status === "completed",
  );

  if (completedResults.length === 0) {
    await updateRunProgress(runId, {
      status: "failed",
      progress: 100,
      currentStep: "Generating report",
      completedAt: new Date().toISOString(),
    });
    return;
  }

  const dimScores = aggregateDimensionScores(
    completedResults,
    dimensionWeights,
  );
  const compositeScore = computeComposite(dimScores);
  const rating = getRating(compositeScore);
  const calibrationGap = computeCalibrationGap(completedResults);
  const outlook = determineOutlook(dimScores, calibrationGap);
  const deploymentVerdict = determineDeploymentVerdict(rating);

  await updateRunProgress(runId, {
    status: "completed",
    progress: 100,
    currentStep: "Generating report",
    dimensionScores: dimScores,
    compositeScore,
    rating,
    calibrationGap,
    outlook,
    deploymentVerdict,
    scenarioResults: scenarioResultIds,
    completedAt: new Date().toISOString(),
  });
};

// ---------------------------------------------------------------------------
// Public API: Launch execution for a report
// ---------------------------------------------------------------------------

/**
 * Execute the full AODIT-5 test run for a report.
 * Creates one ReportRun per model, runs them sequentially, and updates progress.
 *
 * This function is designed to be called fire-and-forget (don't await in the controller).
 */
export const executeReport = async (
  reportId: string,
  batchId: string,
  runIds: Map<string, string>, // modelName -> runId
): Promise<void> => {
  try {
    // Load report
    const report = (await readDocument(
      new ObjectId(reportId),
      DBCollectionsEnum.reports,
    )) as unknown as Report | null;

    if (!report) {
      console.error(`[AODIT] Report ${reportId} not found`);
      return;
    }

    // Load scenarios
    const scenarios = await getDocumentsByQueryFromDb<Scenario>(
      { reportId } as any,
      DBCollectionsEnum.scenarios,
    );

    if (!scenarios || scenarios.length === 0) {
      console.error(`[AODIT] No scenarios found for report ${reportId}`);
      for (const [, runId] of runIds) {
        await updateRunProgress(runId, {
          status: "failed",
          progress: 100,
          completedAt: new Date().toISOString(),
        });
      }
      return;
    }

    const evaluatorModelId = resolveEvaluatorModelId(report.modelsToEvaluate);
    const modelsToTest = report.modelsToTest ?? ["Claude"];

    console.log(
      `[AODIT] Starting execution: ${modelsToTest.length} models × ${scenarios.length} scenarios, judge: ${evaluatorModelId}`,
    );

    // Execute models sequentially to manage rate limits
    for (const modelName of modelsToTest) {
      const runId = runIds.get(modelName);
      if (!runId) continue;

      try {
        const modelId = resolveModelId(modelName);

        await executeModelRun({
          reportId,
          runId,
          batchId,
          modelName,
          modelId,
          evaluatorModelId,
          scenarios: scenarios as unknown as Scenario[],
          reportDescription: report.description,
          reportType: report.reportType,
          dimensionWeights: report.dimensionWeights,
        });

        console.log(`[AODIT] Completed model run: ${modelName}`);
      } catch (err: any) {
        console.error(
          `[AODIT] Model run failed for ${modelName}: ${err.message}`,
        );
        await updateRunProgress(runId, {
          status: "failed",
          progress: 100,
          currentStep: "Generating report",
          completedAt: new Date().toISOString(),
        });
      }
    }

    // Determine final report status from all model runs
    const allRunStatuses: string[] = [];
    for (const [, runId] of runIds) {
      const run = await readDocument(
        new ObjectId(runId),
        DBCollectionsEnum.reportRuns,
      );
      if (run) allRunStatuses.push((run as any).status);
    }
    const allFailed = allRunStatuses.every((s) => s === "failed");
    const finalStatus = allFailed ? "failed" : "completed";

    await updateDocument<Report>(
      reportId,
      { status: finalStatus as any, updatedAt: new Date().toISOString() },
      DBCollectionsEnum.reports,
    );

    console.log(
      `[AODIT] All model runs completed for report ${reportId} — status: ${finalStatus}`,
    );
  } catch (err: any) {
    console.error(`[AODIT] Fatal error in executeReport: ${err.message}`);
    // Mark report as failed on fatal error
    try {
      await updateDocument<Report>(
        reportId,
        { status: "failed" as any, updatedAt: new Date().toISOString() },
        DBCollectionsEnum.reports,
      );
    } catch {
      // Best effort
    }
  }
};

// ---------------------------------------------------------------------------
// Startup recovery: resume any runs interrupted by a previous server crash
// ---------------------------------------------------------------------------

/**
 * Called once on server startup. Finds all ReportRuns that were left in a
 * "running" or "pending" state (i.e. the server died mid-execution) and
 * re-fires executeReport for each affected batch.
 *
 * executeModelRun is resume-aware — it queries existing ScenarioResults and
 * skips scenarios that were already completed, so no work is duplicated.
 */
export const resumeStuckRuns = async (): Promise<void> => {
  const stuckRuns = await getDocumentsByQueryFromDb<ReportRun>(
    { status: { $in: ["running", "pending"] } } as any,
    DBCollectionsEnum.reportRuns,
  );

  if (stuckRuns.length === 0) return;

  console.log(
    `[AODIT] Found ${stuckRuns.length} stuck run(s) from a previous server instance — resuming...`,
  );

  // Group runs by their batch (reportId + batchId) so each batch is resumed once
  const batches = new Map<string, typeof stuckRuns>();
  for (const run of stuckRuns) {
    const key = `${run.reportId}:${run.batchId ?? "no-batch"}`;
    if (!batches.has(key)) batches.set(key, []);
    batches.get(key)!.push(run);
  }

  for (const [, runs] of batches) {
    const { reportId, batchId } = runs[0];
    const runIds = new Map<string, string>();
    for (const run of runs) {
      if (run.modelName && run._id) {
        runIds.set(run.modelName, String(run._id));
      }
    }

    console.log(
      `[AODIT] Resuming batch ${batchId} for report ${reportId} (${runIds.size} model run(s))`,
    );

    // Fire-and-forget — executeModelRun will skip already-completed scenarios
    executeReport(reportId, batchId!, runIds).catch((err) => {
      console.error(
        `[AODIT] Failed to resume batch ${batchId}: ${err.message}`,
      );
    });
  }
};
