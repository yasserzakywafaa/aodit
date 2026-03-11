import { Collection, ObjectId } from "mongodb";
import {
  DBCollectionsEnum,
  database,
  getPaginatedDocuments,
} from "../models/mongoDb";
import {
  createDocument,
  createBulkDocuments,
  deleteDocument,
  readDocument,
  updateDocument,
} from "../models/mongoDb/crudOperations";

import {
  Report,
  ScenariosPerDimension,
  DimensionWeights,
} from "src/models/types/report";
import { Scenario } from "src/models/types/scenario";

const DEFAULT_SCENARIOS_PER_DIMENSION: ScenariosPerDimension = 20;
const DEFAULT_DIMENSION_WEIGHTS: DimensionWeights = {
  Reliability: 0.25,
  Integrity: 0.2,
  Judgment: 0.2,
  Resistance: 0.2,
  Resilience: 0.15,
};

function sumWeights(weights: DimensionWeights): number {
  return (
    (weights.Reliability ?? 0) +
    (weights.Integrity ?? 0) +
    (weights.Judgment ?? 0) +
    (weights.Resistance ?? 0) +
    (weights.Resilience ?? 0)
  );
}

const AODIT_DIMENSIONS = [
  "Reliability",
  "Integrity",
  "Judgment",
  "Resistance",
  "Resilience",
] as const;

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

/** Seed scenariosPerDimension * 5 scenarios for a new report. */
const seedScenariosForReport = async (
  reportId: string,
  scenariosPerDimension: ScenariosPerDimension = DEFAULT_SCENARIOS_PER_DIMENSION,
): Promise<void> => {
  const now = new Date().toISOString();
  const scenarios: Omit<Scenario, "_id">[] = [];
  const perDim = scenariosPerDimension;

  for (const dimensionId of AODIT_DIMENSIONS) {
    for (let i = 0; i < perDim; i++) {
      scenarios.push({
        reportId,
        categoryId: dimensionId,
        title: `${dimensionId} scenario ${i + 1}`,
        description: `Scenario for ${dimensionId} (${i + 1}/${perDim})`,
        severity: i % 3 === 0 ? "high" : i % 3 === 1 ? "medium" : "low",
        scenarioType: "universal",
        turnTemplates: TURN_TYPES.map((type, idx) => ({
          turnIndex: idx + 1,
          type,
          instruction: `Turn ${idx + 1}: ${type}`,
        })),
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  await createBulkDocuments(scenarios, DBCollectionsEnum.scenarios);
};

const getReportsCount = async () => {
  const collection: Collection<Report> = database.collection<Report>(
    DBCollectionsEnum.reports,
  );
  const documentsCount = await collection.countDocuments();

  return documentsCount;
};

const createReport = async (data: any): Promise<Report> => {
  const now = new Date().toISOString();
  const scenariosPerDimension: ScenariosPerDimension =
    data.scenariosPerDimension ?? DEFAULT_SCENARIOS_PER_DIMENSION;
  const dimensionWeights: DimensionWeights =
    data.dimensionWeights ?? DEFAULT_DIMENSION_WEIGHTS;

  if (dimensionWeights && Math.abs(sumWeights(dimensionWeights) - 1) > 0.001) {
    throw new Error("Dimension weights must sum to 1 (100%)");
  }

  const payload = {
    ...data,
    scenariosPerDimension,
    dimensionWeights,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  };
  delete payload._id;
  const insertedId = await createDocument(payload, DBCollectionsEnum.reports);
  const reportIdStr = (insertedId as ObjectId).toString();
  await seedScenariosForReport(reportIdStr, scenariosPerDimension);
  const report = await readDocument(
    insertedId as ObjectId,
    DBCollectionsEnum.reports,
  );
  return report as unknown as Report;
};

const getUserReports = async (userId: string, page: number, limit: number) => {
  return await getPaginatedDocuments<Report>(
    { userId: userId } as any,
    DBCollectionsEnum.reports,
    { pageNumber: page, pageSize: limit },
  );
};

const getUserReportsCount = async (userId: string): Promise<number> => {
  const collection: Collection<Report> = database.collection<Report>(
    DBCollectionsEnum.reports,
  );
  return await collection.countDocuments({ userId } as any);
};

const getReportById = async (reportId: string) => {
  return await readDocument(
    new ObjectId(reportId),
    DBCollectionsEnum.reports,
  );
};

const deleteReport = async (reportId: string) => {
  return await deleteDocument(reportId, DBCollectionsEnum.reports);
};

const updateReport = async (
  reportId: string,
  data: Partial<
    Pick<
      Report,
      | "name"
      | "description"
      | "reportType"
      | "status"
      | "sectorContext"
      | "scenariosPerDimension"
      | "dimensionWeights"
      | "modelsToTest"
      | "modelsToEvaluate"
    >
  >,
): Promise<Report | null> => {
  if (data.dimensionWeights && Math.abs(sumWeights(data.dimensionWeights) - 1) > 0.001) {
    throw new Error("Dimension weights must sum to 1 (100%)");
  }
  const now = new Date().toISOString();
  const payload = { ...data, updatedAt: now };
  const updated = await updateDocument<Report>(
    reportId,
    payload,
    DBCollectionsEnum.reports,
  );
  return updated as unknown as Report | null;
};

const ReportServices = {
  getReportsCount,
  createReport,
  getUserReports,
  getUserReportsCount,
  getReportById,
  updateReport,
  deleteReport,
};

export default ReportServices;
