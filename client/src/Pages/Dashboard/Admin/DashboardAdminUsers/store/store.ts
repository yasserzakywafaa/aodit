import { DashboardUsersState, getDashboardUsersInitialState } from "./state";

import { PagingInfo } from "src/shared/types/types";
import { User } from "src/shared/types/user";
import { useState } from "react";

export interface DashboardUsersStore {
  state: DashboardUsersState;
  setIsFetching: (isFetching: boolean) => void;
  setUsers: (users: User[]) => void;
  setPaging: (paging: PagingInfo) => void;
}

const useDashboardUsersStore = (): DashboardUsersStore => {
  const initialState = getDashboardUsersInitialState();
  const [state, setState] = useState<DashboardUsersState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setUsers = (users: User[]) => {
    setState((prev) => ({
      ...prev,
      users,
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
    setUsers,
    setPaging,
  };
};

export default useDashboardUsersStore;

