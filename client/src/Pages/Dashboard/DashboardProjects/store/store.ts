import {
  DashboardProjectsState,
  getDashboardProjectsInitialState,
} from "./state";

import { PagingInfo } from "src/shared/types/types";
import { Project } from "src/shared/types/project";
import { useState } from "react";

export interface DashboardProjectsStore {
  state: DashboardProjectsState;
  setIsFetching: (isFetching: boolean) => void;
  setProjects: (projects: Project[]) => void;
  setPaging: (paging: PagingInfo) => void;
}

const useDashboardProjectsStore = (): DashboardProjectsStore => {
  const initialState = getDashboardProjectsInitialState();
  const [state, setState] = useState<DashboardProjectsState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setProjects = (projects: Project[]) => {
    setState((prev) => ({
      ...prev,
      projects,
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
    setProjects,
    setPaging,
  };
};

export default useDashboardProjectsStore;
