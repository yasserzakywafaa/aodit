import { DashboardProfileManager, useDashboardProfileManager } from "./manager";
import { createContext, useContext } from "react";
import useDashboardProfileStore, { DashboardProfileStore } from "./store";

export interface DashboardProfileContextProps {
  store: DashboardProfileStore;
  manager: DashboardProfileManager;
}

export interface DashboardProfileContextProviderProps {
  children: React.ReactNode;
}

const DashboardProfileContext = createContext<
  DashboardProfileContextProps | undefined
>(undefined);

export const useDashboardProfileContext = () => {
  const context = useContext(DashboardProfileContext);
  if (!context) {
    throw new Error(
      "useDashboardProfileContext must be used within an DashboardProfileContextProvider",
    );
  }
  return context;
};

export const DashboardProfileContextProvider = (
  params: DashboardProfileContextProviderProps,
) => {
  const store = useDashboardProfileStore();
  const manager = useDashboardProfileManager(store);

  return (
    <DashboardProfileContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardProfileContext.Provider>
  );
};
