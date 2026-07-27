import { DemoSession } from "src/shared/types/demoSession";

export interface DashboardDemoState {
  isFetching: boolean;
  demo: DemoSession | null;
}

export const getDashboardDemoInitialState = (): DashboardDemoState => {
  return {
    isFetching: false,
    demo: null,
  };
};
