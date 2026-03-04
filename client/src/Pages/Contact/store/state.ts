export interface ContactInitialState {
  isFetching: boolean;
  contactForm: ContactFormState;
}

export interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const getContactInitialState = (): ContactInitialState => {
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
