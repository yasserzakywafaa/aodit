import { Report } from "src/shared/types/report";

export interface DashboardCreateReportState {
  isFetching: boolean;
  report: Partial<Report>;
}

export const getDashboardCreateReportInitialState =
  (): DashboardCreateReportState => {
    return {
      isFetching: false,
      report: {
        name: "",
        description: "",
      },
    };
  };
