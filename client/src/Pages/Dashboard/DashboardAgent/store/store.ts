import {
  DashboardAgentState,
  getDashboardAgentInitialState,
} from "./state";

import { Agent } from "src/shared/types/agent";
import { Report } from "src/shared/types/report";
import { useState } from "react";

export interface DashboardAgentStore {
  state: DashboardAgentState;
  setIsFetching: (isFetching: boolean) => void;
  setAgent: (agent: Agent | undefined) => void;
  setAgentReports: (reports: Report[]) => void;
}

const useDashboardAgentStore = (): DashboardAgentStore => {
  const initialState = getDashboardAgentInitialState();
  const [state, setState] = useState<DashboardAgentState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setAgent = (agent: Agent | undefined) => {
    setState((prev) => ({
      ...prev,
      agent,
    }));
  };

  const setAgentReports = (agentReports: Report[]) => {
    setState((prev) => ({
      ...prev,
      agentReports,
    }));
  };

  return {
    state,
    setIsFetching,
    setAgent,
    setAgentReports,
  };
};

export default useDashboardAgentStore;
