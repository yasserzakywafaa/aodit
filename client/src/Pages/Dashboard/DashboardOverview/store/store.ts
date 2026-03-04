import {
  DashboardOverviewState,
  getDashboardOverviewInitialState,
} from "./state";

import { useState } from "react";

export interface DashboardOverviewStore {
  state: DashboardOverviewState;
  setIsFetching: (isFetching: boolean) => void;
  setProjectsCount: (projectsCount: number) => void;
}

const useDashboardOverviewStore = (): DashboardOverviewStore => {
  const initialState = getDashboardOverviewInitialState();
  const [state, setState] = useState<DashboardOverviewState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setProjectsCount = (projectsCount: number) => {
    setState((prev) => ({
      ...prev,
      projectsCount,
    }));
  };

  return {
    state,
    setIsFetching,
    setProjectsCount,
  };
};

export default useDashboardOverviewStore;
