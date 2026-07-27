import { LoginModalInitialState, getLoginModalInitialState } from "./state";

import { useState } from "react";

export interface LoginModalStore {
  state: LoginModalInitialState;
  handleIsFetching: (isFetching: boolean) => void;
  handleToggleLoginModal: () => void;
}

const useLoginModalStore = (): LoginModalStore => {
  const initialState = getLoginModalInitialState();
  const [state, setState] = useState<LoginModalInitialState>(initialState);

  const handleIsFetching = (isFetching: boolean) => {
    setState((prevState) => ({
      ...prevState,
      isFetching,
    }));
  };

  const handleToggleLoginModal = () => {
    setState((prevState) => ({
      ...prevState,
      isVisible: !prevState.isVisible,
    }));
  };

  return {
    state,
    handleIsFetching,
    handleToggleLoginModal,
  };
};

export default useLoginModalStore;
