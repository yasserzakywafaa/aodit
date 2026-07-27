import {
  DashboardAgentsManager,
  useDashboardAgentsManager,
} from "./manager";
import { createContext, useContext } from "react";
import useDashboardAgentsStore, { DashboardAgentsStore } from "./store";

export interface DashboardAgentsContextProps {
  store: DashboardAgentsStore;
  manager: DashboardAgentsManager;
}

export interface DashboardAgentsContextProviderProps {
  children: React.ReactNode;
}

const DashboardAgentsContext = createContext<
  DashboardAgentsContextProps | undefined
>(undefined);

export const useDashboardAgentsContext = () => {
  const context = useContext(DashboardAgentsContext);
  if (!context) {
    throw new Error(
      "useDashboardAgentsContext must be used within a DashboardAgentsContextProvider",
    );
  }
  return context;
};

export const DashboardAgentsContextProvider = (
  params: DashboardAgentsContextProviderProps,
) => {
  const store = useDashboardAgentsStore();
  const manager = useDashboardAgentsManager(store);

  return (
    <DashboardAgentsContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardAgentsContext.Provider>
  );
};
