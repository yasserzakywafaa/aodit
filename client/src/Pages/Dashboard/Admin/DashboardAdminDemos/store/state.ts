import { DemoSession } from "src/shared/types/demoSession";
import { PagingInfo } from "src/shared/types/types";

export interface DashboardDemosState {
  isFetching: boolean;
  demos: DemoSession[];
  paging: PagingInfo;
}

export const getDashboardDemosInitialState = (): DashboardDemosState => {
  return {
    isFetching: false,
    demos: [],
    paging: {
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
    },
  };
};
