import { PaymentInitialState, getPaymentInitialState } from "./state";
import { Price, Product } from "src/shared/types/payment";

import { useState } from "react";

export interface PaymentStore {
  state: PaymentInitialState;
  setClientSecret: (clientSecret: string) => void;
  setPublishableKey: (publishableKey: string) => void;
  setProducts: (products: Product[]) => void;
  setPrices: (prices: Price[]) => void;
}

const usePaymentStore = (): PaymentStore => {
  const initialState = getPaymentInitialState();
  const [state, setState] = useState<PaymentInitialState>(initialState);

  const setPublishableKey = (publishableKey: string) => {
    setState((prev) => ({
      ...prev,
      publishableKey,
    }));
  };

  const setClientSecret = (clientSecret: string) => {
    setState((prev) => ({
      ...prev,
      clientSecret,
    }));
  };

  const setProducts = (products: Product[]) => {
    setState((prev) => ({
      ...prev,
      products,
    }));
  };

  const setPrices = (prices: Price[]) => {
    setState((prev) => ({
      ...prev,
      prices,
    }));
  };

  return {
    state,
    setClientSecret,
    setPublishableKey,
    setProducts,
    setPrices,
  };
};

export default usePaymentStore;
