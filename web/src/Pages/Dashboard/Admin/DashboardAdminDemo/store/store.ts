import { DashboardDemoState, getDashboardDemoInitialState } from "./state";

import { DemoSession } from "src/shared/types/demoSession";
import { useState } from "react";

export interface DashboardDemoStore {
  state: DashboardDemoState;
  setIsFetching: (isFetching: boolean) => void;
  setDemo: (demo: DemoSession | null) => void;
}

const useDashboardDemoStore = (): DashboardDemoStore => {
  const initialState = getDashboardDemoInitialState();
  const [state, setState] = useState<DashboardDemoState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setDemo = (demo: DemoSession | null) => {
    setState((prev) => ({
      ...prev,
      demo,
    }));
  };

  return {
    state,
    setIsFetching,
    setDemo,
  };
};

export default useDashboardDemoStore;
