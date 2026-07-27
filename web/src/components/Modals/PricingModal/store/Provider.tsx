import { createContext, useContext } from "react";
import usePricingModalStore, { PricingModalStore } from "./store";

export interface PricingModalContextProps {
  store: PricingModalStore;
}

export interface PricingModalContextProviderProps {
  children: React.ReactNode;
}

const PricingModalContext = createContext<
  PricingModalContextProps | undefined
>(undefined);

export const usePricingModalContext = () => {
  const context = useContext(PricingModalContext);
  if (!context) {
    throw new Error(
      "usePricingModalContext must be used within an PricingModalContextProvider"
    );
  }
  return context;
};

export const PricingModalContextProvider = (
  params: PricingModalContextProviderProps
) => {
  const store = usePricingModalStore();

  return (
    <PricingModalContext.Provider value={{ store }}>
      {params.children}
    </PricingModalContext.Provider>
  );
};
