import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { ApiResponseWithPaging } from "src/shared/types/types";
import { DashboardReportsStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { Report } from "src/shared/types/report";
import { useApplicationContext } from "src/application/store/Provider";

export interface DashboardReportsManager {
  setUp: () => Promise<void>;
  handleGetReportsByPage: (
    pageNumber?: number,
    pageSize?: number,
  ) => Promise<void>;
  handleDeleteReport: (reportId: string) => Promise<void>;
}

export const useDashboardReportsManager = (
  store: DashboardReportsStore,
): DashboardReportsManager => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

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
        await axios.get(END_POINTS.DASHBOARD.REPORTS.GET_USER_REPORTS, {
          params: {
            userId: auth.user?._id || "",
            page: pageNumber,
            limit: pageSize,
          },
        });

      store.setReports((response.data as any).results as Report[]);
      store.setPaging({
        pageNumber: (response.data as any).paging?.pageNumber ?? pageNumber,
        pageSize: (response.data as any).paging?.pageSize ?? pageSize,
        totalCount: (response.data as any).paging?.totalCount ?? 0,
        totalPagesCount: (response.data as any).paging?.totalPagesCount ?? 0,
      });
    } catch (error) {
      console.error("❌ Failed to get all reports:", error);
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
      await axios.delete(
        END_POINTS.DASHBOARD.REPORTS.DELETE_REPORT(reportId),
      );

      Notify({
        content: "Report deleted successfully",
        type: ToastTypes.Success,
      });

      await handleGetReportsByPage();
    } catch (error) {
      console.error("❌ Failed to delete report:", error);
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
