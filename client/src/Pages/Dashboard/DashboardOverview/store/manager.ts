import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { DashboardOverviewStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";

export interface DashboardOverviewManager {
  setUp: () => Promise<void>;
  handleFetchProjectsCount: () => Promise<void>;
}

export const useDashboardOverviewManager = (
  store: DashboardOverviewStore,
): DashboardOverviewManager => {
  const setUp = async () => {
    store.setIsFetching(true);

    try {
      await Promise.all([handleFetchProjectsCount()]);
    } catch (error) {
      console.error("Failed to fetch dashboard overview data:", error);
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleFetchProjectsCount = async (): Promise<void> => {
    try {
      const response: AxiosResponse<{ count: number }> = await axios.get(
        END_POINTS.DASHBOARD.OVERVIEW.GET_PROJECTS_COUNT,
      );
      store.setProjectsCount(response.data.count);
    } catch (error) {
      console.error("❌ Failed to fetch projects count:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response.data.message || "Failed to fetch projects count",
          type: ToastTypes.Error,
        });
      }
    }
  };

  return {
    setUp,
    handleFetchProjectsCount,
  };
};
