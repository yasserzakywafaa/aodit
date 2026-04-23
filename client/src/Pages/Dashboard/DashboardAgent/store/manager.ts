import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import APP_CONSTANTS from "src/application/shared/app_constants";
import { Agent } from "src/shared/types/agent";
import { DashboardAgentStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";

export interface DashboardAgentManager {
  setUp: (agentId: string) => Promise<void>;
  handleGetAgentById: (agentId: string) => Promise<void>;
  handleUpdateAgent: (agentId: string, data: Partial<Agent>) => Promise<void>;
  handleGetAgentReports: (agentId: string) => Promise<void>;
  handleTestEvaluatorConnection: (agentId: string) => Promise<void>;
  handleFetchEvaluatorModels: (agentId: string) => Promise<void>;
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
          agentUrl: data.agentUrl,
          ...(APP_CONSTANTS.IS_ON_PREM && {
            evaluatorUrl: data.evaluatorUrl,
            evaluatorApiKey: data.evaluatorApiKey,
            evaluatorModel: data.evaluatorModel,
          }),
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

  const handleTestEvaluatorConnection = async (
    agentId: string,
  ): Promise<void> => {
    try {
      const response = await axios.post<{
        success: true;
        message: string;
        replyPreview: string;
      }>(END_POINTS.DASHBOARD.AGENTS.TEST_EVALUATOR_CONNECTION(agentId), {
        evaluatorUrl: store.state.agent?.evaluatorUrl,
        evaluatorApiKey: store.state.agent?.evaluatorApiKey,
        evaluatorModel: store.state.agent?.evaluatorModel,
      });
      const preview = response.data.replyPreview;
      Notify({
        content:
          response.data.message +
          (preview ? ` Reply: "${preview.slice(0, 80)}"` : ""),
        type: ToastTypes.Success,
      });
    } catch (error) {
      console.error("❌ Evaluator connection failed:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content:
            error.response?.data?.message ||
            "Evaluator connection test failed",
          type: ToastTypes.Error,
        });
      }
    }
  };

  const handleFetchEvaluatorModels = async (agentId: string): Promise<void> => {
    const evaluatorUrl = store.state.agent?.evaluatorUrl?.trim();
    const evaluatorApiKey = store.state.agent?.evaluatorApiKey?.trim();

    if (!agentId || !evaluatorUrl) {
      store.resetEvaluatorModelsState();
      return;
    }

    store.setEvaluatorModelsStatus("loading");
    store.setEvaluatorModelsError(undefined);

    try {
      const response = await axios.post<{
        success: true;
        models: string[];
      }>(END_POINTS.DASHBOARD.AGENTS.GET_EVALUATOR_MODELS(agentId), {
        evaluatorUrl,
        evaluatorApiKey,
      });

      store.setEvaluatorModels(response.data.models || []);
      store.setEvaluatorModelsStatus("loaded");
      store.setEvaluatorModelsError(undefined);
    } catch (error) {
      console.error("❌ Failed to fetch evaluator models:", error);
      store.setEvaluatorModels([]);
      store.setEvaluatorModelsStatus("error");
      if (axios.isAxiosError(error) && error.response) {
        store.setEvaluatorModelsError(
          error.response?.data?.message || "Could not fetch models.",
        );
        return;
      }
      store.setEvaluatorModelsError("Could not fetch models.");
    }
  };

  return {
    setUp,
    handleGetAgentById,
    handleUpdateAgent,
    handleGetAgentReports,
    handleTestEvaluatorConnection,
    handleFetchEvaluatorModels,
  };
};
