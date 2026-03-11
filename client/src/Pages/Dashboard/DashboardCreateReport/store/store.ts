import {
  DashboardCreateReportState,
  getDashboardCreateReportInitialState,
} from "./state";

import { Report } from "src/shared/types/report";
import { useState } from "react";

export interface DashboardCreateReportStore {
  state: DashboardCreateReportState;
  setIsFetching: (isFetching: boolean) => void;
  setReport: (report: Report) => void;
}

const useDashboardCreateReportStore = (): DashboardCreateReportStore => {
  const initialState = getDashboardCreateReportInitialState();
  const [state, setState] = useState<DashboardCreateReportState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setReport = (report: Report) => {
    setState((prev) => ({
      ...prev,
      report,
    }));
  };

  return {
    state,
    setIsFetching,
    setReport,
  };
};

export default useDashboardCreateReportStore;
