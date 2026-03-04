import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { ApiResponseWithPaging } from "src/shared/types/types";
import { DashboardProjectsStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { Project } from "src/shared/types/project";
import { useApplicationContext } from "src/application/store/Provider";

export interface DashboardProjectsManager {
  setUp: () => Promise<void>;
  handleGetProjectsByPage: (
    pageNumber?: number,
    pageSize?: number,
  ) => Promise<void>;
  handleDeleteProject: (projectId: string) => Promise<void>;
}

export const useDashboardProjectsManager = (
  store: DashboardProjectsStore,
): DashboardProjectsManager => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const setUp = async () => {
    store.setIsFetching(false);

    try {
      await handleGetProjectsByPage();
    } catch (error) {
      console.error("Failed to get all projects:", error);
    }
  };

  const handleGetProjectsByPage = async (
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<void> => {
    store.setIsFetching(true);

    try {
      const response: AxiosResponse<ApiResponseWithPaging<Project[]>> =
        await axios.get(END_POINTS.DASHBOARD.PROJECTS.GET_USER_PROJECTS, {
          params: {
            pageNumber,
            pageSize,
            userId: auth.user?._id || "",
          },
        });

      store.setProjects(response.data.results as Project[]);
      store.setPaging({
        pageNumber: response.data.paging.pageNumber,
        pageSize,
        totalCount: response.data.paging.totalCount,
        totalPagesCount: response.data.paging.totalPagesCount,
      });
    } catch (error) {
      console.error("❌ Failed to get all projects:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to fetch projects",
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

      // Refresh the projects list
      await handleGetProjectsByPage();
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
    handleGetProjectsByPage,
    handleDeleteProject,
  };
};
