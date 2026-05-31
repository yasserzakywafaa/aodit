import { Price, Product } from "src/shared/types/payment";

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
