import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { Agent } from "src/shared/types/agent";
import { DashboardReportStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { Report } from "src/shared/types/report";
import { ReportRun } from "src/shared/types/reportRun";
import { useApplicationContext } from "src/application/store/Provider";

export interface DashboardReportManager {
  setUp: (reportId: string) => Promise<void>;
  handleGetReportById: (reportId: string) => Promise<void>;
  handleGetReportRuns: (reportId: string) => Promise<void>;
  handleGetUserAgents: () => Promise<void>;
  handleUpdateReport: (reportId: string, data: Partial<Report>) => Promise<void>;
  handleLaunchReport: (reportId: string) => Promise<void>;
}

export const useDashboardReportManager = (
  store: DashboardReportStore,
): DashboardReportManager => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const setUp = async (reportId: string): Promise<void> => {
    store.setIsFetching(false);

    try {
      await Promise.all([
        handleGetReportById(reportId),
        handleGetReportRuns(reportId),
        handleGetUserAgents(),
      ]);
    } catch (error) {
      console.error("❌ Failed to set up report:", error);
    }
  };

  const handleGetReportById = async (reportId: string): Promise<void> => {
    store.setIsFetching(true);

    try {
      const response: AxiosResponse<Report> = await axios.get(
        END_POINTS.DASHBOARD.REPORTS.GET_REPORT_BY_ID,
        { params: { reportId } },
      );

      store.setReport(response.data);
    } catch (error) {
      console.error("❌ Failed to get report by id:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to fetch report",
          type: ToastTypes.Error,
        });
      }
      store.setReport(undefined);
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleGetReportRuns = async (reportId: string): Promise<void> => {
    try {
      const response: AxiosResponse<ReportRun[]> = await axios.get(
        END_POINTS.DASHBOARD.REPORTS.GET_REPORT_RUNS(reportId),
      );
      store.setRuns(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("❌ Failed to get report runs:", error);
      store.setRuns([]);
    }
  };

  const handleGetUserAgents = async (): Promise<void> => {
    try {
      const response = await axios.get(
        END_POINTS.DASHBOARD.AGENTS.GET_USER_AGENTS,
        {
          params: {
            userId: auth.user?._id || "",
            page: 1,
            limit: 100,
          },
        },
      );
      const results = (response.data as any).results ?? response.data;
      store.setAgents(Array.isArray(results) ? (results as Agent[]) : []);
    } catch (error) {
      console.error("❌ Failed to get user agents:", error);
      store.setAgents([]);
    }
  };

  const handleUpdateReport = async (
    reportId: string,
    data: Partial<Report>,
  ): Promise<void> => {
    try {
      store.setIsFetching(true);
      const response = await axios.put<Report>(
        END_POINTS.DASHBOARD.REPORTS.UPDATE_REPORT(reportId),
        {
          name: data.name,
          description: data.description,
          reportType: data.reportType,
          scenariosPerDimension: data.scenariosPerDimension,
          dimensionWeights: data.dimensionWeights,
          modelsToTest: data.modelsToTest,
          modelsToEvaluate: data.modelsToEvaluate,
          agentId: data.agentId,
          evaluationMode: data.evaluationMode,
        },
      );
      store.setReport(response.data);
      Notify({
        content: "Report updated.",
        type: ToastTypes.Success,
      });
    } catch (error) {
      console.error("❌ Failed to update report:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response?.data?.message || "Failed to update report",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleLaunchReport = async (reportId: string): Promise<void> => {
    try {
      store.setIsFetching(true);
      await axios.post(END_POINTS.DASHBOARD.REPORTS.LAUNCH_REPORT(reportId));
      Notify({
        content: "Report run started. Results will appear when the run completes.",
        type: ToastTypes.Success,
      });
      await handleGetReportRuns(reportId);
    } catch (error) {
      console.error("❌ Failed to launch report:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response?.data?.message || "Failed to launch report",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsFetching(false);
    }
  };

  return {
    setUp,
    handleGetReportById,
    handleGetReportRuns,
    handleGetUserAgents,
    handleUpdateReport,
    handleLaunchReport,
  };
};
