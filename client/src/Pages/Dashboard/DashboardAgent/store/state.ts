import { Agent } from "src/shared/types/agent";
import { Report } from "src/shared/types/report";

export interface DashboardAgentState {
  isFetching: boolean;
  agent: Agent | undefined;
  agentReports: Report[];
  evaluatorModels: string[];
  evaluatorModelsStatus: "idle" | "loading" | "loaded" | "error";
  evaluatorModelsError?: string;
}

export const getDashboardAgentInitialState = (): DashboardAgentState => {
  return {
    isFetching: false,
    agent: undefined,
    agentReports: [],
    evaluatorModels: [],
    evaluatorModelsStatus: "idle",
    evaluatorModelsError: undefined,
  };
};
