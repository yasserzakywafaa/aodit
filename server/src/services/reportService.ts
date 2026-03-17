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

// AODIT-5 category codes per dimension (treated as categories, not subcategories).
const DIMENSION_CATEGORY_CODES: Record<(typeof AODIT_DIMENSIONS)[number], string[]> = {
  Reliability: ["R1", "R2", "R3", "R4", "R5"],
  Integrity: ["I1", "I2", "I3", "I4", "I5"],
  Judgment: ["J1", "J2", "J3", "J4", "J5"],
  Resistance: ["T1", "T2", "T3", "T4", "T5"],
  Resilience: ["Z1", "Z2", "Z3", "Z4", "Z5"],
};

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
    const categoryCodes = DIMENSION_CATEGORY_CODES[dimensionId];
    const perCategory = Math.max(1, Math.floor(perDim / categoryCodes.length));

    for (let i = 0; i < perDim; i++) {
      const categoryIndex = Math.min(
        categoryCodes.length - 1,
        Math.floor(i / perCategory),
      );
      scenarios.push({
        reportId,
        categoryId: dimensionId,
        categoryCode: categoryCodes[categoryIndex],
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

/** Delete all scenarios for a report (used when re-seeding after scenariosPerDimension change). */
const deleteScenariosByReportId = async (reportId: string): Promise<void> => {
  const collection = database.collection(DBCollectionsEnum.scenarios);
  await collection.deleteMany({ reportId });
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
  // Cascade: remove all related data before deleting the report itself
  await database.collection(DBCollectionsEnum.scenarios).deleteMany({ reportId });
  await database.collection(DBCollectionsEnum.reportRuns).deleteMany({ reportId });
  await database.collection(DBCollectionsEnum.scenarioResults).deleteMany({ reportId });
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

  const current = (await getReportById(reportId)) as Report | null;
  const scenariosPerDimensionChanged =
    data.scenariosPerDimension != null &&
    current?.scenariosPerDimension != null &&
    data.scenariosPerDimension !== current.scenariosPerDimension;

  if (scenariosPerDimensionChanged) {
    await deleteScenariosByReportId(reportId);
  }

  const now = new Date().toISOString();
  const payload = { ...data, updatedAt: now };
  const updated = await updateDocument<Report>(
    reportId,
    payload,
    DBCollectionsEnum.reports,
  );

  if (scenariosPerDimensionChanged && data.scenariosPerDimension != null) {
    await seedScenariosForReport(reportId, data.scenariosPerDimension);
  }

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
