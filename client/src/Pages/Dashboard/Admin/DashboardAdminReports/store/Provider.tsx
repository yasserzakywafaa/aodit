import {
  DashboardAdminReportsManager,
  useDashboardAdminReportsManager,
} from "./manager";
import { createContext, useContext } from "react";
import useDashboardAdminReportsStore, {
  DashboardAdminReportsStore,
} from "./store";

export interface DashboardAdminReportsContextProps {
  store: DashboardAdminReportsStore;
  manager: DashboardAdminReportsManager;
}

export interface DashboardAdminReportsContextProviderProps {
  children: React.ReactNode;
}

const DashboardAdminReportsContext = createContext<
  DashboardAdminReportsContextProps | undefined
>(undefined);

export const useDashboardAdminReportsContext = () => {
  const context = useContext(DashboardAdminReportsContext);
  if (!context) {
    throw new Error(
      "useDashboardAdminReportsContext must be used within a DashboardAdminReportsContextProvider",
    );
  }
  return context;
};

export const DashboardAdminReportsContextProvider = (
  params: DashboardAdminReportsContextProviderProps,
) => {
  const store = useDashboardAdminReportsStore();
  const manager = useDashboardAdminReportsManager(store);

  return (
    <DashboardAdminReportsContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardAdminReportsContext.Provider>
  );
};
