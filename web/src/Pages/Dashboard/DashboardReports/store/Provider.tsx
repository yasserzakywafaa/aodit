import {
  DashboardReportsManager,
  useDashboardReportsManager,
} from "./manager";
import { createContext, useContext } from "react";
import useDashboardReportsStore, { DashboardReportsStore } from "./store";

export interface DashboardReportsContextProps {
  store: DashboardReportsStore;
  manager: DashboardReportsManager;
}

export interface DashboardReportsContextProviderProps {
  children: React.ReactNode;
}

const DashboardReportsContext = createContext<
  DashboardReportsContextProps | undefined
>(undefined);

export const useDashboardReportsContext = () => {
  const context = useContext(DashboardReportsContext);
  if (!context) {
    throw new Error(
      "useDashboardReportsContext must be used within an DashboardReportsContextProvider",
    );
  }
  return context;
};

export const DashboardReportsContextProvider = (
  params: DashboardReportsContextProviderProps,
) => {
  const store = useDashboardReportsStore();
  const manager = useDashboardReportsManager(store);

  return (
    <DashboardReportsContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardReportsContext.Provider>
  );
};
