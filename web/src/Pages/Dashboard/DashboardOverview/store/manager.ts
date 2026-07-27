import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { ApiResponseWithPaging } from "src/shared/types/types";
import { Agent } from "src/shared/types/agent";
import { DashboardOverviewStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { Report } from "src/shared/types/report";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import { useApplicationContext } from "src/application/store/Provider";

export interface DashboardOverviewManager {
  setUp: () => Promise<void>;
  handleFetchUserReportsCount: () => Promise<void>;
  handleFetchUserAgentsCount: () => Promise<void>;
  handleFetchAllReportsCount: () => Promise<void>;
  handleFetchAllAgentsCount: () => Promise<void>;
  handleFetchAllDemosCount: () => Promise<void>;
}

export const useDashboardOverviewManager = (
  store: DashboardOverviewStore,
): DashboardOverviewManager => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const setUp = async () => {
    store.setIsFetching(true);

    try {
      const handlers: Array<Promise<void>> = [
        handleFetchUserReportsCount(),
        handleFetchUserAgentsCount(),
      ];

      if (hasAdminRights(auth.user)) {
        handlers.push(
          handleFetchAllReportsCount(),
          handleFetchAllAgentsCount(),
          handleFetchAllDemosCount(),
        );
      }

      await Promise.all(handlers);
    } catch (error) {
      console.error("Failed to fetch dashboard overview data:", error);
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleFetchUserReportsCount = async (): Promise<void> => {
    const userId = auth.user?._id;
    if (!userId) return;

    try {
      const response: AxiosResponse<{ count: number }> = await axios.get(
        END_POINTS.DASHBOARD.USERS.GET_USER_REPORTS_COUNT(userId),
      );
      store.setUserReportsCount(response.data.count);
    } catch (error) {
      console.error("❌ Failed to fetch user reports count:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response.data.message || "Failed to fetch user reports count",
          type: ToastTypes.Error,
        });
      }
    }
  };

  const handleFetchUserAgentsCount = async (): Promise<void> => {
    const userId = auth.user?._id;
    if (!userId) return;

    try {
      const response: AxiosResponse<ApiResponseWithPaging<Agent[]>> =
        await axios.get(END_POINTS.DASHBOARD.AGENTS.GET_USER_AGENTS, {
          params: {
            userId,
            page: 1,
            limit: 1,
          },
        });

      store.setUserAgentsCount(response.data.paging?.totalCount ?? 0);
    } catch (error) {
      console.error("❌ Failed to fetch user agents count:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response.data.message || "Failed to fetch user agents count",
          type: ToastTypes.Error,
        });
      }
    }
  };

  const handleFetchAllReportsCount = async (): Promise<void> => {
    try {
      const response: AxiosResponse<ApiResponseWithPaging<Report[]>> =
        await axios.get(END_POINTS.DASHBOARD.ADMIN.REPORTS.GET_ALL_REPORTS, {
          params: {
            pageNumber: 1,
            pageSize: 1,
          },
        });

      store.setAllReportsCount(response.data.paging?.totalCount ?? 0);
    } catch (error) {
      console.error("❌ Failed to fetch all reports count:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response.data.message || "Failed to fetch all reports count",
          type: ToastTypes.Error,
        });
      }
    }
  };

  const handleFetchAllAgentsCount = async (): Promise<void> => {
    try {
      const response: AxiosResponse<ApiResponseWithPaging<Agent[]>> =
        await axios.get(END_POINTS.DASHBOARD.ADMIN.AGENTS.GET_ALL_AGENTS, {
          params: {
            pageNumber: 1,
            pageSize: 1,
          },
        });

      store.setAllAgentsCount(response.data.paging?.totalCount ?? 0);
    } catch (error) {
      console.error("❌ Failed to fetch all agents count:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response.data.message || "Failed to fetch all agents count",
          type: ToastTypes.Error,
        });
      }
    }
  };

  const handleFetchAllDemosCount = async (): Promise<void> => {
    try {
      const response: AxiosResponse<{ count: { total: number } }> =
        await axios.get(END_POINTS.DASHBOARD.OVERVIEW.GET_DEMOS_COUNT);

      store.setAllDemosCount(response.data.count?.total ?? 0);
    } catch (error) {
      console.error("❌ Failed to fetch all demos count:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response.data.message || "Failed to fetch all demos count",
          type: ToastTypes.Error,
        });
      }
    }
  };

  return {
    setUp,
    handleFetchUserReportsCount,
    handleFetchUserAgentsCount,
    handleFetchAllReportsCount,
    handleFetchAllAgentsCount,
    handleFetchAllDemosCount,
  };
};
