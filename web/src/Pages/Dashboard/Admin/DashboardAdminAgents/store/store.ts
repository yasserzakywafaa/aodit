import {
  DashboardAdminAgentsState,
  getDashboardAdminAgentsInitialState,
} from "./state";

import { Agent } from "src/shared/types/agent";
import { PagingInfo } from "src/shared/types/types";
import { useState } from "react";

export interface DashboardAdminAgentsStore {
  state: DashboardAdminAgentsState;
  setIsFetching: (isFetching: boolean) => void;
  setAgents: (agents: Agent[]) => void;
  setPaging: (paging: PagingInfo) => void;
}

const useDashboardAdminAgentsStore = (): DashboardAdminAgentsStore => {
  const initialState = getDashboardAdminAgentsInitialState();
  const [state, setState] = useState<DashboardAdminAgentsState>(initialState);

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

export default useDashboardAdminAgentsStore;
