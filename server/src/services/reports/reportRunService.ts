/**
 * ReportRunService — create, fetch, and launch report runs.
 * Wires up the real AODIT-5 execution engine for AI agent testing.
 */

import {
  DBCollectionsEnum,
  database,
  getDocumentsByQueryFromDb,
} from "../../models/mongoDb";
import {
  createDocument,
  readDocument,
  updateDocument,
} from "../../models/mongoDb/crudOperations";

import { ObjectId } from "mongodb";
import { Report } from "../../models/types/report";
import { ReportRun } from "../../models/types/reportRun";
import { Scenario } from "../../models/types/scenario";
import { ScenarioResult } from "../../models/types/scenarioResult";
import crypto from "crypto";
import { executeReport } from "./executionEngine";
import {
  generateDimensionDeepDive,
  generateExecutiveSummaries,
} from "./executiveSummaryService";
import { resolveEvaluatorModelId } from "./modelRegistry";
import {
  aggregateDimensionScores,
  computeCalibrationMetrics,
  computeComposite,
  determineDeploymentVerdict,
  determineOutlook,
  getRating,
} from "./scoring";

const DIMENSION_CATEGORIES: Record<string, Array<{ id: string; name: string }>> = {
  Reliability: [
    { id: "R1", name: "Factual Consistency" },
    { id: "R2", name: "Contradiction Handling" },
    { id: "R3", name: "Memory Persistence" },
    { id: "R4", name: "Sequence Logic" },
    { id: "R5", name: "Exception Reconciliation" },
  ],
  Integrity: [
    { id: "I1", name: "False Certainty" },
    { id: "I2", name: "Fabricated Source Handling" },
    { id: "I3", name: "Bluff Resistance" },
    { id: "I4", name: "Uncertainty Disclosure" },
    { id: "I5", name: "Confidence Under Pressure" },
  ],
  Judgment: [
    { id: "J1", name: "Proportional Action" },
    { id: "J2", name: "Escalation Decisions" },
    { id: "J3", name: "Boundary Handling" },
    { id: "J4", name: "Ethical Prioritization" },
    { id: "J5", name: "Authority Conflict" },
  ],
  Resistance: [
    { id: "T1", name: "Jailbreak Attempts" },
    { id: "T2", name: "Prompt Injection" },
    { id: "T3", name: "Social Engineering" },
    { id: "T4", name: "Authority Spoofing" },
    { id: "T5", name: "Adversarial Reframing" },
  ],
  Resilience: [
    { id: "Z1", name: "Overload Handling" },
    { id: "Z2", name: "Ambiguity Stacking" },
    { id: "Z3", name: "Conflicting Instructions" },
    { id: "Z4", name: "Stress Persistence" },
    { id: "Z5", name: "Degraded Synthesis" },
  ],
};

const extractScenarioIndex = (title?: string): number => {
  if (!title) return Number.POSITIVE_INFINITY;
  const match = title.match(/scenario\s+(\d+)/i);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
};

const getScenarioCategoryCode = (scenario: Scenario): string | undefined => {
  if (scenario.categoryCode?.trim()) return scenario.categoryCode.trim();
  const legacy = (scenario as any).subcategoryId;
  if (typeof legacy === "string" && legacy.trim()) return legacy.trim();
  return undefined;
};

const buildEvidence = (results: ScenarioResult[], maxItems = 6): string[] => {
  const sorted = [...results].sort((a, b) => a.rawScore - b.rawScore);
  return sorted.slice(0, maxItems).map((r) => {
    const recovery = r.turns.find((t) => t.turnType === "Recovery");
    const lastTurn = r.turns[r.turns.length - 1];
    const snippet = (recovery?.response || lastTurn?.response || "").slice(0, 220);
    return `scenario:${r.scenarioId.slice(-6)} severity:${r.severity} score:${r.rawScore.toFixed(2)} snippet:${snippet}`;
  });
};

// ---------------------------------------------------------------------------
// CRUD helpers
// ---------------------------------------------------------------------------

export const createReportRun = async (
  reportId: string,
  payload: Partial<ReportRun>,
): Promise<ReportRun> => {
  const now = new Date().toISOString();
  const doc = {
    reportId,
    status: "pending",
    dimensionScores: [],
    compositeScore: 0,
    rating: "",
    progress: 0,
    completedScenarios: 0,
    feedItems: [],
    ...payload,
    createdAt: now,
    updatedAt: now,
  };
  const insertedId = await createDocument(doc, DBCollectionsEnum.reportRuns);
  const created = await readDocument(
    new ObjectId(insertedId),
    DBCollectionsEnum.reportRuns,
  );
  if (!created) throw new Error("Failed to read created report run");
  return created as unknown as ReportRun;
};

export const getReportRunsByReportId = async (
  reportId: string,
): Promise<ReportRun[]> => {
  const runs = await getDocumentsByQueryFromDb<ReportRun>(
    { reportId },
    DBCollectionsEnum.reportRuns,
  );
  return runs || [];
};

/**
 * Get the latest run status for a report (aggregated across all runs in the latest batch).
 */
export const getLatestRunStatus = async (
  reportId: string,
): Promise<{
  status: string;
  progress: number;
  currentStep: string;
  currentTurnName?: string;
  totalScenarios: number;
  completedScenarios: number;
  dimensionProgress: Record<string, { completed: number; total: number }>;
  feedItems: ReportRun["feedItems"];
} | null> => {
  const runs = await getReportRunsByReportId(reportId);
  if (runs.length === 0) return null;

  // Find the latest batch — sort by createdAt desc, group by batchId
  const sorted = [...runs].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  );

  const latestBatchId = sorted[0].batchId;
  const batchRuns = latestBatchId
    ? sorted.filter((r) => r.batchId === latestBatchId)
    : [sorted[0]];

  // Aggregate progress across all runs in the batch
  let totalScenarios = 0;
  let completedScenarios = 0;
  const allFeedItems: ReportRun["feedItems"] = [];
  let overallStatus: string = "completed";
  const aggregatedDimProgress: Record<
    string,
    { completed: number; total: number }
  > = {};

  for (const run of batchRuns) {
    totalScenarios += run.totalScenarios ?? 0;
    completedScenarios += run.completedScenarios ?? 0;
    if (run.feedItems) {
      allFeedItems.push(...run.feedItems);
    }
    if (run.status === "running") overallStatus = "running";
    else if (run.status === "failed" && overallStatus !== "running")
      overallStatus = "failed";
    else if (run.status === "pending" && overallStatus === "completed")
      overallStatus = "pending";

    // Aggregate per-dimension progress across runs
    if (run.dimensionProgress) {
      for (const [dim, { completed, total }] of Object.entries(
        run.dimensionProgress,
      )) {
        if (!aggregatedDimProgress[dim]) {
          aggregatedDimProgress[dim] = { completed: 0, total: 0 };
        }
        aggregatedDimProgress[dim].completed += completed;
        aggregatedDimProgress[dim].total += total;
      }
    }
  }

  // Pass all feed items through — the run already manages its own window
  const feedItems = allFeedItems;

  const progress =
    totalScenarios > 0
      ? Math.round((completedScenarios / totalScenarios) * 100)
      : 0;

  const runningRun = batchRuns.find((r) => r.status === "running");
  const currentStep =
    runningRun?.currentStep ??
    (overallStatus === "completed" ? "Generating report" : "Pending");
  const currentTurnName = runningRun?.currentTurnName ?? "—";

  return {
    status: overallStatus,
    progress: overallStatus === "completed" ? 100 : progress,
    currentStep,
    currentTurnName,
    totalScenarios,
    completedScenarios,
    dimensionProgress: aggregatedDimProgress,
    feedItems,
  };
};

export const backfillReportDeepDive = async (params: {
  reportId: string;
  runId?: string;
}): Promise<{
  reportId: string;
  runsUpdated: number;
  scenariosUpdated: number;
  targetRunIds: string[];
}> => {
  const report = (await readDocument(
    new ObjectId(params.reportId),
    DBCollectionsEnum.reports,
  )) as unknown as Report | null;
  if (!report) throw new Error(`Report ${params.reportId} not found`);

  const scenarios = await getDocumentsByQueryFromDb<Scenario>(
    { reportId: params.reportId } as any,
    DBCollectionsEnum.scenarios,
  );

  const scenariosByDimension = new Map<string, Scenario[]>();
  for (const s of scenarios) {
    const arr = scenariosByDimension.get(s.categoryId) ?? [];
    arr.push(s);
    scenariosByDimension.set(s.categoryId, arr);
  }

  const scenarioOps: Array<any> = [];
  for (const [dimensionId, dimScenarios] of scenariosByDimension.entries()) {
    const defs = DIMENSION_CATEGORIES[dimensionId] ?? [];
    if (!defs.length) continue;
    const sorted = [...dimScenarios].sort((a, b) => {
      const ai = extractScenarioIndex(a.title);
      const bi = extractScenarioIndex(b.title);
      if (ai !== bi) return ai - bi;
      return new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime();
    });
    const perCategory = Math.max(1, Math.floor(sorted.length / defs.length));

    sorted.forEach((scenario, idx) => {
      if (!scenario._id) return;
      if (scenario.categoryCode?.trim()) return;

      const legacy = (scenario as any).subcategoryId;
      const targetIdx = Math.min(defs.length - 1, Math.floor(idx / perCategory));
      const targetCode =
        typeof legacy === "string" && legacy.trim() ? legacy.trim() : defs[targetIdx].id;

      scenarioOps.push({
        updateOne: {
          filter: { _id: scenario._id },
          update: { $set: { categoryCode: targetCode, updatedAt: new Date().toISOString() } },
        },
      });
    });
  }

  if (scenarioOps.length > 0) {
    await database
      .collection(DBCollectionsEnum.scenarios)
      .bulkWrite(scenarioOps, { ordered: false });
  }

  const refreshedScenarios = await getDocumentsByQueryFromDb<Scenario>(
    { reportId: params.reportId } as any,
    DBCollectionsEnum.scenarios,
  );
  const scenariosById = new Map(
    refreshedScenarios.map((s) => [String(s._id), s]),
  );

  const allRuns = await getReportRunsByReportId(params.reportId);
  const targetRuns = params.runId
    ? allRuns.filter((r) => String(r._id) === params.runId)
    : [...allRuns]
        .filter((r) => r.status === "completed")
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
        )
        .slice(0, 1);

  if (!targetRuns.length) {
    return {
      reportId: params.reportId,
      runsUpdated: 0,
      scenariosUpdated: scenarioOps.length,
      targetRunIds: [],
    };
  }

  const evaluatorModelId = resolveEvaluatorModelId(report.modelsToEvaluate);
  let runsUpdated = 0;

  for (const run of targetRuns) {
    if (!run._id) continue;
    const runId = String(run._id);

    const results = await getDocumentsByQueryFromDb<ScenarioResult>(
      { reportRunId: runId } as any,
      DBCollectionsEnum.scenarioResults,
    );
    const completed = results.filter((r) => r.status === "completed");
    if (!completed.length) continue;

    const dimScores =
      run.dimensionScores && run.dimensionScores.length > 0
        ? run.dimensionScores
        : aggregateDimensionScores(completed, report.dimensionWeights);
    const compositeScore =
      typeof run.compositeScore === "number" && run.compositeScore > 0
        ? run.compositeScore
        : computeComposite(dimScores);
    const { calibrationDelta, calibrationGap } =
      computeCalibrationMetrics(completed);
    const rating = getRating(compositeScore);
    const outlook = determineOutlook(dimScores, calibrationGap);
    const deploymentVerdict = determineDeploymentVerdict(rating);

    let overallSummary = run.executiveSummary;
    let dimensionSummaries: Record<string, string> = {};

    try {
      const summaries = await generateExecutiveSummaries({
        evaluatorModelId,
        modelName: run.modelName ?? "Model",
        compositeScore,
        rating,
        deploymentVerdict,
        outlook,
        totalScenarios: completed.length,
        calibrationGap,
        dimensionScores: dimScores,
      });
      overallSummary = summaries.overallSummary || overallSummary;
      dimensionSummaries = summaries.dimensionSummaries;
    } catch (err: any) {
      console.warn(
        `[AODIT] Backfill summaries failed for run ${runId}: ${err.message}`,
      );
    }

    const deepDiveInput = dimScores.map((dimScore) => {
      const dimensionId = dimScore.dimensionId;
      const defs = DIMENSION_CATEGORIES[dimensionId] ?? [];
      const dimResults = completed.filter((r) => r.dimensionId === dimensionId);
      const totals = new Map<string, { sum: number; count: number }>();

      for (const r of dimResults) {
        const scenario = scenariosById.get(r.scenarioId);
        const code = scenario ? getScenarioCategoryCode(scenario) : undefined;
        if (!code) continue;
        const prev = totals.get(code) ?? { sum: 0, count: 0 };
        prev.sum += r.rawScore;
        prev.count += 1;
        totals.set(code, prev);
      }

      const categories = defs.map((def) => {
        const stats = totals.get(def.id);
        return {
          id: def.id,
          name: def.name,
          score: stats && stats.count > 0 ? stats.sum / stats.count : null,
        };
      });

      return {
        dimensionId,
        score: dimScore.score,
        categories,
        evidence: buildEvidence(dimResults),
      };
    });

    const dimensionDeepDive: NonNullable<ReportRun["dimensionDeepDive"]> = {};
    for (const dim of deepDiveInput) {
      dimensionDeepDive[dim.dimensionId] = {
        categories: dim.categories,
        executiveSummary:
          dimensionSummaries[dim.dimensionId]?.trim() ||
          dimScores.find((d) => d.dimensionId === dim.dimensionId)?.executiveSummary ||
          undefined,
        insights: [],
      };
    }

    try {
      const deepDive = await generateDimensionDeepDive({
        evaluatorModelId,
        modelName: run.modelName ?? "Model",
        reportType: report.reportType,
        dimensions: deepDiveInput,
      });

      for (const dim of deepDiveInput) {
        const ai = deepDive.dimensions[dim.dimensionId];
        if (!ai) continue;
        const existing = dimensionDeepDive[dim.dimensionId];
        existing.categories = existing.categories.map((c) => ({
          ...c,
          commentary:
            ai.categories.find((ac) => ac.id === c.id)?.commentary || undefined,
        }));
        existing.executiveSummary = ai.executiveSummary || existing.executiveSummary;
        existing.insights = ai.insights ?? [];
      }
    } catch (err: any) {
      console.warn(
        `[AODIT] Backfill deep-dive AI failed for run ${runId}: ${err.message}`,
      );
    }

    await updateDocument<ReportRun>(
      runId,
      {
        compositeScore,
        rating,
        outlook,
        calibrationGap,
        calibrationDelta,
        deploymentVerdict,
        executiveSummary: overallSummary,
        dimensionScores: dimScores.map((d) => ({
          ...d,
          executiveSummary:
            dimensionSummaries[d.dimensionId]?.trim() || d.executiveSummary,
        })),
        dimensionDeepDive,
      },
      DBCollectionsEnum.reportRuns,
    );
    runsUpdated++;
  }

  return {
    reportId: params.reportId,
    runsUpdated,
    scenariosUpdated: scenarioOps.length,
    targetRunIds: targetRuns.map((r) => String(r._id)),
  };
};

// ---------------------------------------------------------------------------
// Launch
// ---------------------------------------------------------------------------

/**
 * Launch a full AODIT-5 test run for a report.
 *
 * Creates one ReportRun per model, then fires the execution engine asynchronously.
 * Returns immediately so the controller can respond to the client.
 */
export const launchReportRun = async (
  reportId: string,
): Promise<{ batchId: string; runs: ReportRun[] }> => {
  // Load report to get config
  const report = (await readDocument(
    new ObjectId(reportId),
    DBCollectionsEnum.reports,
  )) as unknown as Report | null;

  if (!report) throw new Error(`Report ${reportId} not found`);

  if (report.status === "running") {
    throw new Error("Report is already running");
  }

  const modelsToTest = report.modelsToTest ?? ["Claude"];
  const scenariosPerDimension = report.scenariosPerDimension ?? 20;
  const totalScenarios = scenariosPerDimension * 5; // 5 dimensions
  const batchId = crypto.randomUUID();
  const now = new Date().toISOString();

  // Update report status to running
  await updateDocument<Report>(
    reportId,
    { status: "running" as any, updatedAt: now },
    DBCollectionsEnum.reports,
  );

  // Create one ReportRun per model
  const runs: ReportRun[] = [];
  const runIds = new Map<string, string>();

  for (const modelName of modelsToTest) {
    const run = await createReportRun(reportId, {
      batchId,
      modelName,
      status: "pending",
      progress: 0,
      currentStep: "Generating scenarios",
      totalScenarios,
      completedScenarios: 0,
      startedAt: now,
    });
    runs.push(run);
    const runId = run._id != null ? String(run._id) : "";
    runIds.set(modelName, runId);
  }

  // Fire execution engine asynchronously — don't await
  executeReport(reportId, batchId, runIds).catch((err) => {
    console.error(`[AODIT] executeReport failed: ${err.message}`);
  });

  return { batchId, runs };
};
