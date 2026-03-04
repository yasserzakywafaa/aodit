import {
  PaymentStatusInitialState,
  SessionData,
  getPaymentStatusInitialState,
} from "./state";

import { useState } from "react";

export interface PaymentStatusStore {
  state: PaymentStatusInitialState;
  handleIsFetching: (isFetching: boolean) => void;
  setShowPaymentSuccess: (showPaymentSuccess: boolean) => void;
  updatePaymentData: (paymentData: SessionData) => void;
}

const usePaymentStatusStore = (): PaymentStatusStore => {
  const initialState = getPaymentStatusInitialState();
  const [state, setState] = useState<PaymentStatusInitialState>(initialState);

  const handleIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const updatePaymentData = (sessionData: SessionData) => {
    setState((prev) => ({
      ...prev,
      sessionData,
    }));
  };

  const setShowPaymentSuccess = (showPaymentSuccess: boolean) => {
    setState((prev) => ({
      ...prev,
      showPaymentSuccess,
    }));
  };

  return {
    state,
    handleIsFetching,
    setShowPaymentSuccess,
    updatePaymentData,
  };
};

export default usePaymentStatusStore;
