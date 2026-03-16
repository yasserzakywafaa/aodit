import { NextFunction, Request, Response } from "express";

import {
  DBCollectionsEnum,
  getDocumentsByQueryFromDb,
} from "../models/mongoDb";

import DashboardServices from "../services/dashboardService";
import ReportServices from "../services/reportService";
import * as ReportRunService from "../services/reports/reportRunService";
import { ScenarioResult } from "../models/types/scenarioResult";

const getUsersCount = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const usersCount = await DashboardServices.getUsersCount();
    response.status(200).json({ count: usersCount });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const pageNumber = parseInt(request.query.pageNumber as string) || 1;
  const pageSize = parseInt(request.query.pageSize as string) || 10;

  try {
    const { results, paging } = await DashboardServices.getAllUsers(
      pageNumber,
      pageSize,
    );

    console.log("✅ Users fetched successfully:", {
      totalCount: paging?.totalCount,
      pageNumber,
      pageSize,
    });

    response.status(200).json({
      results,
      paging: paging || {
        pageNumber: 1,
        pageSize: 10,
        totalCount: 0,
        totalPagesCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const user = await DashboardServices.getUserById(request.params.userId);
    response.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateUserInfo = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const user = await DashboardServices.updateUserInfo(
      request.params.userId,
      request.body,
    );
    response.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const blockUser = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const user = await DashboardServices.blockUser(request.params.userId);
    response.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const unblockUser = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const user = await DashboardServices.unblockUser(request.params.userId);
    response.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const user = await DashboardServices.deleteUser(request.params.userId);
    response.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Reports
const getReportsCount = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const reportsCount = await ReportServices.getReportsCount();
    response.status(200).json({ count: reportsCount });
  } catch (error) {
    next(error);
  }
};

const createReport = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const report = await ReportServices.createReport(request.body);
    response.status(201).json(report);
  } catch (error) {
    next(error);
  }
};

const getUserReports = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { userId, page, limit } = request.query;
    const reports = await ReportServices.getUserReports(
      userId as string,
      Number(page) || 1,
      Number(limit) || 10,
    );
    response.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

const getReportById = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const report = await ReportServices.getReportById(
      request.query.reportId as string,
    );
    response.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

const updateReport = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const reportId = request.params.reportId;
    const {
      name,
      description,
      reportType,
      status,
      scenariosPerDimension,
      dimensionWeights,
      modelsToTest,
      modelsToEvaluate,
    } = request.body;
    const updated = await ReportServices.updateReport(reportId, {
      name,
      description,
      reportType,
      status,
      scenariosPerDimension,
      dimensionWeights,
      modelsToTest,
      modelsToEvaluate,
    });
    response.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteReport = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const report = await ReportServices.deleteReport(
      request.params.reportId,
    );
    response.status(200).json(report);
  } catch (error) {
    next(error);
  }
};

const getUserReportsCount = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const count = await ReportServices.getUserReportsCount(
      request.params.userId,
    );
    response.status(200).json({ count });
  } catch (error) {
    next(error);
  }
};

const launchReport = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const reportId = request.params.reportId;
    const result = await ReportRunService.launchReportRun(reportId);
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const getRunStatus = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const status = await ReportRunService.getLatestRunStatus(
      request.params.reportId,
    );
    if (!status) {
      response.status(404).json({ message: "No runs found for this report" });
      return;
    }
    response.status(200).json(status);
  } catch (error) {
    next(error);
  }
};

const getReportRuns = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const runs = await ReportRunService.getReportRunsByReportId(
      request.params.reportId,
    );
    response.status(200).json(runs);
  } catch (error) {
    next(error);
  }
};

const getScenarioResults = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { reportId } = request.params;
    const { runId } = request.query as { runId?: string };

    const query = runId
      ? { reportRunId: runId }
      : { reportId };

    const results = await getDocumentsByQueryFromDb<ScenarioResult>(
      query as any,
      DBCollectionsEnum.scenarioResults,
    );
    response.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

const DashboardController = {
  getUsersCount,
  getAllUsers,
  getUserById,
  updateUserInfo,
  blockUser,
  unblockUser,
  deleteUser,
  // Reports
  getReportsCount,
  createReport,
  getUserReports,
  getReportById,
  updateReport,
  deleteReport,
  getUserReportsCount,
  launchReport,
  getReportRuns,
  getRunStatus,
  getScenarioResults,
};

export default DashboardController;
