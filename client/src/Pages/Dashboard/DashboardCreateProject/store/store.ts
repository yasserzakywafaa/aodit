import {
  DashboardCreateProjectState,
  getDashboardCreateProjectInitialState,
} from "./state";

import { Project } from "src/shared/types/project";
import { useState } from "react";

export interface DashboardCreateProjectStore {
  state: DashboardCreateProjectState;
  setIsFetching: (isFetching: boolean) => void;
  setProject: (project: Project) => void;
}

const useDashboardCreateProjectStore = (): DashboardCreateProjectStore => {
  const initialState = getDashboardCreateProjectInitialState();
  const [state, setState] = useState<DashboardCreateProjectState>(initialState);

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

export default useDashboardCreateProjectStore;
