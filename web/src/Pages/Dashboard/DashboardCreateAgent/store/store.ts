import {
  DashboardCreateAgentState,
  getDashboardCreateAgentInitialState,
} from "./state";

import { Agent } from "src/shared/types/agent";
import { useState } from "react";

export interface DashboardCreateAgentStore {
  state: DashboardCreateAgentState;
  setIsFetching: (isFetching: boolean) => void;
  setAgent: (agent: Partial<Agent>) => void;
}

const useDashboardCreateAgentStore = (): DashboardCreateAgentStore => {
  const initialState = getDashboardCreateAgentInitialState();
  const [state, setState] = useState<DashboardCreateAgentState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setAgent = (agent: Partial<Agent>) => {
    setState((prev) => ({
      ...prev,
      agent,
    }));
  };

  return {
    state,
    setIsFetching,
    setAgent,
  };
};

export default useDashboardCreateAgentStore;
