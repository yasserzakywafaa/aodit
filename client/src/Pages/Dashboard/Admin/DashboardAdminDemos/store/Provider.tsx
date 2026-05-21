import { DashboardDemosManager, useDashboardDemosManager } from "./manager";
import { createContext, useContext } from "react";
import useDashboardDemosStore, { DashboardDemosStore } from "./store";

export interface DashboardDemosContextProps {
  store: DashboardDemosStore;
  manager: DashboardDemosManager;
}

export interface DashboardDemosContextProviderProps {
  children: React.ReactNode;
}

const DashboardDemosContext = createContext<
  DashboardDemosContextProps | undefined
>(undefined);

export const useDashboardDemosContext = () => {
  const context = useContext(DashboardDemosContext);
  if (!context) {
    throw new Error(
      "useDashboardDemosContext must be used within an DashboardDemosContextProvider",
    );
  }
  return context;
};

export const DashboardDemosContextProvider = (
  params: DashboardDemosContextProviderProps,
) => {
  const store = useDashboardDemosStore();
  const manager = useDashboardDemosManager(store);

  return (
    <DashboardDemosContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardDemosContext.Provider>
  );
};
