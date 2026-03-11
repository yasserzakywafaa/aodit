import { Report } from "src/shared/types/report";
import { ReportRun } from "src/shared/types/reportRun";

export interface DashboardReportState {
  isFetching: boolean;
  report: Report | undefined;
  runs: ReportRun[];
}

export const getDashboardReportInitialState = (): DashboardReportState => {
  return {
    isFetching: false,
    report: undefined,
    runs: [],
  };
};
