import { ContactManager, useContactManager } from "./manager";
import { createContext, useContext } from "react";
import useContactStore, { ContactStore } from "./store";

export interface ContactContextProps {
  store: ContactStore;
  manager: ContactManager;
}

export interface ContactContextProviderProps {
  children: React.ReactNode;
}

const ContactContext = createContext<ContactContextProps | undefined>(
  undefined
);

export const useContactContext = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error(
      "useContactContext must be used within an ContactContextProvider"
    );
  }
  return context;
};

export const ContactContextProvider = (params: ContactContextProviderProps) => {
  const store = useContactStore();
  const manager = useContactManager(store);

  return (
    <ContactContext.Provider value={{ store, manager }}>
      {params.children}
    </ContactContext.Provider>
  );
};
