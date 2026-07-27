import { DashboardOverviewManager, useDashboardOverviewManager } from "./manager";
import { createContext, useContext } from "react";
import useDashboardOverviewStore, { DashboardOverviewStore } from "./store";

export interface DashboardOverviewContextProps {
  store: DashboardOverviewStore;
  manager: DashboardOverviewManager;
}

export interface DashboardOverviewContextProviderProps {
  children: React.ReactNode;
}

const DashboardOverviewContext = createContext<DashboardOverviewContextProps | undefined>(
  undefined
);

export const useDashboardOverviewContext = () => {
  const context = useContext(DashboardOverviewContext);
  if (!context) {
    throw new Error(
      "useDashboardOverviewContext must be used within an DashboardOverviewContextProvider"
    );
  }
  return context;
};

export const DashboardOverviewContextProvider = (
  params: DashboardOverviewContextProviderProps
) => {
  const store = useDashboardOverviewStore();
  const manager = useDashboardOverviewManager(store);

  return (
    <DashboardOverviewContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardOverviewContext.Provider>
  );
};

