import {
  DashboardReportState,
  getDashboardReportInitialState,
} from "./state";

import { Report } from "src/shared/types/report";
import { ReportRun } from "src/shared/types/reportRun";
import { useState } from "react";

export interface DashboardReportStore {
  state: DashboardReportState;
  setIsFetching: (isFetching: boolean) => void;
  setReport: (report: Report | undefined) => void;
  setRuns: (runs: ReportRun[]) => void;
}

const useDashboardReportStore = (): DashboardReportStore => {
  const initialState = getDashboardReportInitialState();
  const [state, setState] = useState<DashboardReportState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setReport = (report: Report | undefined) => {
    setState((prev) => ({
      ...prev,
      report,
    }));
  };

  const setRuns = (runs: ReportRun[]) => {
    setState((prev) => ({
      ...prev,
      runs,
    }));
  };

  return {
    state,
    setIsFetching,
    setReport,
    setRuns,
  };
};

export default useDashboardReportStore;
