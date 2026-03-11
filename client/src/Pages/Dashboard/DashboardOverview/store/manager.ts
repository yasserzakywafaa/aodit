import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { DashboardOverviewStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";

export interface DashboardOverviewManager {
  setUp: () => Promise<void>;
  handleFetchReportsCount: () => Promise<void>;
}

export const useDashboardOverviewManager = (
  store: DashboardOverviewStore,
): DashboardOverviewManager => {
  const setUp = async () => {
    store.setIsFetching(true);

    try {
      await Promise.all([handleFetchReportsCount()]);
    } catch (error) {
      console.error("Failed to fetch dashboard overview data:", error);
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleFetchReportsCount = async (): Promise<void> => {
    try {
      const response: AxiosResponse<{ count: number }> = await axios.get(
        END_POINTS.DASHBOARD.OVERVIEW.GET_REPORTS_COUNT,
      );
      store.setReportsCount(response.data.count);
    } catch (error) {
      console.error("❌ Failed to fetch reports count:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response.data.message || "Failed to fetch reports count",
          type: ToastTypes.Error,
        });
      }
    }
  };

  return {
    setUp,
    handleFetchReportsCount,
  };
};
