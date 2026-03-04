import { PricingManager, usePricingManager } from "./manager";
import { createContext, useContext } from "react";
import usePricingStore, { PricingStore } from "./store";

export interface PricingContextProps {
  store: PricingStore;
  manager: PricingManager;
}

export interface PricingContextProviderProps {
  children: React.ReactNode;
}

const PricingContext = createContext<PricingContextProps | undefined>(
  undefined
);

export const usePricingContext = () => {
  const context = useContext(PricingContext);
  if (!context) {
    throw new Error(
      "usePricingContext must be used within an PricingContextProvider"
    );
  }
  return context;
};

export const PricingContextProvider = (params: PricingContextProviderProps) => {
  const store = usePricingStore();
  const manager = usePricingManager(store);

  return (
    <PricingContext.Provider value={{ store, manager }}>
      {params.children}
    </PricingContext.Provider>
  );
};
