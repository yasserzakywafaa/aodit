import "./App.scss";

import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { darkTheme, lightTheme } from "./shared/themes";
import { lazy, useEffect } from "react";

import { CssBaseline } from "@mui/material";
import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";
import { LoaderVariantEnum } from "src/shared/types/types";
import NotFoundPage from "../Pages/NotFound/NotFound";
import { ThemeProvider } from "@emotion/react";
import { getApplicationInitialState } from "./store/state";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import { removeLocalStorageAuthItems } from "src/shared/utils/localstorage";
import { routes } from "./routes";
import { useApplicationContext } from "./store/Provider";

const ResetAndRedirectHome = () => {
  const navigate = useNavigate();
  const {
    manager: { handleSetAuthInfo },
  } = useApplicationContext();

  useEffect(() => {
    removeLocalStorageAuthItems();
    handleSetAuthInfo(getApplicationInitialState().auth);

    // Optional: Redirect to Login page (if any)
    navigate(routes.features, { replace: true });
  }, [handleSetAuthInfo, navigate]);

  return null;
};

const FeaturesPage = lazy(() => import("../Pages/Features/FeaturesPage"));
const PricingPage = lazy(() => import("../Pages/Pricing/Pricing"));

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

// Dashboard Layout and Pages
const DashboardLayout = lazy(
  () => import("./layouts/DashboardLayout/DashboardLayout"),
);
const DashboardPage = lazy(
  () => import("../Pages/Dashboard/DashboardOverview/DashboardOverview"),
);
const DashboardProjectsPage = lazy(
  () => import("../Pages/Dashboard/DashboardProjects/DashboardProjects"),
);
const DashboardProjectPage = lazy(
  () => import("../Pages/Dashboard/DashboardProject/DashboardProject"),
);

const DashboardCreateProjectPage = lazy(
  () =>
    import("../Pages/Dashboard/DashboardCreateProject/DashboardCreateProject"),
);

// Dashboard Layout and Pages
const DashboardAdminUsersPage = lazy(
  () =>
    import("../Pages/Dashboard/Admin/DashboardAdminUsers/DashboardAdminUsers"),
);
const DashboardAdminUserPage = lazy(
  () =>
    import("../Pages/Dashboard/Admin/DashboardAdminUser/DashboardAdminUser"),
);

const AppContent = () => {
  const {
    store: { state },
    manager: { handleInitialAuthentication },
  } = useApplicationContext();

  useEffect(() => {
    handleInitialAuthentication();
  }, []);

  return (
    <ThemeProvider theme={state.themeMode === "light" ? lightTheme : darkTheme}>
      <CssBaseline />

      {state.isFetchingUserInfo && (
        <LoaderSpinner variant={LoaderVariantEnum.Dots} />
      )}

      {!state.isFetchingUserInfo && (
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path={routes.auth.login} element={<LoginPage />} />
            <Route path={routes.auth.register} element={<RegisterPage />} />

            {/* Public Routes */}
            <Route index path={routes.features} element={<FeaturesPage />} />
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

            {state.auth.isAuthenticated && !!state.auth.user ? (
              <>
                {/* User Dashboard Routes */}
                <Route
                  path={routes.dashboard.base}
                  element={<DashboardLayout />}
                >
                  <Route index element={<DashboardPage />} />

                  <Route
                    path={routes.dashboard.projects.base}
                    element={<DashboardProjectsPage />}
                  />

                  <Route
                    path={routes.dashboard.projects.projectById(":projectId")}
                    element={<DashboardProjectPage />}
                  />

                  <Route
                    path={routes.dashboard.projects.create}
                    element={<DashboardCreateProjectPage />}
                  />

                  <Route
                    path={routes.dashboard.user.profile}
                    element={<MyProfilePage />}
                  />

                  <Route
                    path={routes.dashboard.billing.paymentStatus(":sessionId")}
                    element={<PaymentStatusPage />}
                  />

                  {hasAdminRights(state.auth.user) && (
                    <>
                      <Route
                        path={routes.dashboard.admin.users.base}
                        element={<DashboardAdminUsersPage />}
                      />

                      <Route
                        path={routes.dashboard.user.userById(":userId")}
                        element={<DashboardAdminUserPage />}
                      />
                    </>
                  )}
                </Route>
              </>
            ) : (
              <Route path="*" element={<ResetAndRedirectHome />} />
            )}

            {/* Fallback route for 404 errors */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
};

export default AppContent;
