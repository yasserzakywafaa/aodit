import {
  DashboardOverviewState,
  getDashboardOverviewInitialState,
} from "./state";

import { useState } from "react";

export interface DashboardOverviewStore {
  state: DashboardOverviewState;
  setIsFetching: (isFetching: boolean) => void;
  setUserReportsCount: (userReportsCount: number) => void;
  setUserAgentsCount: (userAgentsCount: number) => void;
  setAllReportsCount: (allReportsCount: number) => void;
  setAllAgentsCount: (allAgentsCount: number) => void;
  setAllDemosCount: (allDemosCount: number) => void;
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

  const setUserReportsCount = (userReportsCount: number) => {
    setState((prev) => ({
      ...prev,
      userReportsCount,
    }));
  };

  const setUserAgentsCount = (userAgentsCount: number) => {
    setState((prev) => ({
      ...prev,
      userAgentsCount,
    }));
  };

  const setAllReportsCount = (allReportsCount: number) => {
    setState((prev) => ({
      ...prev,
      allReportsCount,
    }));
  };

  const setAllAgentsCount = (allAgentsCount: number) => {
    setState((prev) => ({
      ...prev,
      allAgentsCount,
    }));
  };

  const setAllDemosCount = (allDemosCount: number) => {
    setState((prev) => ({
      ...prev,
      allDemosCount,
    }));
  };

  return {
    state,
    setIsFetching,
    setUserReportsCount,
    setUserAgentsCount,
    setAllReportsCount,
    setAllAgentsCount,
    setAllDemosCount,
  };
};

export default useDashboardOverviewStore;
