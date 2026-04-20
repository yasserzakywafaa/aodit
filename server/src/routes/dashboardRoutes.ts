import DashboardController from "../controllers/DashboardController";
import END_POINTS from "../models/endpoints";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAdminRole } from "../middleware/adminMiddleware";

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

// Admin-only routes — require authenticated admin/super_admin
dashboardRoutes.get(
  END_POINTS.DASHBOARD.ADMIN.USERS.GET_ALL_USERS,
  authMiddleware,
  requireAdminRole,
  DashboardController.getAllUsers,
);

dashboardRoutes.post(
  END_POINTS.DASHBOARD.ADMIN.USERS.CREATE_USER,
  authMiddleware,
  requireAdminRole,
  DashboardController.createUser,
);

dashboardRoutes.post(
  END_POINTS.DASHBOARD.ADMIN.USERS.BLOCK_USER(":userId"),
  authMiddleware,
  requireAdminRole,
  DashboardController.blockUser,
);

dashboardRoutes.post(
  END_POINTS.DASHBOARD.ADMIN.USERS.UNBLOCK_USER(":userId"),
  authMiddleware,
  requireAdminRole,
  DashboardController.unblockUser,
);

dashboardRoutes.delete(
  END_POINTS.DASHBOARD.USERS.DELETE_USER(":userId"),
  DashboardController.deleteUser,
);

// Agent Routes
dashboardRoutes.post(
  END_POINTS.DASHBOARD.AGENTS.CREATE_AGENT,
  DashboardController.createAgent,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.AGENTS.GET_USER_AGENTS,
  DashboardController.getUserAgents,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.AGENTS.GET_AGENT_BY_ID,
  DashboardController.getAgentById,
);

dashboardRoutes.put(
  END_POINTS.DASHBOARD.AGENTS.UPDATE_AGENT(":agentId"),
  DashboardController.updateAgent,
);

dashboardRoutes.delete(
  END_POINTS.DASHBOARD.AGENTS.DELETE_AGENT(":agentId"),
  DashboardController.deleteAgent,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.AGENTS.GET_REPORTS_BY_AGENT_ID(":agentId"),
  DashboardController.getReportsByAgentId,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.ADMIN.AGENTS.GET_ALL_AGENTS,
  authMiddleware,
  requireAdminRole,
  DashboardController.getAllAgents,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.ADMIN.REPORTS.GET_ALL_REPORTS,
  authMiddleware,
  requireAdminRole,
  DashboardController.getAllReports,
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

dashboardRoutes.post(
  END_POINTS.DASHBOARD.REPORTS.TEST_AGENT_CONNECTION(":reportId"),
  DashboardController.testReportAgentConnection,
);

dashboardRoutes.post(
  END_POINTS.DASHBOARD.REPORTS.STOP_REPORT(":reportId"),
  DashboardController.stopReport,
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

export default dashboardRoutes;
