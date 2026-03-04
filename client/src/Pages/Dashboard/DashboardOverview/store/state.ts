export interface DashboardOverviewState {
  isFetching: boolean;
  projectsCount: number | null;
}

export const getDashboardOverviewInitialState = (): DashboardOverviewState => {
  return {
    isFetching: false,
    projectsCount: null,
  };
};
