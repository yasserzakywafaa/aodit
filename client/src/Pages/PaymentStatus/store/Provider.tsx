import { PaymentStatusManager, usePaymentStatusManager } from "./manager";
import { createContext, useContext } from "react";
import usePaymentStatusStore, { PaymentStatusStore } from "./store";

export interface PaymentStatusContextProps {
  store: PaymentStatusStore;
  manager: PaymentStatusManager;
}

export interface PaymentStatusContextProviderProps {
  children: React.ReactNode;
}

const PaymentStatusContext = createContext<
  PaymentStatusContextProps | undefined
>(undefined);

export const usePaymentStatusContext = () => {
  const context = useContext(PaymentStatusContext);
  if (!context) {
    throw new Error(
      "usePaymentStatusContext must be used within an PaymentStatusContextProvider"
    );
  }
  return context;
};

export const PaymentStatusContextProvider = (
  params: PaymentStatusContextProviderProps
) => {
  const store = usePaymentStatusStore();
  const manager = usePaymentStatusManager(store);

  return (
    <PaymentStatusContext.Provider value={{ store, manager }}>
      {params.children}
    </PaymentStatusContext.Provider>
  );
};
