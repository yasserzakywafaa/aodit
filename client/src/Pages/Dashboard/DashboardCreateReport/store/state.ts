import { Report } from "src/shared/types/report";

export interface DashboardCreateReportState {
  isFetching: boolean;
  report: Report;
}

export const getDashboardCreateReportInitialState =
  (): DashboardCreateReportState => {
    return {
      isFetching: false,
      report: {
        _id: "",
        name: "",
        description: "",
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Report,
    };
  };
