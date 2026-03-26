import {
  DashboardReportState,
  getDashboardReportInitialState,
} from "./state";

import { Agent } from "src/shared/types/agent";
import { Report } from "src/shared/types/report";
import { ReportRun } from "src/shared/types/reportRun";
import { useState } from "react";

export interface DashboardReportStore {
  state: DashboardReportState;
  setIsFetching: (isFetching: boolean) => void;
  setReport: (report: Report | undefined) => void;
  setRuns: (runs: ReportRun[]) => void;
  setAgents: (agents: Agent[]) => void;
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

  const setAgents = (agents: Agent[]) => {
    setState((prev) => ({
      ...prev,
      agents,
    }));
  };

  return {
    state,
    setIsFetching,
    setReport,
    setRuns,
    setAgents,
  };
};

export default useDashboardReportStore;
