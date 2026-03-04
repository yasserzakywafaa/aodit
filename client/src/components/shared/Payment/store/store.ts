import { PaymentInitialState, getPaymentInitialState } from "./state";
import { Price, Product } from "src/shared/types/payment";

import { Stripe } from "@stripe/stripe-js";
import { useState } from "react";

export interface PaymentStore {
  state: PaymentInitialState;
  setClientSecret: (clientSecret: string) => void;
  setPublishableKey: (publishableKey: string) => void;
  setStripePromise: (stripePromise: Stripe | null) => void;
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

  const setStripePromise = (stripePromise: Stripe | null) => {
    setState((prev) => ({
      ...prev,
      stripePromise,
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
    setStripePromise,
    setPublishableKey,
    setProducts,
    setPrices,
  };
};

export default usePaymentStore;
