import { NextFunction, Request, Response } from "express";

import DashboardServices from "../services/dashboardService";
import ProjectServices from "../services/projectService";

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

// Projects
const getProjectsCount = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const projectsCount = await ProjectServices.getProjectsCount();
    response.status(200).json({ count: projectsCount });
  } catch (error) {
    next(error);
  }
};

const createProject = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const project = await ProjectServices.createProject(request.body);
    response.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

const getUserProjects = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { userId, page, limit } = request.query;
    const projects = await ProjectServices.getUserProjects(
      userId as string,
      Number(page) || 1,
      Number(limit) || 10,
    );
    response.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

const getProjectById = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const project = await ProjectServices.getProjectById(
      request.query.projectId as string,
    );
    response.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const project = await ProjectServices.deleteProject(
      request.params.projectId,
    );
    response.status(200).json(project);
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
  // Projects
  getProjectsCount,
  createProject,
  getUserProjects,
  getProjectById,
  deleteProject,
};

export default DashboardController;
