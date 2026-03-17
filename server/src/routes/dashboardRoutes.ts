import DashboardController from "../controllers/DashboardController";
import END_POINTS from "../models/endpoints";
import { Router } from "express";

const dashboardRoutes = Router();

// Define API routes
dashboardRoutes.get(
  END_POINTS.DASHBOARD.OVERVIEW.GET_USERS_COUNT,
  DashboardController.getUsersCount,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.OVERVIEW.GET_REPORTS_COUNT,
  DashboardController.getReportsCount,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.USERS.GET_ALL_USERS,
  DashboardController.getAllUsers,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.USERS.GET_USER_BY_ID(":userId"),
  DashboardController.getUserById,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.USERS.GET_USER_REPORTS_COUNT(":userId"),
  DashboardController.getUserReportsCount,
);

dashboardRoutes.put(
  END_POINTS.DASHBOARD.USERS.UPDATE_USER_INFO(":userId"),
  DashboardController.updateUserInfo,
);

dashboardRoutes.post(
  END_POINTS.DASHBOARD.ADMIN.USERS.BLOCK_USER(":userId"),
  DashboardController.blockUser,
);

dashboardRoutes.post(
  END_POINTS.DASHBOARD.ADMIN.USERS.UNBLOCK_USER(":userId"),
  DashboardController.unblockUser,
);

dashboardRoutes.delete(
  END_POINTS.DASHBOARD.USERS.DELETE_USER(":userId"),
  DashboardController.deleteUser,
);

// Report Routes
dashboardRoutes.post(
  END_POINTS.DASHBOARD.REPORTS.CREATE_REPORT,
  DashboardController.createReport,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.REPORTS.GET_USER_REPORTS,
  DashboardController.getUserReports,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.REPORTS.GET_REPORT_BY_ID,
  DashboardController.getReportById,
);

dashboardRoutes.put(
  END_POINTS.DASHBOARD.REPORTS.UPDATE_REPORT(":reportId"),
  DashboardController.updateReport,
);

dashboardRoutes.delete(
  END_POINTS.DASHBOARD.REPORTS.DELETE_REPORT(":reportId"),
  DashboardController.deleteReport,
);

dashboardRoutes.post(
  END_POINTS.DASHBOARD.REPORTS.LAUNCH_REPORT(":reportId"),
  DashboardController.launchReport,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.REPORTS.GET_REPORT_RUNS(":reportId"),
  DashboardController.getReportRuns,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.REPORTS.GET_RUN_STATUS(":reportId"),
  DashboardController.getRunStatus,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.REPORTS.GET_SCENARIO_RESULTS(":reportId"),
  DashboardController.getScenarioResults,
);

dashboardRoutes.post(
  END_POINTS.DASHBOARD.REPORTS.BACKFILL_DEEP_DIVE(":reportId"),
  DashboardController.backfillReportDeepDive,
);

export default dashboardRoutes;
