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
  setAgentConnectionStatus: (
    status: DashboardReportState["agentConnectionStatus"],
  ) => void;
  setAgentConnectionMessage: (message: string) => void;
  setAgentConnectionCheckedAgentId: (agentId: string | undefined) => void;
  resetAgentConnectionState: () => void;
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

  const setAgentConnectionStatus = (
    status: DashboardReportState["agentConnectionStatus"],
  ) => {
    setState((prev) => ({
      ...prev,
      agentConnectionStatus: status,
    }));
  };

  const setAgentConnectionMessage = (message: string) => {
    setState((prev) => ({
      ...prev,
      agentConnectionMessage: message,
    }));
  };

  const setAgentConnectionCheckedAgentId = (agentId: string | undefined) => {
    setState((prev) => ({
      ...prev,
      agentConnectionCheckedAgentId: agentId,
    }));
  };

  const resetAgentConnectionState = () => {
    setState((prev) => ({
      ...prev,
      agentConnectionStatus: "idle",
      agentConnectionMessage: "",
      agentConnectionCheckedAgentId: undefined,
    }));
  };

  return {
    state,
    setIsFetching,
    setReport,
    setRuns,
    setAgents,
    setAgentConnectionStatus,
    setAgentConnectionMessage,
    setAgentConnectionCheckedAgentId,
    resetAgentConnectionState,
  };
};

export default useDashboardReportStore;
