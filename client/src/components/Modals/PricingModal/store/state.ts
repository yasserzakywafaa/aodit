export interface PricingModalInitialState {
  isVisible: boolean;
}

export const getPricingModalInitialState = (): PricingModalInitialState => {
  return {
    isVisible: false,
  };
};
