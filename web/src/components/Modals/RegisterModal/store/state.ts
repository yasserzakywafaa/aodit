export interface RegisterModalInitialState {
  isFetching: boolean;
  isVisible: boolean;
}

export const getRegisterModalInitialState = (): RegisterModalInitialState => {
  return {
    isFetching: false,
    isVisible: false,
  };
};
