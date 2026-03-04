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
  END_POINTS.DASHBOARD.USERS.GET_ALL_USERS,
  DashboardController.getAllUsers,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.USERS.GET_USER_BY_ID(":userId"),
  DashboardController.getUserById,
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

// Project Routes
dashboardRoutes.post(
  END_POINTS.DASHBOARD.PROJECTS.CREATE_PROJECT,
  DashboardController.createProject,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.PROJECTS.GET_USER_PROJECTS,
  DashboardController.getUserProjects,
);

dashboardRoutes.get(
  END_POINTS.DASHBOARD.PROJECTS.GET_PROJECT_BY_ID,
  DashboardController.getProjectById,
);

dashboardRoutes.delete(
  END_POINTS.DASHBOARD.PROJECTS.DELETE_PROJECT(":projectId"),
  DashboardController.deleteProject,
);

export default dashboardRoutes;
