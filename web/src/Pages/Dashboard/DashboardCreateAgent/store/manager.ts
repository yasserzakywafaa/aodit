import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios, { AxiosResponse } from "axios";

import { Agent } from "src/shared/types/agent";
import { DashboardCreateAgentStore } from "./store";
import END_POINTS from "src/application/shared/endpoints";
import { useApplicationContext } from "src/application/store/Provider";

export interface DashboardCreateAgentManager {
  handleCreateAgent: (agent: Partial<Agent>) => Promise<Agent | undefined>;
}

export const useDashboardCreateAgentManager = (
  store: DashboardCreateAgentStore,
): DashboardCreateAgentManager => {
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const handleCreateAgent = async (
    agent: Partial<Agent>,
  ): Promise<Agent | undefined> => {
    if (!auth || !auth.user) {
      throw new Error("User ID is required");
    }

    store.setIsFetching(true);
    const payload = {
      name: agent.name,
      description: agent.description,
      intent: agent.intent,
      ownerName: agent.ownerName,
      agentUrl: agent.agentUrl || undefined,
      userId: auth.user._id,
    };

    try {
      const response: AxiosResponse<Agent> = await axios.post(
        END_POINTS.DASHBOARD.AGENTS.CREATE_AGENT,
        payload,
      );

      store.setAgent(response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Failed to create agent:", error);
      if (axios.isAxiosError(error) && error.response) {
        Notify({
          content: error.response.data.message || "Failed to create agent",
          type: ToastTypes.Error,
        });
      }
      return undefined;
    } finally {
      store.setIsFetching(false);
    }
  };

  return {
    handleCreateAgent,
  };
};
