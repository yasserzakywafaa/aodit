import { Agent } from "src/shared/types/agent";

export interface DashboardCreateAgentState {
  isFetching: boolean;
  agent: Partial<Agent>;
}

export const getDashboardCreateAgentInitialState =
  (): DashboardCreateAgentState => {
    return {
      isFetching: false,
      agent: {
        name: "",
        description: "",
        intent: "",
        ownerName: "",
      },
    };
  };
