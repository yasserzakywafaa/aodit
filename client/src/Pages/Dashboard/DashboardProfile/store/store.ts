import {
  DashboardProfileState,
  getDashboardProfileInitialState,
} from "./state";

import { UserSubscription } from "src/shared/types/user";
import { useState } from "react";

export interface DashboardProfileStore {
  state: DashboardProfileState;
  setIsFetching: (isFetching: boolean) => void;
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

  const setSubscriptionDetails = (subscription: UserSubscription) => {
    setState((prev) => ({
      ...prev,
      subscription,
    }));
  };

  return {
    state,
    setIsFetching,
    setSubscriptionDetails,
  };
};

export default useDashboardProfileStore;
