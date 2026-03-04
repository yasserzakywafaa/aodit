import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { ApiResponse } from "src/shared/types/types";
import { DashboardProjectStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { Project } from "src/shared/types/project";

export interface DashboardProjectManager {
  setUp: (projectId: string) => Promise<void>;
  handleGetProjectsById: (projectId: string) => Promise<void>;
  handleDeleteProject: (projectId: string) => Promise<void>;
}

export const useDashboardProjectManager = (
  store: DashboardProjectStore,
): DashboardProjectManager => {
  const setUp = async (projectId: string): Promise<void> => {
    store.setIsFetching(false);

    try {
      await handleGetProjectsById(projectId);
    } catch (error) {
      console.error("❌ Failed to get project by id:", error);
    }
  };

  const handleGetProjectsById = async (projectId: string): Promise<void> => {
    store.setIsFetching(true);

    try {
      const response: AxiosResponse<ApiResponse<Project>> = await axios.get(
        END_POINTS.DASHBOARD.PROJECTS.GET_PROJECT_BY_ID,
        { params: { projectId } },
      );

      store.setProject(response.data.results);
    } catch (error) {
      console.error("❌ Failed to get project by id:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to fetch project",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleDeleteProject = async (projectId: string): Promise<void> => {
    try {
      await axios.delete(
        END_POINTS.DASHBOARD.PROJECTS.DELETE_PROJECT(projectId),
      );

      Notify({
        content: "Project deleted successfully",
        type: ToastTypes.Success,
      });
    } catch (error) {
      console.error("❌ Failed to delete project:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to delete project",
          type: ToastTypes.Error,
        });
      }
    }
  };

  return {
    setUp,
    handleGetProjectsById,
    handleDeleteProject,
  };
};
