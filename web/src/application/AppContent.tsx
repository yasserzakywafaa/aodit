import "./App.scss";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { getThemedTheme } from "./shared/themes";
import { lazy, useEffect } from "react";

import APP_CONSTANTS from "./shared/app_constants";
import CookiePolicy from "src/components/shared/CookiePolicy/CookiePolicy";
import { CssBaseline } from "@mui/material";
import CustomCursor from "src/components/shared/CustomCursor/CustomCursor";
import Ga4PageView from "src/components/analytics/Ga4PageView";
import Ga4ScrollDepth from "src/components/analytics/Ga4ScrollDepth";
import { LANDING_PAGES } from "./shared/landingPages";
import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";
import { LoaderVariantEnum } from "src/shared/types/types";
import NotFoundPage from "../Pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import { ThemeProvider } from "@mui/material/styles";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import {
  ALL_PUBLIC_SEGMENTS,
  routes,
  toPublicSegment,
} from "./routes";
import { useAppResolvedThemeMode } from "./hooks/useAppResolvedThemeMode";
import { useApplicationContext } from "./store/Provider";
import { applyThemeToDOM } from "./store/store";
import { useDeviceSize } from "@yasserzakywafaa/client-core/web";
import {
  LocaleLayout,
  LocaleProvider,
  LocaleRedirect,
  useAppDirection,
} from "@yasserzakywafaa/client-core/web/i18n";
import i18n from "src/i18n/init";

const FeaturesPage = lazy(() => import("../Pages/Features/FeaturesPage"));
const FeaturesHomeRoute = lazy(
  () => import("../Pages/Features/FeaturesHomeRoute"),
);
const IndustryLandingPage = lazy(
  () => import("../Pages/Features/IndustryLandingPage"),
);
const DemoPage = lazy(() => import("../Pages/Demo/DemoPage"));
const PricingPage = lazy(() => import("../Pages/Pricing/Pricing"));
const MethodologyPage = lazy(() => import("../Pages/Methodology/Methodology"));
const SecurityPage = lazy(() => import("../Pages/Security/Security"));
const AboutPage = lazy(() => import("../Pages/About/About"));
const IndustriesHubPage = lazy(
  () => import("../Pages/Industries/IndustriesHub"),
);

const LoginPage = lazy(() => import("../Pages/Login"));
const RegisterPage = lazy(() => import("../Pages/Register"));

const MyProfilePage = lazy(
  () => import("../Pages/Dashboard/DashboardProfile/DashboardProfile"),
);

const ContactPage = lazy(() => import("../Pages/Contact/Contact"));

const PaymentStatusPage = lazy(
  () => import("../Pages/PaymentStatus/PaymentStatus"),
);
const PrivacyPolicyPage = lazy(
  () => import("../Pages/PrivacyPolicy/PrivacyPolicy"),
);
const TermsAndConditionsPage = lazy(
  () => import("../Pages/TermsAndConditions/TermsAndConditions"),
);
const DataProcessingAgreementPage = lazy(
  () => import("../Pages/DataProcessingAgreement/DataProcessingAgreement"),
);
const ComplianceFinmaPage = lazy(
  () => import("../Pages/Compliance/Finma/ComplianceFinma"),
);
const ComplianceEuAiActPage = lazy(
  () => import("../Pages/Compliance/EuAiAct/ComplianceEuAiAct"),
);

const DashboardLayout = lazy(
  () => import("./layouts/DashboardLayout/DashboardLayout"),
);
const DashboardPage = lazy(
  () => import("../Pages/Dashboard/DashboardOverview/DashboardOverview"),
);
const DashboardReportsPage = lazy(
  () => import("../Pages/Dashboard/DashboardReports/DashboardReports"),
);
const DashboardReportPage = lazy(
  () => import("../Pages/Dashboard/DashboardReport/DashboardReport"),
);

const DashboardCreateReportPage = lazy(
  () =>
    import("../Pages/Dashboard/DashboardCreateReport/DashboardCreateReport"),
);

const DashboardAgentsPage = lazy(
  () => import("../Pages/Dashboard/DashboardAgents/DashboardAgents"),
);
const DashboardAgentPage = lazy(
  () => import("../Pages/Dashboard/DashboardAgent/DashboardAgent"),
);
const DashboardCreateAgentPage = lazy(
  () => import("../Pages/Dashboard/DashboardCreateAgent/DashboardCreateAgent"),
);
const DashboardLiveFeedPage = lazy(
  () => import("../Pages/Dashboard/DashboardReportRun/DashboardReportRun"),
);

const DashboardAdminUsersPage = lazy(
  () =>
    import("../Pages/Dashboard/Admin/DashboardAdminUsers/DashboardAdminUsers"),
);
const DashboardAdminUserPage = lazy(
  () =>
    import("../Pages/Dashboard/Admin/DashboardAdminUser/DashboardAdminUser"),
);
const DashboardAdminAgentsPage = lazy(
  () =>
    import("../Pages/Dashboard/Admin/DashboardAdminAgents/DashboardAdminAgents"),
);
const DashboardAdminReportsPage = lazy(
  () =>
    import("../Pages/Dashboard/Admin/DashboardAdminReports/DashboardAdminReports"),
);
const DashboardAdminDemosPage = lazy(
  () =>
    import("../Pages/Dashboard/Admin/DashboardAdminDemos/DashboardAdminDemos"),
);
const DashboardAdminDemoPage = lazy(
  () => import("../Pages/Dashboard/Admin/DashboardAdminDemo/DashboardAdminDemo"),
);

const AppContent = () => {
  const {
    store: { state },
    manager: { handleInitialAuthentication },
  } = useApplicationContext();
  const { isDesktop } = useDeviceSize();
  const direction = useAppDirection();
  const resolvedThemeMode = useAppResolvedThemeMode();
  const theme = getThemedTheme(resolvedThemeMode, direction);

  useEffect(() => {
    handleInitialAuthentication();
  }, []);

  useEffect(() => {
    applyThemeToDOM(resolvedThemeMode);
  }, [resolvedThemeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isDesktop && <CustomCursor />}

      {state.isFetchingUserInfo && (
        <LoaderSpinner variant={LoaderVariantEnum.Dots} />
      )}

      {!state.isFetchingUserInfo && (
        <BrowserRouter>
          <LocaleProvider publicSegments={ALL_PUBLIC_SEGMENTS} i18n={i18n}>
            <Ga4PageView />
            <Ga4ScrollDepth />
            <Routes>
              <Route path={routes.root} element={<LocaleRedirect />} />

              {/* Flat routes — outside /:locale (auth, Swiss home, app) */}
              <Route path={routes.auth.login} element={<LoginPage />} />
              {!APP_CONSTANTS.IS_PROD && (
                <Route path={routes.auth.register} element={<RegisterPage />} />
              )}

              <Route
                path={routes.featuresCh}
                element={<FeaturesPage region="swiss" />}
              />

              <Route
                path={routes.dashboard.base}
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />

                <Route
                  path={routes.dashboard.reports.base}
                  element={<DashboardReportsPage />}
                />

                <Route
                  path={routes.dashboard.reports.reportById(":reportId")}
                  element={<DashboardReportPage />}
                />

                <Route
                  path={routes.dashboard.reports.reportLiveFeed(":reportId")}
                  element={<DashboardLiveFeedPage />}
                />

                <Route
                  path={routes.dashboard.reports.create}
                  element={<DashboardCreateReportPage />}
                />

                <Route
                  path={routes.dashboard.agents.base}
                  element={<DashboardAgentsPage />}
                />

                <Route
                  path={routes.dashboard.agents.agentById(":agentId")}
                  element={<DashboardAgentPage />}
                />

                <Route
                  path={routes.dashboard.agents.create}
                  element={<DashboardCreateAgentPage />}
                />

                <Route
                  path={routes.dashboard.user.profile}
                  element={<MyProfilePage />}
                />

                <Route
                  path={routes.dashboard.billing.paymentStatus(":sessionId")}
                  element={<PaymentStatusPage />}
                />

                {state.auth.isAuthenticated &&
                  !!state.auth.user &&
                  hasAdminRights(state.auth.user) && (
                    <>
                      <Route
                        path={routes.dashboard.admin.users.base}
                        element={<DashboardAdminUsersPage />}
                      />

                      <Route
                        path={routes.dashboard.user.userById(":userId")}
                        element={<DashboardAdminUserPage />}
                      />

                      <Route
                        path={routes.dashboard.admin.agents.base}
                        element={<DashboardAdminAgentsPage />}
                      />

                      <Route
                        path={routes.dashboard.admin.reports.base}
                        element={<DashboardAdminReportsPage />}
                      />

                      <Route
                        path={routes.dashboard.admin.demos.base}
                        element={<DashboardAdminDemosPage />}
                      />

                      <Route
                        path={routes.dashboard.admin.demos.demoById(":demoId")}
                        element={<DashboardAdminDemoPage />}
                      />
                    </>
                  )}
              </Route>

              <Route path="/:locale" element={<LocaleLayout i18n={i18n} />}>
                <Route index element={<FeaturesHomeRoute />} />
                <Route path={routes.industries} element={<IndustriesHubPage />} />

                {LANDING_PAGES.map((landingPage) => (
                  <Route
                    key={landingPage.key}
                    path={toPublicSegment(landingPage.slug)}
                    element={<IndustryLandingPage content={landingPage} />}
                  />
                ))}

                <Route path={routes.demo} element={<DemoPage />} />
                <Route path={routes.methodology} element={<MethodologyPage />} />
                <Route path={routes.security} element={<SecurityPage />} />
                <Route path={routes.about} element={<AboutPage />} />
                <Route
                  path={routes.compliance.finma}
                  element={<ComplianceFinmaPage />}
                />
                <Route
                  path={routes.compliance.euAiAct}
                  element={<ComplianceEuAiActPage />}
                />
                <Route path={routes.pricing} element={<PricingPage />} />
                <Route path={routes.contact} element={<ContactPage />} />
                <Route
                  path={routes.privacyPolicy}
                  element={<PrivacyPolicyPage />}
                />
                <Route
                  path={routes.termsAndConditions}
                  element={<TermsAndConditionsPage />}
                />
                <Route
                  path={routes.dataProcessingAgreement}
                  element={<DataProcessingAgreementPage />}
                />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <CookiePolicy />
          </LocaleProvider>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
};

export default AppContent;
