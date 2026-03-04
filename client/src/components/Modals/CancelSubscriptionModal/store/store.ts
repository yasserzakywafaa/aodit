import {
  CancelSubscriptionModalInitialState,
  getCancelSubscriptionModalInitialState,
} from "./state";

import { useState } from "react";

export interface CancelSubscriptionModalStore {
  state: CancelSubscriptionModalInitialState;
  handleToggleCancelSubscriptionModal: () => void;
}

const useCancelSubscriptionModalStore = (): CancelSubscriptionModalStore => {
  const initialState = getCancelSubscriptionModalInitialState();
  const [state, setState] =
    useState<CancelSubscriptionModalInitialState>(initialState);

  const handleToggleCancelSubscriptionModal = () => {
    setState((prevState) => ({
      ...prevState,
      isVisible: !prevState.isVisible,
    }));
  };

  return {
    state,
    handleToggleCancelSubscriptionModal,
  };
};

export default useCancelSubscriptionModalStore;
