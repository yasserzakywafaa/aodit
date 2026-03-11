import {
  DashboardOverviewState,
  getDashboardOverviewInitialState,
} from "./state";

import { useState } from "react";

export interface DashboardOverviewStore {
  state: DashboardOverviewState;
  setIsFetching: (isFetching: boolean) => void;
  setReportsCount: (reportsCount: number) => void;
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

  const setReportsCount = (reportsCount: number) => {
    setState((prev) => ({
      ...prev,
      reportsCount,
    }));
  };

  return {
    state,
    setIsFetching,
    setReportsCount,
  };
};

export default useDashboardOverviewStore;
