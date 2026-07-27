import { ApplicationContextProvider } from "./store/Provider";
import { CancelSubscriptionModalContextProvider } from "src/components/Modals/CancelSubscriptionModal/store/Provider";
import { ContactContextProvider } from "src/Pages/Contact/store/Provider";
import { DashboardCreateReportContextProvider } from "src/Pages/Dashboard/DashboardCreateReport/store/Provider";
import { DashboardAgentsContextProvider } from "src/Pages/Dashboard/DashboardAgents/store/Provider";
import { DashboardCreateAgentContextProvider } from "src/Pages/Dashboard/DashboardCreateAgent/store/Provider";
import { DashboardAgentContextProvider } from "src/Pages/Dashboard/DashboardAgent/store/Provider";
import { DashboardAdminAgentsContextProvider } from "src/Pages/Dashboard/Admin/DashboardAdminAgents/store/Provider";
import { DashboardAdminReportsContextProvider } from "src/Pages/Dashboard/Admin/DashboardAdminReports/store/Provider";
import { DashboardDemosContextProvider } from "src/Pages/Dashboard/Admin/DashboardAdminDemos/store/Provider";
import { DashboardDemoContextProvider } from "src/Pages/Dashboard/Admin/DashboardAdminDemo/store/Provider";
import { DashboardOverviewContextProvider } from "src/Pages/Dashboard/DashboardOverview/store/Provider";
import { DashboardProfileContextProvider } from "src/Pages/Dashboard/DashboardProfile/store/Provider";
import { DashboardReportContextProvider } from "src/Pages/Dashboard/DashboardReport/store/Provider";
import { DashboardReportsContextProvider } from "src/Pages/Dashboard/DashboardReports/store/Provider";
import { DashboardUserContextProvider } from "src/Pages/Dashboard/Admin/DashboardAdminUser/store/Provider";
import { DashboardUsersContextProvider } from "src/Pages/Dashboard/Admin/DashboardAdminUsers/store/Provider";
import { LoginModalContextProvider } from "src/components/Modals/LoginModal/store/Provider";
import { PaymentContextProvider } from "src/components/shared/Payment/store/Provider";
import { PaymentStatusContextProvider } from "src/Pages/PaymentStatus/store/Provider";
import { PricingContextProvider } from "src/Pages/Pricing/store/Provider";
import { PricingModalContextProvider } from "src/components/Modals/PricingModal/store/Provider";
import React from "react";
import { RegisterModalContextProvider } from "src/components/Modals/RegisterModal/store/Provider";
import { combineProviders } from "@yasserzakywafaa/client-core";

const contextProviders = [
  ApplicationContextProvider,
  PricingModalContextProvider,
  ContactContextProvider,
  PricingContextProvider,

  // User Pages
  DashboardProfileContextProvider,
  PaymentContextProvider,
  PaymentStatusContextProvider,
  CancelSubscriptionModalContextProvider,

  // Dashboard Pages
  DashboardOverviewContextProvider,
  DashboardReportsContextProvider,
  DashboardCreateReportContextProvider,
  DashboardUsersContextProvider,
  DashboardUserContextProvider,
  DashboardReportContextProvider,
  DashboardAgentsContextProvider,
  DashboardCreateAgentContextProvider,
  DashboardAgentContextProvider,
  DashboardAdminAgentsContextProvider,
  DashboardAdminReportsContextProvider,
  DashboardDemosContextProvider,
  DashboardDemoContextProvider,

  // Modals
  LoginModalContextProvider,
  RegisterModalContextProvider,
  PricingModalContextProvider,
];

const AppContextProviders: React.FC<{ children: React.ReactNode }> =
  combineProviders(contextProviders);

export default AppContextProviders;
