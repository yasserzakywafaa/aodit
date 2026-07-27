import { DashboardDemosState, getDashboardDemosInitialState } from "./state";

import { DemoSession } from "src/shared/types/demoSession";
import { PagingInfo } from "src/shared/types/types";
import { useState } from "react";

export interface DashboardDemosStore {
  state: DashboardDemosState;
  setIsFetching: (isFetching: boolean) => void;
  setDemos: (demos: DemoSession[]) => void;
  setPaging: (paging: PagingInfo) => void;
}

const useDashboardDemosStore = (): DashboardDemosStore => {
  const initialState = getDashboardDemosInitialState();
  const [state, setState] = useState<DashboardDemosState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setDemos = (demos: DemoSession[]) => {
    setState((prev) => ({
      ...prev,
      demos,
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
    setDemos,
    setPaging,
  };
};

export default useDashboardDemosStore;
