import { Agent } from "src/shared/types/agent";
import { Report } from "src/shared/types/report";

export interface DashboardAgentState {
  isFetching: boolean;
  agent: Agent | undefined;
  agentReports: Report[];
}

export const getDashboardAgentInitialState = (): DashboardAgentState => {
  return {
    isFetching: false,
    agent: undefined,
    agentReports: [],
  };
};
