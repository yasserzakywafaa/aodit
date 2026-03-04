import {
  RegisterModalInitialState,
  getRegisterModalInitialState,
} from "./state";

import { useState } from "react";

export interface RegisterModalStore {
  state: RegisterModalInitialState;
  handleIsFetching: (isFetching: boolean) => void;
  handleToggleRegisterModal: () => void;
}

const useRegisterModalStore = (): RegisterModalStore => {
  const initialState = getRegisterModalInitialState();
  const [state, setState] = useState<RegisterModalInitialState>(initialState);

  const handleIsFetching = (isFetching: boolean) => {
    setState((prevState) => ({
      ...prevState,
      isFetching,
    }));
  };

  const handleToggleRegisterModal = () => {
    setState((prevState) => ({
      ...prevState,
      isVisible: !prevState.isVisible,
    }));
  };

  return {
    state,
    handleIsFetching,
    handleToggleRegisterModal,
  };
};

export default useRegisterModalStore;
