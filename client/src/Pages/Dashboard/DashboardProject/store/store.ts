import {
  DashboardProjectState,
  getDashboardProjectInitialState,
} from "./state";

import { Project } from "src/shared/types/project";
import { useState } from "react";

export interface DashboardProjectStore {
  state: DashboardProjectState;
  setIsFetching: (isFetching: boolean) => void;
  setProject: (project: Project | undefined) => void;
}

const useDashboardProjectStore = (): DashboardProjectStore => {
  const initialState = getDashboardProjectInitialState();
  const [state, setState] = useState<DashboardProjectState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setProject = (project: Project) => {
    setState((prev) => ({
      ...prev,
      project,
    }));
  };

  return {
    state,
    setIsFetching,
    setProject,
  };
};

export default useDashboardProjectStore;
