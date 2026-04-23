/**
 * ReportRunService — create, fetch, and launch report runs.
 * Wires up the real aodit execution engine for AI agent testing.
 */

import {
  DBCollectionsEnum,
  getDocumentsByQueryFromDb,
} from "../../models/mongoDb";
import {
  createDocument,
  readDocument,
  updateDocument,
} from "../../models/mongoDb/crudOperations";
import {
  getFrameworkDefinition,
  resolveFrameworkVersion,
} from "./frameworkRegistry";

import { Agent } from "../../models/types/agent";
import { ObjectId } from "mongodb";
import { Report } from "../../models/types/report";
import { ReportRun } from "../../models/types/reportRun";
import {
  AgentUnreachableError,
  checkAgentLiveness,
  checkEvaluatorLiveness,
  fetchEvaluatorModels,
} from "../../utils/agentClient";
import crypto from "crypto";
import { executeAgentReport, executeReport } from "./executionEngine";

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
    else if (run.status === "stopped" && overallStatus !== "running")
      overallStatus = "stopped";
    else if (
      run.status === "failed" &&
      overallStatus !== "running" &&
      overallStatus !== "stopped"
    )
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

/**
 * Perform an explicit pre-flight connection test against the selected agent.
 * This allows the UI to verify reachability before launching a full run.
 */
export const testAgentConnection = async (
  reportId: string,
  overrideAgentId?: string,
): Promise<{
  success: true;
  message: string;
  agentId: string;
  agentName: string;
  agentUrl: string;
  replyPreview: string;
}> => {
  const report = (await readDocument(
    new ObjectId(reportId),
    DBCollectionsEnum.reports,
  )) as unknown as Report | null;

  if (!report) throw new Error(`Report ${reportId} not found`);

  const resolvedAgentId = overrideAgentId ?? report.agentId;
  if (!resolvedAgentId) {
    throw new Error("Select an agent before testing the connection.");
  }

  const agent = (await readDocument(
    new ObjectId(resolvedAgentId),
    DBCollectionsEnum.agents,
  )) as unknown as Agent | null;

  if (!agent) {
    throw new Error(`Assigned agent (${resolvedAgentId}) not found`);
  }

  if (!agent.agentUrl || agent.agentUrl.trim() === "") {
    throw new Error(
      `Agent "${agent.name}" does not have an Agent URL configured. ` +
        "Add the URL in the Agent settings before testing the connection.",
    );
  }

  const reply = await checkAgentLiveness(agent.agentUrl);
  const replyPreview = reply.length > 200 ? `${reply.slice(0, 197)}...` : reply;

  return {
    success: true,
    message: `Connection successful for agent "${agent.name}".`,
    agentId: String(agent._id),
    agentName: agent.name,
    agentUrl: agent.agentUrl,
    replyPreview,
  };
};

/**
 * Probe the per-agent evaluator endpoint (if configured) to verify that the
 * judge model is reachable. Mirrors testAgentConnection but targets an
 * OpenAI-compatible endpoint.
 */
export const testEvaluatorConnection = async (
  agentId: string,
  overrides?: {
    evaluatorUrl?: string;
    evaluatorApiKey?: string;
    evaluatorModel?: string;
  },
): Promise<{
  success: true;
  message: string;
  agentId: string;
  agentName: string;
  evaluatorUrl: string;
  replyPreview: string;
}> => {
  const agent = (await readDocument(
    new ObjectId(agentId),
    DBCollectionsEnum.agents,
  )) as unknown as Agent | null;

  if (!agent) throw new Error(`Agent ${agentId} not found`);

  const evaluatorUrl = overrides?.evaluatorUrl?.trim() || agent.evaluatorUrl?.trim();
  const evaluatorApiKey =
    overrides?.evaluatorApiKey?.trim() || agent.evaluatorApiKey?.trim() || undefined;
  const evaluatorModel =
    overrides?.evaluatorModel?.trim() || agent.evaluatorModel?.trim() || undefined;

  if (!evaluatorUrl) {
    throw new Error(
      `Agent "${agent.name}" does not have an Evaluator URL configured. ` +
        "Add it under Evaluator (Judge) Endpoint before testing.",
    );
  }

  const reply = await checkEvaluatorLiveness(evaluatorUrl, evaluatorApiKey, evaluatorModel);
  const replyPreview = reply.length > 200 ? `${reply.slice(0, 197)}...` : reply;

  return {
    success: true,
    message: `Evaluator connection successful for agent "${agent.name}".`,
    agentId: String(agent._id),
    agentName: agent.name,
    evaluatorUrl,
    replyPreview,
  };
};

/**
 * Discover available model IDs from a per-agent evaluator endpoint.
 * Uses in-form overrides (URL/API key) when provided, mirroring evaluator test behavior.
 */
export const getEvaluatorModels = async (
  agentId: string,
  overrides?: {
    evaluatorUrl?: string;
    evaluatorApiKey?: string;
  },
): Promise<{
  success: true;
  agentId: string;
  agentName: string;
  evaluatorUrl: string;
  models: string[];
}> => {
  const agent = (await readDocument(
    new ObjectId(agentId),
    DBCollectionsEnum.agents,
  )) as unknown as Agent | null;

  if (!agent) throw new Error(`Agent ${agentId} not found`);

  const evaluatorUrl =
    overrides?.evaluatorUrl?.trim() || agent.evaluatorUrl?.trim();
  const evaluatorApiKey =
    overrides?.evaluatorApiKey?.trim() ||
    agent.evaluatorApiKey?.trim() ||
    undefined;

  if (!evaluatorUrl) {
    throw new Error(
      `Agent "${agent.name}" does not have an Evaluator URL configured. ` +
        "Add it under Evaluator (Judge) Endpoint before fetching models.",
    );
  }

  const models = await fetchEvaluatorModels(evaluatorUrl, evaluatorApiKey);

  return {
    success: true,
    agentId: String(agent._id),
    agentName: agent.name,
    evaluatorUrl,
    models,
  };
};

// ---------------------------------------------------------------------------
// Launch
// ---------------------------------------------------------------------------

/**
 * Launch a full aodit test run for a report.
 *
 * - "benchmark" mode: creates one ReportRun per frontier model, fires the
 *   OpenRouter-based execution engine asynchronously.
 * - "agent" mode: performs a liveness check against the registered agent URL,
 *   then creates a single ReportRun (labelled with the agent's name) and fires
 *   the agent-targeted execution engine asynchronously.
 *
 * Returns immediately so the controller can respond to the client.
 * Throws synchronously (before updating DB) if the agent liveness check fails.
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

  const evaluationMode = report.evaluationMode ?? "benchmark";
  const scenariosPerDimension = report.scenariosPerDimension ?? 20;
  const frameworkVersionForRun = resolveFrameworkVersion(
    report.frameworkVersion,
    "aodit_v1",
  );
  const framework = getFrameworkDefinition(frameworkVersionForRun);
  const totalScenarios = scenariosPerDimension * framework.dimensions.length;
  const batchId = crypto.randomUUID();
  const now = new Date().toISOString();

  // ── AGENT EVALUATION MODE ──────────────────────────────────────────────────
  if (evaluationMode === "agent") {
    if (!report.agentId) {
      throw new Error("Agent evaluation mode requires an assigned agent");
    }

    // Resolve the agent document to get the URL
    const agent = (await readDocument(
      new ObjectId(report.agentId),
      DBCollectionsEnum.agents,
    )) as unknown as Agent | null;

    if (!agent) {
      throw new Error(`Assigned agent (${report.agentId}) not found`);
    }

    if (!agent.agentUrl || agent.agentUrl.trim() === "") {
      throw new Error(
        `Agent "${agent.name}" does not have an Agent URL configured. ` +
          "Add the URL in the Agent settings before running in Agent evaluation mode.",
      );
    }

    // Liveness check — throws AgentUnreachableError if agent doesn't respond
    console.log(
      `[aodit] Performing liveness check for agent "${agent.name}" at ${agent.agentUrl}`,
    );
    try {
      await checkAgentLiveness(agent.agentUrl);
      console.log(`[aodit] Liveness check passed for agent "${agent.name}"`);
    } catch (err) {
      if (err instanceof AgentUnreachableError) {
        throw err; // Re-throw so the controller returns 4xx to the client
      }
      throw err;
    }

    // Update report status to running
    await updateDocument<Report>(
      reportId,
      { status: "running" as any, updatedAt: now },
      DBCollectionsEnum.reports,
    );

    // Create a single run using the agent name as "modelName" for display
    const run = await createReportRun(reportId, {
      batchId,
      frameworkVersion: frameworkVersionForRun,
      modelName: agent.name,
      status: "pending",
      progress: 0,
      currentStep: "Generating scenarios",
      totalScenarios,
      completedScenarios: 0,
      startedAt: now,
    });
    const runId = run._id != null ? String(run._id) : "";
    const runIds = new Map<string, string>([[agent.name, runId]]);

    // Fire agent execution engine asynchronously
    executeAgentReport(reportId, batchId, runIds, agent.agentUrl).catch((err) => {
      console.error(`[aodit] executeAgentReport failed: ${err.message}`);
    });

    return { batchId, runs: [run] };
  }

  // ── BENCHMARK MODE (default) ───────────────────────────────────────────────
  const modelsToTest = report.modelsToTest ?? ["Claude"];

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
      frameworkVersion: frameworkVersionForRun,
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
    console.error(`[aodit] executeReport failed: ${err.message}`);
  });

  return { batchId, runs };
};

// ---------------------------------------------------------------------------
// Stop
// ---------------------------------------------------------------------------

/**
 * Stop a running report. Marks all active runs in the latest batch as "stopped"
 * and resets the report status back to "draft" so it can be re-launched.
 */
export const stopReport = async (reportId: string): Promise<void> => {
  const runs = await getReportRunsByReportId(reportId);
  if (runs.length === 0) throw new Error("No runs found for this report");

  // Find the latest batch — same logic as getLatestRunStatus
  const sorted = [...runs].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() -
      new Date(a.createdAt ?? 0).getTime(),
  );
  const latestBatchId = sorted[0].batchId;
  const batchRuns = latestBatchId
    ? sorted.filter((r) => r.batchId === latestBatchId)
    : [sorted[0]];

  const now = new Date().toISOString();

  // Mark all running/pending runs in the batch as stopped
  for (const run of batchRuns) {
    if (run.status === "running" || run.status === "pending") {
      await updateDocument<ReportRun>(
        String(run._id),
        { status: "stopped" as any, updatedAt: now },
        DBCollectionsEnum.reportRuns,
      );
    }
  }

  // Reset report to draft so it can be re-launched
  await updateDocument<Report>(
    reportId,
    { status: "draft" as any, updatedAt: now },
    DBCollectionsEnum.reports,
  );
};
