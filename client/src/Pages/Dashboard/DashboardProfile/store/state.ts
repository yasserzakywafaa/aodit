import { User, UserSubscription } from "src/shared/types/user";

export interface DashboardProfileState {
  isFetching: boolean;
  user: User | undefined;
  subscription: UserSubscription | undefined;
}

export const getDashboardProfileInitialState = (): DashboardProfileState => {
  return {
    isFetching: false,
    user: undefined,
    subscription: undefined,
  };
};
