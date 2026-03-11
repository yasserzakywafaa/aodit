import {
  DashboardCreateReportManager,
  useDashboardCreateReportManager,
} from "./manager";
import { createContext, useContext } from "react";
import useDashboardCreateReportStore, {
  DashboardCreateReportStore,
} from "./store";

export interface DashboardCreateReportContextProps {
  store: DashboardCreateReportStore;
  manager: DashboardCreateReportManager;
}

export interface DashboardCreateReportContextProviderProps {
  children: React.ReactNode;
}

const DashboardCreateReportContext = createContext<
  DashboardCreateReportContextProps | undefined
>(undefined);

export const useDashboardCreateReportContext = () => {
  const context = useContext(DashboardCreateReportContext);
  if (!context) {
    throw new Error(
      "useDashboardCreateReportContext must be used within an DashboardCreateReportContextProvider",
    );
  }
  return context;
};

export const DashboardCreateReportContextProvider = (
  params: DashboardCreateReportContextProviderProps,
) => {
  const store = useDashboardCreateReportStore();
  const manager = useDashboardCreateReportManager(store);

  return (
    <DashboardCreateReportContext.Provider value={{ store, manager }}>
      {params.children}
    </DashboardCreateReportContext.Provider>
  );
};
