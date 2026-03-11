import { Report } from "src/shared/types/report";

const DEFAULT_WEIGHTS = {
  Reliability: 0.2,
  Integrity: 0.2,
  Judgment: 0.2,
  Resistance: 0.2,
  Resilience: 0.2,
};

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
        scenariosPerDimension: 20,
        dimensionWeights: { ...DEFAULT_WEIGHTS },
      } as Report,
    };
  };
