export interface LoginModalInitialState {
  isFetching: boolean;
  isVisible: boolean;
}

export const getLoginModalInitialState = (): LoginModalInitialState => {
  return {
    isFetching: false,
    isVisible: false,
  };
};
