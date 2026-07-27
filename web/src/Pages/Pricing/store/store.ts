import { PricingInitialState, getPricingInitialState } from "./state";

import { useState } from "react";

export interface PricingStore {
  state: PricingInitialState;
  resetFormState: () => void;
  handleIsFetching: (isFetching: boolean) => void;
  updatePricingForm: (key: string, value: string) => void;
}

const usePricingStore = (): PricingStore => {
  const initialState = getPricingInitialState();
  const [state, setState] = useState<PricingInitialState>(initialState);

  const handleIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const updatePricingForm = (key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      contactForm: {
        ...prev.contactForm,

        [key]: value,
      },
    }));
  };

  const resetFormState = () => {
    setState(initialState);
  };

  return {
    state,
    resetFormState,
    handleIsFetching,
    updatePricingForm,
  };
};

export default usePricingStore;
