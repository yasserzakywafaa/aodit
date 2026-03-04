import { User } from "src/shared/types/user";
import { PagingInfo } from "src/shared/types/types";

export interface DashboardUsersState {
  isFetching: boolean;
  users: User[];
  paging: PagingInfo;
}

export const getDashboardUsersInitialState = (): DashboardUsersState => {
  return {
    isFetching: false,
    users: [],
    paging: {
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
    },
  };
};

