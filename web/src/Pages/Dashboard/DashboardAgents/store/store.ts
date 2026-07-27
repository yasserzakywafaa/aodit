import {
  DashboardAgentsState,
  getDashboardAgentsInitialState,
} from "./state";

import { Agent } from "src/shared/types/agent";
import { PagingInfo } from "src/shared/types/types";
import { useState } from "react";

export interface DashboardAgentsStore {
  state: DashboardAgentsState;
  setIsFetching: (isFetching: boolean) => void;
  setAgents: (agents: Agent[]) => void;
  setPaging: (paging: PagingInfo) => void;
}

const useDashboardAgentsStore = (): DashboardAgentsStore => {
  const initialState = getDashboardAgentsInitialState();
  const [state, setState] = useState<DashboardAgentsState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setAgents = (agents: Agent[]) => {
    setState((prev) => ({
      ...prev,
      agents,
    }));
  };

  const setPaging = (paging: PagingInfo) => {
    setState((prev) => ({
      ...prev,
      paging,
    }));
  };

  return {
    state,
    setIsFetching,
    setAgents,
    setPaging,
  };
};

export default useDashboardAgentsStore;
