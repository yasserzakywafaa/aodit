export interface DashboardOverviewState {
  isFetching: boolean;
  reportsCount: number | null;
}

export const getDashboardOverviewInitialState = (): DashboardOverviewState => {
  return {
    isFetching: false,
    reportsCount: null,
  };
};
