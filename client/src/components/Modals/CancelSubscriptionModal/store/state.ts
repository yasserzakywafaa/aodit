export interface CancelSubscriptionModalInitialState {
  isVisible: boolean;
}

export const getCancelSubscriptionModalInitialState =
  (): CancelSubscriptionModalInitialState => {
    return {
      isVisible: false,
    };
  };
