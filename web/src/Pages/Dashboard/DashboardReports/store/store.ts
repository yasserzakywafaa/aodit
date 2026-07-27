import {
  DashboardReportsState,
  getDashboardReportsInitialState,
} from "./state";

import { PagingInfo } from "src/shared/types/types";
import { Report } from "src/shared/types/report";
import { useState } from "react";

export interface DashboardReportsStore {
  state: DashboardReportsState;
  setIsFetching: (isFetching: boolean) => void;
  setReports: (reports: Report[]) => void;
  setPaging: (paging: PagingInfo) => void;
}

const useDashboardReportsStore = (): DashboardReportsStore => {
  const initialState = getDashboardReportsInitialState();
  const [state, setState] = useState<DashboardReportsState>(initialState);

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

export default useDashboardReportsStore;
