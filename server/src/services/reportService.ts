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

import { Report } from "src/models/types/report";
import { Scenario } from "src/models/types/scenario";

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

/** Seed 100 scenarios (20 per dimension) for a new report. */
const seedScenariosForReport = async (reportId: string): Promise<void> => {
  const now = new Date().toISOString();
  const scenarios: Omit<Scenario, "_id">[] = [];

  for (const dimensionId of AODIT_DIMENSIONS) {
    for (let i = 0; i < 20; i++) {
      scenarios.push({
        reportId,
        categoryId: dimensionId,
        title: `${dimensionId} scenario ${i + 1}`,
        description: `Scenario for ${dimensionId} (${i + 1}/20)`,
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
  const payload = {
    ...data,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
  };
  delete payload._id; // Let MongoDB generate _id
  const insertedId = await createDocument(payload, DBCollectionsEnum.reports);
  const reportIdStr = (insertedId as ObjectId).toString();
  await seedScenariosForReport(reportIdStr);
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
  data: Partial<Pick<Report, "name" | "description" | "reportType" | "status">>,
): Promise<Report | null> => {
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
