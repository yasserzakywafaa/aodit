import {
  DashboardCreateProjectManager,
  useDashboardCreateProjectManager,
} from "./manager";
import { createContext, useContext } from "react";
import useDashboardCreateProjectStore, {
  DashboardCreateProjectStore,
} from "./store";

export interface DashboardCreateProjectContextProps {
  store: DashboardCreateProjectStore;
  manager: DashboardCreateProjectManager;
}

export interface DashboardCreateProjectContextProviderProps {
  children: React.ReactNode;
}

const DashboardCreateProjectContext = createContext<
  DashboardCreateProjectContextProps | undefined
>(undefined);

export const useDashboardCreateProjectContext = () => {
  const context = useContext(DashboardCreateProjectContext);
  if (!context) {
    throw new Error(
      "useDashboardCreateProjectContext must be used within an DashboardCreateProjectContextProvider",
    );
  }
  return context;
};

export const DashboardCreateProjectContextProvider = (
  params: DashboardCreateProjectContextProviderProps,
) => {
  const store = useDashboardCreateProjectStore();
  const manager = useDashboardCreateProjectManager(store);

  return (
    <DashboardCreateProjectContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardCreateProjectContext.Provider>
  );
};
