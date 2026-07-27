import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { DashboardDemoStore } from "./store";
import { DemoSession } from "src/shared/types/demoSession";
import END_POINTS from "src/application/shared/endpoints";

export interface DashboardDemoManager {
  setUp: (demoId: string) => Promise<void>;
  handleGetDemo: (demoId: string) => Promise<void>;
}

export const useDashboardDemoManager = (
  store: DashboardDemoStore,
): DashboardDemoManager => {
  const setUp = async (demoId: string) => {
    try {
      await handleGetDemo(demoId);
    } catch (error) {
      console.error("Failed to get demo:", error);
    }
  };

  const handleGetDemo = async (demoId: string): Promise<void> => {
    store.setIsFetching(true);

    try {
      const response: AxiosResponse<DemoSession> = await axios.get(
        END_POINTS.DASHBOARD.ADMIN.DEMOS.GET_DEMO_BY_ID(demoId),
      );

      store.setDemo(response.data);
    } catch (error) {
      console.error("❌ Failed to get demo:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to fetch demo",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsFetching(false);
    }
  };

  return {
    setUp,
    handleGetDemo,
  };
};
