import { DashboardDemoManager, useDashboardDemoManager } from "./manager";
import { createContext, useContext } from "react";
import useDashboardDemoStore, { DashboardDemoStore } from "./store";

export interface DashboardDemoContextProps {
  store: DashboardDemoStore;
  manager: DashboardDemoManager;
}

export interface DashboardDemoContextProviderProps {
  children: React.ReactNode;
}

const DashboardDemoContext = createContext<
  DashboardDemoContextProps | undefined
>(undefined);

export const useDashboardDemoContext = () => {
  const context = useContext(DashboardDemoContext);
  if (!context) {
    throw new Error(
      "useDashboardDemoContext must be used within an DashboardDemoContextProvider",
    );
  }
  return context;
};

export const DashboardDemoContextProvider = (
  params: DashboardDemoContextProviderProps,
) => {
  const store = useDashboardDemoStore();
  const manager = useDashboardDemoManager(store);

  return (
    <DashboardDemoContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardDemoContext.Provider>
  );
};
