import {
  DashboardCreateAgentManager,
  useDashboardCreateAgentManager,
} from "./manager";
import { createContext, useContext } from "react";
import useDashboardCreateAgentStore, {
  DashboardCreateAgentStore,
} from "./store";

export interface DashboardCreateAgentContextProps {
  store: DashboardCreateAgentStore;
  manager: DashboardCreateAgentManager;
}

export interface DashboardCreateAgentContextProviderProps {
  children: React.ReactNode;
}

const DashboardCreateAgentContext = createContext<
  DashboardCreateAgentContextProps | undefined
>(undefined);

export const useDashboardCreateAgentContext = () => {
  const context = useContext(DashboardCreateAgentContext);
  if (!context) {
    throw new Error(
      "useDashboardCreateAgentContext must be used within a DashboardCreateAgentContextProvider",
    );
  }
  return context;
};

export const DashboardCreateAgentContextProvider = (
  params: DashboardCreateAgentContextProviderProps,
) => {
  const store = useDashboardCreateAgentStore();
  const manager = useDashboardCreateAgentManager(store);

  return (
    <DashboardCreateAgentContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardCreateAgentContext.Provider>
  );
};
