import { Price, Product } from "@yasserzakywafaa/client-core";

export interface PaymentInitialState {
  publishableKey: string;
  clientSecret: string;
  products: Product[];
  prices: Price[];
}

export const getPaymentInitialState = (): PaymentInitialState => {
  return {
    publishableKey: "",
    clientSecret: "",
    products: [],
    prices: [],
  };
};
