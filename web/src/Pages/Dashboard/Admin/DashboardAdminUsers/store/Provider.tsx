import { DashboardUsersManager, useDashboardUsersManager } from "./manager";
import { createContext, useContext } from "react";
import useDashboardUsersStore, { DashboardUsersStore } from "./store";

export interface DashboardUsersContextProps {
  store: DashboardUsersStore;
  manager: DashboardUsersManager;
}

export interface DashboardUsersContextProviderProps {
  children: React.ReactNode;
}

const DashboardUsersContext = createContext<DashboardUsersContextProps | undefined>(
  undefined
);

export const useDashboardUsersContext = () => {
  const context = useContext(DashboardUsersContext);
  if (!context) {
    throw new Error(
      "useDashboardUsersContext must be used within an DashboardUsersContextProvider"
    );
  }
  return context;
};

export const DashboardUsersContextProvider = (
  params: DashboardUsersContextProviderProps
) => {
  const store = useDashboardUsersStore();
  const manager = useDashboardUsersManager(store);

  return (
    <DashboardUsersContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardUsersContext.Provider>
  );
};

