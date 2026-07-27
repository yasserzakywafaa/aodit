export interface PricingInitialState {
  isFetching: boolean;
  contactForm: PricingFormState;
}

export interface PricingFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const getPricingInitialState = (): PricingInitialState => {
  return {
    isFetching: false,
    contactForm: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  };
};
