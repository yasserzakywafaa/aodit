import { createContext, useContext } from "react";
import useCancelSubscriptionModalStore, {
  CancelSubscriptionModalStore,
} from "./store";

export interface CancelSubscriptionModalContextProps {
  store: CancelSubscriptionModalStore;
}

export interface CancelSubscriptionModalContextProviderProps {
  children: React.ReactNode;
}

const CancelSubscriptionModalContext = createContext<
  CancelSubscriptionModalContextProps | undefined
>(undefined);

export const useCancelSubscriptionModalContext = () => {
  const context = useContext(CancelSubscriptionModalContext);
  if (!context) {
    throw new Error(
      "useCancelSubscriptionModalContext must be used within an CancelSubscriptionModalContextProvider"
    );
  }
  return context;
};

export const CancelSubscriptionModalContextProvider = (
  params: CancelSubscriptionModalContextProviderProps
) => {
  const store = useCancelSubscriptionModalStore();

  return (
    <CancelSubscriptionModalContext.Provider value={{ store }}>
      {params.children}
    </CancelSubscriptionModalContext.Provider>
  );
};
