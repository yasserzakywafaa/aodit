import { User, UserSubscription } from "src/shared/types/user";

export interface DashboardProfileState {
  isFetching: boolean;
  isDeletingAccount: boolean;
  user: User | undefined;
  subscription: UserSubscription | undefined;
}

export const getDashboardProfileInitialState = (): DashboardProfileState => {
  return {
    isFetching: false,
    isDeletingAccount: false,
    user: undefined,
    subscription: undefined,
  };
};
