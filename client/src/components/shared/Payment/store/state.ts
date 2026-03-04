import { Price, Product } from "src/shared/types/payment";

import { Stripe } from "@stripe/stripe-js";

export interface PaymentInitialState {
  publishableKey: string;
  clientSecret: string;
  stripePromise: Stripe | null;
  products: Product[];
  prices: Price[];
}

export const getPaymentInitialState = (): PaymentInitialState => {
  return {
    publishableKey: "",
    clientSecret: "",
    stripePromise: null,
    products: [],
    prices: [],
  };
};
