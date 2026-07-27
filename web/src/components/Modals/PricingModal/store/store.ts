import { PricingModalInitialState, getPricingModalInitialState } from "./state";

import { useState } from "react";
import { trackEvent } from "src/shared/utils/ga4";

export interface PricingModalStore {
  state: PricingModalInitialState;
  handleTogglePricingModal: () => void;
}

const usePricingModalStore = (): PricingModalStore => {
  const initialState = getPricingModalInitialState();
  const [state, setState] = useState<PricingModalInitialState>(initialState);

  const handleTogglePricingModal = () => {
    setState((prevState) => {
      const nextVisible = !prevState.isVisible;
      if (nextVisible) {
        trackEvent("pricing_modal_open", {
          source: "pricing_modal",
        });
      }
      return {
        ...prevState,
        isVisible: nextVisible,
      };
    });
  };

  return {
    state,
    handleTogglePricingModal,
  };
};

export default usePricingModalStore;
