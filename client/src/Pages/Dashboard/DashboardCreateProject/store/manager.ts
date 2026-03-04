import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { ApiResponseWithPaging } from "src/shared/types/types";
import { DashboardCreateProjectStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { Project } from "src/shared/types/project";
import { useApplicationContext } from "src/application/store/Provider";

export interface DashboardCreateProjectManager {
  handleCreateProject: (project: Project) => Promise<void>;
}

export const useDashboardCreateProjectManager = (
  store: DashboardCreateProjectStore,
): DashboardCreateProjectManager => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const handleCreateProject = async (project: Project): Promise<void> => {
    if (!auth || !auth.user) {
      throw new Error("User ID is required");
    }

    store.setIsFetching(true);
    const payload = {
      ...project,
      userId: auth.user._id,
    };

    try {
      const response: AxiosResponse<ApiResponseWithPaging<Project[]>> =
        await axios.post(END_POINTS.DASHBOARD.PROJECTS.CREATE_PROJECT, payload);

      store.setProject(response.data.results[0] as Project);
    } catch (error) {
      console.error("❌ Failed to get all projects:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to create project",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsFetching(false);
    }
  };

  return {
    handleCreateProject,
  };
};
