import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { Agent } from "src/shared/types/agent";
import { DashboardAgentStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";

export interface DashboardAgentManager {
  setUp: (agentId: string) => Promise<void>;
  handleGetAgentById: (agentId: string) => Promise<void>;
  handleUpdateAgent: (agentId: string, data: Partial<Agent>) => Promise<void>;
  handleGetAgentReports: (agentId: string) => Promise<void>;
}

export const useDashboardAgentManager = (
  store: DashboardAgentStore,
): DashboardAgentManager => {
  const setUp = async (agentId: string): Promise<void> => {
    store.setIsFetching(false);

    try {
      await Promise.all([
        handleGetAgentById(agentId),
        handleGetAgentReports(agentId),
      ]);
    } catch (error) {
      console.error("❌ Failed to set up agent:", error);
    }
  };

  const handleGetAgentById = async (agentId: string): Promise<void> => {
    store.setIsFetching(true);

    try {
      const response: AxiosResponse<Agent> = await axios.get(
        END_POINTS.DASHBOARD.AGENTS.GET_AGENT_BY_ID,
        { params: { agentId } },
      );

      store.setAgent(response.data);
    } catch (error) {
      console.error("❌ Failed to get agent by id:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to fetch agent",
          type: ToastTypes.Error,
        });
      }
      store.setAgent(undefined);
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleUpdateAgent = async (
    agentId: string,
    data: Partial<Agent>,
  ): Promise<void> => {
    try {
      store.setIsFetching(true);
      const response = await axios.put<Agent>(
        END_POINTS.DASHBOARD.AGENTS.UPDATE_AGENT(agentId),
        {
          name: data.name,
          description: data.description,
          intent: data.intent,
          ownerName: data.ownerName,
          status: data.status,
        },
      );
      store.setAgent(response.data);
      Notify({
        content: "Agent updated.",
        type: ToastTypes.Success,
      });
    } catch (error) {
      console.error("❌ Failed to update agent:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response?.data?.message || "Failed to update agent",
          type: ToastTypes.Error,
        });
      }
    } finally {
      store.setIsFetching(false);
    }
  };

  const handleGetAgentReports = async (agentId: string): Promise<void> => {
    try {
      const response = await axios.get(
        END_POINTS.DASHBOARD.AGENTS.GET_REPORTS_BY_AGENT_ID(agentId),
        { params: { page: 1, limit: 50 } },
      );
      const results = (response.data as any).results ?? response.data;
      store.setAgentReports(Array.isArray(results) ? results : []);
    } catch (error) {
      console.error("❌ Failed to get agent reports:", error);
      store.setAgentReports([]);
    }
  };

  return {
    setUp,
    handleGetAgentById,
    handleUpdateAgent,
    handleGetAgentReports,
  };
};
