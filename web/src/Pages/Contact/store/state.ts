export interface ContactInitialState {
  isFetching: boolean;
  contactForm: ContactFormState;
}

export interface ContactFormState {
  name: string;
  company: string;
  email: string;
  role: string;
  reportOfInterest: string;
  message: string;
}

export const getContactInitialState = (): ContactInitialState => {
  return {
    isFetching: false,
    contactForm: {
      name: "",
      company: "",
      email: "",
      role: "",
      reportOfInterest: "",
      message: "",
    },
  };
};
