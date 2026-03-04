import { DashboardProjectManager, useDashboardProjectManager } from "./manager";
import { createContext, useContext } from "react";
import useDashboardProjectStore, { DashboardProjectStore } from "./store";

export interface DashboardProjectContextProps {
  store: DashboardProjectStore;
  manager: DashboardProjectManager;
}

export interface DashboardProjectContextProviderProps {
  children: React.ReactNode;
}

const DashboardProjectContext = createContext<
  DashboardProjectContextProps | undefined
>(undefined);

export const useDashboardProjectContext = () => {
  const context = useContext(DashboardProjectContext);
  if (!context) {
    throw new Error(
      "useDashboardProjectContext must be used within an DashboardProjectContextProvider",
    );
  }
  return context;
};

export const DashboardProjectContextProvider = (
  params: DashboardProjectContextProviderProps,
) => {
  const store = useDashboardProjectStore();
  const manager = useDashboardProjectManager(store);

  return (
    <DashboardProjectContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardProjectContext.Provider>
  );
};
