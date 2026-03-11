import {
  DashboardReportManager,
  useDashboardReportManager,
} from "./manager";
import { createContext, useContext } from "react";
import useDashboardReportStore, { DashboardReportStore } from "./store";

export interface DashboardReportContextProps {
  store: DashboardReportStore;
  manager: DashboardReportManager;
}

export interface DashboardReportContextProviderProps {
  children: React.ReactNode;
}

const DashboardReportContext = createContext<
  DashboardReportContextProps | undefined
>(undefined);

export const useDashboardReportContext = () => {
  const context = useContext(DashboardReportContext);
  if (!context) {
    throw new Error(
      "useDashboardReportContext must be used within an DashboardReportContextProvider",
    );
  }
  return context;
};

export const DashboardReportContextProvider = (
  params: DashboardReportContextProviderProps,
) => {
  const store = useDashboardReportStore();
  const manager = useDashboardReportManager(store);

  return (
    <DashboardReportContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardReportContext.Provider>
  );
};
