import { ApplicationManager, useApplicationManager } from "./manager";
import React, { createContext, useContext } from "react";
import useApplicationStore, { ApplicationStore } from "./store";

type ApplicationContextProps = {
  store: ApplicationStore;
  manager: ApplicationManager;
};

type ApplicationContextProviderProps = { children: React.ReactNode };

const AppContext = createContext<ApplicationContextProps | undefined>(
  undefined
);

export const useApplicationContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error(
      "useApplicationContext must be used within an ApplicationContextProvider"
    );
  }
  return context;
};

export const ApplicationContextProvider = ({
  children,
}: ApplicationContextProviderProps) => {
  const store = useApplicationStore();
  const manager = useApplicationManager(store);

  return (
    <AppContext.Provider value={{ store, manager }}>
      {children}
    </AppContext.Provider>
  );
};
