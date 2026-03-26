import {
  DashboardAgentManager,
  useDashboardAgentManager,
} from "./manager";
import { createContext, useContext } from "react";
import useDashboardAgentStore, { DashboardAgentStore } from "./store";

export interface DashboardAgentContextProps {
  store: DashboardAgentStore;
  manager: DashboardAgentManager;
}

export interface DashboardAgentContextProviderProps {
  children: React.ReactNode;
}

const DashboardAgentContext = createContext<
  DashboardAgentContextProps | undefined
>(undefined);

export const useDashboardAgentContext = () => {
  const context = useContext(DashboardAgentContext);
  if (!context) {
    throw new Error(
      "useDashboardAgentContext must be used within a DashboardAgentContextProvider",
    );
  }
  return context;
};

export const DashboardAgentContextProvider = (
  params: DashboardAgentContextProviderProps,
) => {
  const store = useDashboardAgentStore();
  const manager = useDashboardAgentManager(store);

  return (
    <DashboardAgentContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardAgentContext.Provider>
  );
};
