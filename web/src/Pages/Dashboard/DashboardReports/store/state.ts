import { PagingInfo } from "src/shared/types/types";
import { Report } from "src/shared/types/report";

export interface DashboardReportsState {
  isFetching: boolean;
  reports: Report[];
  paging: PagingInfo;
}

export const getDashboardReportsInitialState = (): DashboardReportsState => {
  return {
    isFetching: false,
    reports: [],
    paging: {
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
    },
  };
};
