import { DashboardUserManager, useDashboardUserManager } from "./manager";
import { createContext, useContext } from "react";
import useDashboardUserStore, { DashboardUserStore } from "./store";

export interface DashboardUserContextProps {
  store: DashboardUserStore;
  manager: DashboardUserManager;
}

export interface DashboardUserContextProviderProps {
  children: React.ReactNode;
}

const DashboardUserContext = createContext<DashboardUserContextProps | undefined>(
  undefined
);

export const useDashboardUserContext = () => {
  const context = useContext(DashboardUserContext);
  if (!context) {
    throw new Error(
      "useDashboardUserContext must be used within an DashboardUserContextProvider"
    );
  }
  return context;
};

export const DashboardUserContextProvider = (
  params: DashboardUserContextProviderProps
) => {
  const store = useDashboardUserStore();
  const manager = useDashboardUserManager(store);

  return (
    <DashboardUserContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardUserContext.Provider>
  );
};

