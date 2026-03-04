import { ApplicationContextProvider } from "./store/Provider";
import { CancelSubscriptionModalContextProvider } from "src/components/Modals/CancelSubscriptionModal/store/Provider";
import { ContactContextProvider } from "src/Pages/Contact/store/Provider";
import { DashboardCreateProjectContextProvider } from "src/Pages/Dashboard/DashboardCreateProject/store/Provider";
import { DashboardOverviewContextProvider } from "src/Pages/Dashboard/DashboardOverview/store/Provider";
import { DashboardProfileContextProvider } from "src/Pages/Dashboard/DashboardProfile/store/Provider";
import { DashboardProjectContextProvider } from "src/Pages/Dashboard/DashboardProject/store/Provider";
import { DashboardProjectsContextProvider } from "src/Pages/Dashboard/DashboardProjects/store/Provider";
import { DashboardUserContextProvider } from "src/Pages/Dashboard/Admin/DashboardAdminUser/store/Provider";
import { DashboardUsersContextProvider } from "src/Pages/Dashboard/Admin/DashboardAdminUsers/store/Provider";
import { LoginModalContextProvider } from "src/components/Modals/LoginModal/store/Provider";
import { PaymentContextProvider } from "src/components/shared/Payment/store/Provider";
import { PaymentStatusContextProvider } from "src/Pages/PaymentStatus/store/Provider";
import { PricingContextProvider } from "src/Pages/Pricing/store/Provider";
import { PricingModalContextProvider } from "src/components/Modals/PricingModal/store/Provider";
import React from "react";
import { RegisterModalContextProvider } from "src/components/Modals/RegisterModal/store/Provider";
import combineProviders from "./shared/combineProviders";

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
  DashboardProjectsContextProvider,
  DashboardCreateProjectContextProvider,
  DashboardUsersContextProvider,
  DashboardUserContextProvider,
  DashboardProjectContextProvider,

  // Modals
  LoginModalContextProvider,
  RegisterModalContextProvider,
  PricingModalContextProvider,
];

const AppContextProviders: React.FC<{ children: React.ReactNode }> =
  combineProviders(contextProviders);

export default AppContextProviders;
