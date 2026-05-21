export interface DashboardOverviewState {
  isFetching: boolean;
  userReportsCount: number | null;
  userAgentsCount: number | null;
  allReportsCount: number | null;
  allAgentsCount: number | null;
  allDemosCount: number | null;
}

export const getDashboardOverviewInitialState = (): DashboardOverviewState => {
  return {
    isFetching: false,
    userReportsCount: null,
    userAgentsCount: null,
    allReportsCount: null,
    allAgentsCount: null,
    allDemosCount: null,
  };
};
