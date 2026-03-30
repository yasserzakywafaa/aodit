import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { ApiResponseWithPaging } from "src/shared/types/types";
import { DashboardAdminReportsStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { Report } from "src/shared/types/report";

export interface DashboardAdminReportsManager {
  setUp: () => Promise<void>;
  handleGetReportsByPage: (
    pageNumber?: number,
    pageSize?: number,
  ) => Promise<void>;
  handleDeleteReport: (reportId: string) => Promise<void>;
}

export const useDashboardAdminReportsManager = (
  store: DashboardAdminReportsStore,
): DashboardAdminReportsManager => {
  const setUp = async () => {
    store.setIsFetching(false);

    try {
      await handleGetReportsByPage();
    } catch (error) {
      console.error("Failed to get all reports:", error);
    }
  };

  const handleGetReportsByPage = async (
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<void> => {
    store.setIsFetching(true);

    try {
      const response: AxiosResponse<ApiResponseWithPaging<Report[]>> =
        await axios.get(END_POINTS.DASHBOARD.ADMIN.REPORTS.GET_ALL_REPORTS, {
          params: {
            pageNumber,
            pageSize,
          },
        });

      store.setReports(response.data.results as Report[]);
      store.setPaging({
        pageNumber: response.data.paging.pageNumber,
        pageSize,
        totalCount: response.data.paging.totalCount,
        totalPagesCount: response.data.paging.totalPagesCount,
      });
    } catch (error) {
      console.error("Failed to get all reports:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to fetch reports",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleDeleteReport = async (reportId: string): Promise<void> => {
    try {
      await axios.delete(END_POINTS.DASHBOARD.REPORTS.DELETE_REPORT(reportId));

      Notify({
        content: "Report deleted successfully",
        type: ToastTypes.Success,
      });

      await handleGetReportsByPage();
    } catch (error) {
      console.error("Failed to delete report:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to delete report",
          type: ToastTypes.Error,
        });
      }
    }
  };

  return {
    setUp,
    handleGetReportsByPage,
    handleDeleteReport,
  };
};
