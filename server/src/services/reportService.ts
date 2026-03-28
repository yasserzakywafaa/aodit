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
  FrameworkVersion,
} from "src/models/types/report";
import { Scenario } from "src/models/types/scenario";
import {
  DEFAULT_FRAMEWORK_VERSION,
  getFrameworkDefinition,
  resolveFrameworkVersion,
} from "./reports/frameworkRegistry";

const DEFAULT_SCENARIOS_PER_DIMENSION: ScenariosPerDimension = 20;

function sumWeights(weights: DimensionWeights, dimensions: string[]): number {
  return dimensions.reduce((sum, dim) => sum + (weights[dim] ?? 0), 0);
}

/** Seed scenariosPerDimension * dimensionCount scenarios for a new report. */
const seedScenariosForReport = async (
  reportId: string,
  scenariosPerDimension: ScenariosPerDimension = DEFAULT_SCENARIOS_PER_DIMENSION,
  frameworkVersion?: FrameworkVersion,
): Promise<void> => {
  const now = new Date().toISOString();
  const scenarios: Omit<Scenario, "_id">[] = [];
  const perDim = scenariosPerDimension;
  const framework = getFrameworkDefinition(
    resolveFrameworkVersion(frameworkVersion, DEFAULT_FRAMEWORK_VERSION),
  );

  for (const dimensionId of framework.dimensions) {
    const categoryCodes = (framework.dimensionCategories[dimensionId] ?? []).map(
      (category) => category.id,
    );
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
        turnTemplates: framework.turnTypes.map((type, idx) => ({
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
  const frameworkVersion = resolveFrameworkVersion(
    data.frameworkVersion,
    DEFAULT_FRAMEWORK_VERSION,
  );
  const framework = getFrameworkDefinition(frameworkVersion);
  const dimensionWeights: DimensionWeights =
    data.dimensionWeights ??
    (framework.defaultWeights as unknown as DimensionWeights);

  if (
    dimensionWeights &&
    Math.abs(sumWeights(dimensionWeights, framework.dimensions as string[]) - 1) >
      0.001
  ) {
    throw new Error("Dimension weights must sum to 1 (100%)");
  }

  const payload = {
    ...data,
    scenariosPerDimension,
    frameworkVersion,
    dimensionWeights,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  };
  delete payload._id;
  const insertedId = await createDocument(payload, DBCollectionsEnum.reports);
  const reportIdStr = (insertedId as ObjectId).toString();
  await seedScenariosForReport(
    reportIdStr,
    scenariosPerDimension,
    frameworkVersion,
  );
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
      | "frameworkVersion"
      | "dimensionWeights"
      | "modelsToTest"
      | "modelsToEvaluate"
      | "agentId"
      | "evaluationMode"
    >
  >,
): Promise<Report | null> => {
  const current = (await getReportById(reportId)) as Report | null;
  const defaultFrameworkVersion: FrameworkVersion =
    current?.frameworkVersion ?? "aodit_v1";
  const effectiveFrameworkVersion = resolveFrameworkVersion(
    data.frameworkVersion ?? current?.frameworkVersion,
    defaultFrameworkVersion,
  );
  const framework = getFrameworkDefinition(effectiveFrameworkVersion);

  if (
    data.dimensionWeights &&
    Math.abs(sumWeights(data.dimensionWeights, framework.dimensions as string[]) - 1) >
      0.001
  ) {
    throw new Error("Dimension weights must sum to 1 (100%)");
  }

  const scenariosPerDimensionChanged =
    data.scenariosPerDimension != null &&
    current?.scenariosPerDimension != null &&
    data.scenariosPerDimension !== current.scenariosPerDimension;
  const frameworkVersionChanged =
    data.frameworkVersion != null &&
    data.frameworkVersion !== (current?.frameworkVersion ?? "aodit_v1");

  if (scenariosPerDimensionChanged || frameworkVersionChanged) {
    await deleteScenariosByReportId(reportId);
  }

  const now = new Date().toISOString();
  const payload = {
    ...data,
    frameworkVersion: effectiveFrameworkVersion,
    updatedAt: now,
  };
  const updated = await updateDocument<Report>(
    reportId,
    payload,
    DBCollectionsEnum.reports,
  );

  if (scenariosPerDimensionChanged || frameworkVersionChanged) {
    await seedScenariosForReport(
      reportId,
      data.scenariosPerDimension ??
        current?.scenariosPerDimension ??
        DEFAULT_SCENARIOS_PER_DIMENSION,
      effectiveFrameworkVersion,
    );
  }

  return updated as unknown as Report | null;
};

const getAllReports = async (page: number, limit: number) => {
  return await getPaginatedDocuments<Report>(
    {} as any,
    DBCollectionsEnum.reports,
    { pageNumber: page, pageSize: limit },
  );
};

const getReportsByAgentId = async (
  agentId: string,
  page: number,
  limit: number,
) => {
  return await getPaginatedDocuments<Report>(
    { agentId } as any,
    DBCollectionsEnum.reports,
    { pageNumber: page, pageSize: limit },
  );
};

const ReportServices = {
  getReportsCount,
  createReport,
  getUserReports,
  getUserReportsCount,
  getReportById,
  updateReport,
  deleteReport,
  getAllReports,
  getReportsByAgentId,
};

export default ReportServices;
