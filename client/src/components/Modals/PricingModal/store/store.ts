import { PricingModalInitialState, getPricingModalInitialState } from "./state";

import { useState } from "react";

export interface PricingModalStore {
  state: PricingModalInitialState;
  handleTogglePricingModal: () => void;
}

const usePricingModalStore = (): PricingModalStore => {
  const initialState = getPricingModalInitialState();
  const [state, setState] = useState<PricingModalInitialState>(initialState);

  const handleTogglePricingModal = () => {
    setState((prevState) => ({
      ...prevState,
      isVisible: !prevState.isVisible,
    }));
  };

  return {
    state,
    handleTogglePricingModal,
  };
};

export default usePricingModalStore;
