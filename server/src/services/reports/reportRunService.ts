/**
 * ReportRunService — create, fetch, and launch report runs.
 * Wires up the real AODIT-5 execution engine for AI agent testing.
 */

import {
  DBCollectionsEnum,
  getDocumentsByQueryFromDb,
} from "../../models/mongoDb";
import { ReportRun } from "../../models/types/reportRun";
import { Report } from "../../models/types/report";
import {
  createDocument,
  readDocument,
} from "../../models/mongoDb/crudOperations";
import { ObjectId } from "mongodb";
import crypto from "crypto";
import { executeReport } from "./executionEngine";

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
  totalScenarios: number;
  completedScenarios: number;
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
  }

  // Sort feed items by id descending, take latest 8
  const feedItems = allFeedItems.slice(0, 8);

  const progress =
    totalScenarios > 0
      ? Math.round((completedScenarios / totalScenarios) * 100)
      : 0;

  const currentStep =
    batchRuns.find((r) => r.status === "running")?.currentStep ??
    (overallStatus === "completed" ? "Generating report" : "Pending");

  return {
    status: overallStatus,
    progress: overallStatus === "completed" ? 100 : progress,
    currentStep,
    totalScenarios,
    completedScenarios,
    feedItems,
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

  const modelsToTest = report.modelsToTest ?? ["Claude"];
  const scenariosPerDimension = report.scenariosPerDimension ?? 20;
  const totalScenarios = scenariosPerDimension * 5; // 5 dimensions
  const batchId = crypto.randomUUID();
  const now = new Date().toISOString();

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
