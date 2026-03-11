import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { DashboardCreateReportStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { Report } from "src/shared/types/report";
import { useApplicationContext } from "src/application/store/Provider";

export interface DashboardCreateReportManager {
  handleCreateReport: (report: Report) => Promise<Report | undefined>;
}

export const useDashboardCreateReportManager = (
  store: DashboardCreateReportStore,
): DashboardCreateReportManager => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const handleCreateReport = async (report: Report): Promise<Report | undefined> => {
    if (!auth || !auth.user) {
      throw new Error("User ID is required");
    }

    store.setIsFetching(true);
    const payload = {
      ...report,
      userId: auth.user._id,
    };

    try {
      const response: AxiosResponse<Report> = await axios.post(
        END_POINTS.DASHBOARD.REPORTS.CREATE_REPORT,
        payload,
      );

      store.setReport(response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to create report:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to create report",
          type: ToastTypes.Error,
        });
      }
      return undefined;
    } finally {
      store.setIsFetching(false);
    }
  };

  return {
    handleCreateReport,
  };
};
