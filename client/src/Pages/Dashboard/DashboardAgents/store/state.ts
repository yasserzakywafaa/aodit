import { Agent } from "src/shared/types/agent";
import { PagingInfo } from "src/shared/types/types";

export interface DashboardAgentsState {
  isFetching: boolean;
  agents: Agent[];
  paging: PagingInfo;
}

export const getDashboardAgentsInitialState = (): DashboardAgentsState => {
  return {
    isFetching: false,
    agents: [],
    paging: {
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
    },
  };
};
