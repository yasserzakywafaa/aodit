import {
  DashboardAdminAgentsManager,
  useDashboardAdminAgentsManager,
} from "./manager";
import { createContext, useContext } from "react";
import useDashboardAdminAgentsStore, {
  DashboardAdminAgentsStore,
} from "./store";

export interface DashboardAdminAgentsContextProps {
  store: DashboardAdminAgentsStore;
  manager: DashboardAdminAgentsManager;
}

export interface DashboardAdminAgentsContextProviderProps {
  children: React.ReactNode;
}

const DashboardAdminAgentsContext = createContext<
  DashboardAdminAgentsContextProps | undefined
>(undefined);

export const useDashboardAdminAgentsContext = () => {
  const context = useContext(DashboardAdminAgentsContext);
  if (!context) {
    throw new Error(
      "useDashboardAdminAgentsContext must be used within a DashboardAdminAgentsContextProvider",
    );
  }
  return context;
};

export const DashboardAdminAgentsContextProvider = (
  params: DashboardAdminAgentsContextProviderProps,
) => {
  const store = useDashboardAdminAgentsStore();
  const manager = useDashboardAdminAgentsManager(store);

  return (
    <DashboardAdminAgentsContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardAdminAgentsContext.Provider>
  );
};
