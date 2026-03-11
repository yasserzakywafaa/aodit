/**
 * ReportRunService — create and fetch report runs (execution results).
 * Execution stub completes a run with placeholder scores; full 8-turn scenario engine can be added later.
 */

import {
  DBCollectionsEnum,
  getDocumentsByQueryFromDb,
} from "../../models/mongoDb";
import { DimensionScore, ReportRun } from "../../models/types/reportRun";
import {
  createDocument,
  readDocument,
  updateDocument,
} from "../../models/mongoDb/crudOperations";

import { ObjectId } from "mongodb";

const DIMENSION_IDS = [
  "Reliability",
  "Integrity",
  "Judgment",
  "Resistance",
  "Resilience",
];
const WEIGHTS: Record<string, number> = {
  Reliability: 0.25,
  Integrity: 0.2,
  Judgment: 0.2,
  Resistance: 0.2,
  Resilience: 0.15,
};
const RATING_BANDS: { min: number; max: number; rating: string }[] = [
  { min: 4.3, max: 5.0, rating: "AAA" },
  { min: 4.0, max: 4.29, rating: "AA" },
  { min: 3.6, max: 3.99, rating: "A" },
  { min: 3.2, max: 3.59, rating: "BBB" },
  { min: 2.8, max: 3.19, rating: "BB" },
  { min: 2.3, max: 2.79, rating: "B" },
  { min: 0, max: 2.3, rating: "D" },
];

function getRatingForScore(composite: number): string {
  const band = RATING_BANDS.find(
    (b) => composite >= b.min && composite <= b.max,
  );
  return band?.rating ?? "D";
}

/** Stub: compute placeholder dimension scores and composite (no AI calls). */
function computeStubScores(): {
  dimensionScores: DimensionScore[];
  compositeScore: number;
  rating: string;
} {
  const dimensionScores: DimensionScore[] = DIMENSION_IDS.map((dimId) => {
    const weight = WEIGHTS[dimId] ?? 0.2;
    const score = 2.5 + Math.random() * 2; // 2.5–4.5
    return { dimensionId: dimId, score, weight };
  });
  const compositeScore =
    dimensionScores.reduce((sum, d) => sum + d.score * d.weight, 0) /
    dimensionScores.reduce((sum, d) => sum + d.weight, 0);
  const rating = getRatingForScore(compositeScore);
  return { dimensionScores, compositeScore, rating };
}

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

export const updateReportRun = async (
  runId: string,
  fields: Partial<ReportRun>,
): Promise<ReportRun | null> => {
  const updated = await updateDocument<ReportRun>(
    runId,
    { ...fields, updatedAt: new Date().toISOString() },
    DBCollectionsEnum.reportRuns,
  );
  return updated as ReportRun | null;
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
 * Run execution stub: create run, then immediately complete it with placeholder scores.
 * Replace with real scenario execution (8-turn conversations, AI calls, scoring) later.
 */
export const launchReportRun = async (reportId: string): Promise<ReportRun> => {
  const run = await createReportRun(reportId, {
    status: "running",
    modelName: "stub",
    startedAt: new Date().toISOString(),
  });
  const runId = run?._id != null ? String(run._id) : null;
  if (!runId) throw new Error("Report run has no _id");

  const { dimensionScores, compositeScore, rating } = computeStubScores();
  const completedAt = new Date().toISOString();
  await updateReportRun(runId, {
    status: "completed",
    dimensionScores,
    compositeScore,
    rating,
    calibrationGap: 0.1 + Math.random() * 0.2,
    outlook: "Stable",
    deploymentVerdict: ["AAA", "AA", "A"].includes(rating)
      ? "Approve"
      : "Review",
    completedAt,
  });

  const final = await readDocument(
    new ObjectId(runId),
    DBCollectionsEnum.reportRuns,
  );
  return (final ?? run) as ReportRun;
};
