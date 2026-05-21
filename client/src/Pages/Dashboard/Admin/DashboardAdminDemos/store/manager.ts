import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { ApiResponseWithPaging } from "src/shared/types/types";
import { DashboardDemosStore } from "./store";
import { DemoSession } from "src/shared/types/demoSession";
import END_POINTS from "src/application/shared/endpoints";

export interface DashboardDemosManager {
  setUp: () => Promise<void>;
  handleGetDemosByPage: (
    pageNumber?: number,
    pageSize?: number,
  ) => Promise<void>;
  handleDeleteDemo: (demoId: string) => Promise<void>;
}

export const useDashboardDemosManager = (
  store: DashboardDemosStore,
): DashboardDemosManager => {
  const setUp = async () => {
    store.setIsFetching(false);

    try {
      await handleGetDemosByPage();
    } catch (error) {
      console.error("Failed to get all demos:", error);
    }
  };

  const handleGetDemosByPage = async (
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<void> => {
    store.setIsFetching(true);

    try {
      const response: AxiosResponse<ApiResponseWithPaging<DemoSession[]>> =
        await axios.get(END_POINTS.DASHBOARD.ADMIN.DEMOS.GET_ALL_DEMOS, {
          params: {
            pageNumber,
            pageSize,
          },
        });

      store.setDemos(response.data.results as DemoSession[]);
      store.setPaging({
        pageNumber: response.data.paging.pageNumber,
        pageSize,
        totalCount: response.data.paging.totalCount,
        totalPagesCount: response.data.paging.totalPagesCount,
      });
    } catch (error) {
      console.error("❌ Failed to get all demos:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to fetch demos",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleDeleteDemo = async (demoId: string): Promise<void> => {
    try {
      await axios.delete(END_POINTS.DASHBOARD.ADMIN.DEMOS.DELETE_DEMO(demoId));

      Notify({
        content: "Demo deleted successfully",
        type: ToastTypes.Success,
      });

      await handleGetDemosByPage();
    } catch (error) {
      console.error("❌ Failed to delete demo:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to delete demo",
          type: ToastTypes.Error,
        });
      }
    }
  };

  return {
    setUp,
    handleGetDemosByPage,
    handleDeleteDemo,
  };
};
