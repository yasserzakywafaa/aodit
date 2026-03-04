import {
  DashboardProjectsManager,
  useDashboardProjectsManager,
} from "./manager";
import { createContext, useContext } from "react";
import useDashboardProjectsStore, { DashboardProjectsStore } from "./store";

export interface DashboardProjectsContextProps {
  store: DashboardProjectsStore;
  manager: DashboardProjectsManager;
}

export interface DashboardProjectsContextProviderProps {
  children: React.ReactNode;
}

const DashboardProjectsContext = createContext<
  DashboardProjectsContextProps | undefined
>(undefined);

export const useDashboardProjectsContext = () => {
  const context = useContext(DashboardProjectsContext);
  if (!context) {
    throw new Error(
      "useDashboardProjectsContext must be used within an DashboardProjectsContextProvider",
    );
  }
  return context;
};

export const DashboardProjectsContextProvider = (
  params: DashboardProjectsContextProviderProps,
) => {
  const store = useDashboardProjectsStore();
  const manager = useDashboardProjectsManager(store);

  return (
    <DashboardProjectsContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardProjectsContext.Provider>
  );
};
