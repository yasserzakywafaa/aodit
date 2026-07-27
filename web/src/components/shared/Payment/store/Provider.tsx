import { createContext, useContext } from "react";
import usePaymentStore, { PaymentStore } from "./store";
import { PaymentManager, usePaymentManager } from "./manager";

export interface PaymentContextProps {
  store: PaymentStore;
  manager: PaymentManager;
}

export interface PaymentContextProviderProps {
  children: React.ReactNode;
}

const PaymentContext = createContext<
  PaymentContextProps | undefined
>(undefined);

export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error(
      "usePaymentContext must be used within an PaymentContextProvider"
    );
  }
  return context;
};

export const PaymentContextProvider = (
  params: PaymentContextProviderProps
) => {
  const store = usePaymentStore();
  const manager = usePaymentManager(store);

  return (
    <PaymentContext.Provider value={{ store, manager }}>
      {params.children}
    </PaymentContext.Provider>
  );
};
