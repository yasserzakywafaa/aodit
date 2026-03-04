import { PagingInfo } from "src/shared/types/types";
import { Project } from "src/shared/types/project";

export interface DashboardProjectsState {
  isFetching: boolean;
  projects: Project[];
  paging: PagingInfo;
}

export const getDashboardProjectsInitialState = (): DashboardProjectsState => {
  return {
    isFetching: false,
    projects: [],
    paging: {
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
    },
  };
};
