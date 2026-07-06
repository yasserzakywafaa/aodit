import {
  DashboardProfileState,
  getDashboardProfileInitialState,
} from "./state";

import { UserSubscription } from "src/shared/types/user";
import { useState } from "react";

export interface DashboardProfileStore {
  state: DashboardProfileState;
  setIsFetching: (isFetching: boolean) => void;
  setIsDeletingAccount: (isDeletingAccount: boolean) => void;
  setSubscriptionDetails: (subscription: UserSubscription) => void;
}

const useDashboardProfileStore = (): DashboardProfileStore => {
  const initialState = getDashboardProfileInitialState();
  const [state, setState] = useState<DashboardProfileState>(initialState);

  const setIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setIsDeletingAccount = (isDeletingAccount: boolean) => {
    setState((prev) => ({
      ...prev,
      isDeletingAccount,
    }));
  };

  const setSubscriptionDetails = (subscription: UserSubscription) => {
    setState((prev) => ({
      ...prev,
      subscription,
    }));
  };

  return {
    state,
    setIsFetching,
    setIsDeletingAccount,
    setSubscriptionDetails,
  };
};

export default useDashboardProfileStore;
