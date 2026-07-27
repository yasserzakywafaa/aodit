import {
  DashboardAdminReportsState,
  getDashboardAdminReportsInitialState,
} from "./state";

import { PagingInfo } from "src/shared/types/types";
import { Report } from "src/shared/types/report";
import { useState } from "react";

export interface DashboardAdminReportsStore {
  state: DashboardAdminReportsState;
  setIsFetching: (isFetching: boolean) => void;
  setReports: (reports: Report[]) => void;
  setPaging: (paging: PagingInfo) => void;
}

const useDashboardAdminReportsStore = (): DashboardAdminReportsStore => {
  const initialState = getDashboardAdminReportsInitialState();
  const [state, setState] = useState<DashboardAdminReportsState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setReports = (reports: Report[]) => {
    setState((prev) => ({
      ...prev,
      reports,
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
    setReports,
    setPaging,
  };
};

export default useDashboardAdminReportsStore;
