import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { Agent } from "src/shared/types/agent";
import { ApiResponseWithPaging } from "src/shared/types/types";
import { DashboardAgentsStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { useApplicationContext } from "src/application/store/Provider";

export interface DashboardAgentsManager {
  setUp: () => Promise<void>;
  handleGetAgentsByPage: (
    pageNumber?: number,
    pageSize?: number,
  ) => Promise<void>;
  handleDeleteAgent: (agentId: string) => Promise<void>;
}

export const useDashboardAgentsManager = (
  store: DashboardAgentsStore,
): DashboardAgentsManager => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const setUp = async () => {
    store.setIsFetching(false);

    try {
      await handleGetAgentsByPage();
    } catch (error) {
      console.error("Failed to get all agents:", error);
    }
  };

  const handleGetAgentsByPage = async (
    pageNumber: number = 1,
    pageSize: number = 10,
  ): Promise<void> => {
    store.setIsFetching(true);

    try {
      const response: AxiosResponse<ApiResponseWithPaging<Agent[]>> =
        await axios.get(END_POINTS.DASHBOARD.AGENTS.GET_USER_AGENTS, {
          params: {
            userId: auth.user?._id || "",
            page: pageNumber,
            limit: pageSize,
          },
        });

      store.setAgents((response.data as any).results as Agent[]);
      store.setPaging({
        pageNumber: (response.data as any).paging?.pageNumber ?? pageNumber,
        pageSize: (response.data as any).paging?.pageSize ?? pageSize,
        totalCount: (response.data as any).paging?.totalCount ?? 0,
        totalPagesCount: (response.data as any).paging?.totalPagesCount ?? 0,
      });
    } catch (error) {
      console.error("❌ Failed to get all agents:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to fetch agents",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleDeleteAgent = async (agentId: string): Promise<void> => {
    try {
      await axios.delete(END_POINTS.DASHBOARD.AGENTS.DELETE_AGENT(agentId));

      Notify({
        content: "Agent deleted successfully",
        type: ToastTypes.Success,
      });

      await handleGetAgentsByPage();
    } catch (error) {
      console.error("❌ Failed to delete agent:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to delete agent",
          type: ToastTypes.Error,
        });
      }
    }
  };

  return {
    setUp,
    handleGetAgentsByPage,
    handleDeleteAgent,
  };
};
