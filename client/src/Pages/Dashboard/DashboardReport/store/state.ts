import { Agent } from "src/shared/types/agent";
import { Report } from "src/shared/types/report";
import { ReportRun } from "src/shared/types/reportRun";

export interface DashboardReportState {
  isFetching: boolean;
  report: Report | undefined;
  runs: ReportRun[];
  agents: Agent[];
  agentConnectionStatus: "idle" | "testing" | "success" | "failed";
  agentConnectionMessage: string;
  agentConnectionCheckedAgentId?: string;
}

export const getDashboardReportInitialState = (): DashboardReportState => {
  return {
    isFetching: false,
    report: undefined,
    runs: [],
    agents: [],
    agentConnectionStatus: "idle",
    agentConnectionMessage: "",
    agentConnectionCheckedAgentId: undefined,
  };
};
