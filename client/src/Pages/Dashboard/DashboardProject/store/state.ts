import { Project } from "src/shared/types/project";

export interface DashboardProjectState {
  isFetching: boolean;
  project: Project | undefined;
}

export const getDashboardProjectInitialState = (): DashboardProjectState => {
  return {
    isFetching: false,
    project: undefined,
  };
};
