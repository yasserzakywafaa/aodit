import { AppBar, Container, Toolbar } from "@mui/material";
import { useLocation, useMatch, useNavigate } from "react-router-dom";

import ApplicationBarDesktopView from "./features/ApplicationBarDesktopView";
import ApplicationBarMobileView from "./features/ApplicationBarMobileView";
import { InstallAppModal } from "src/components/Modals/InstallAppModal/InstallAppModal";
import { LoginModal } from "src/components/Modals/LoginModal/LoginModal";
import { PricingModal } from "src/components/Modals/PricingModal/PricingModal";
import { RegisterModal } from "src/components/Modals/RegisterModal/RegisterModal";
import { routes } from "src/application/routes";
import { scrollToSection } from "@yasserzakywafaa/client-core/web";
import { trackEvent } from "src/shared/utils/ga4";
import { useApplicationContext } from "src/application/store/Provider";
import { useDetectScroll, useDeviceSize } from "@yasserzakywafaa/client-core/web";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { useState } from "react";

export interface PagesMatch {
  isFeaturesPage: boolean;
  isContactPage: boolean;
  isMethodologyPage: boolean;
  isFinmaPage: boolean;
  isSecurityPage: boolean;
  isAboutPage: boolean;
  isPrivacyPolicy: boolean;
  isTermsOfService: boolean;
  isDashboardPage: boolean;
}

const ApplicationBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isInstallAppDialogOpen, setIsInstallAppDialogOpen] =
    useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();
  const localizedPath = useLocalizedPath();
  const { isDesktop } = useDeviceSize();
  const { isScrolledFromTop } = useDetectScroll();

  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const {
    store: { handleToggleLoginModal },
  } = useLoginModalContext();

  const {
    store: { handleToggleRegisterModal },
  } = useRegisterModalContext();

  const isAppBarVisible = true;
  const pagesMatch: PagesMatch = {
    isFeaturesPage:
      !!useMatch({ path: "/:locale", end: true }) ||
      location.pathname === routes.featuresCh,
    isContactPage: !!useMatch(`/:locale/${routes.contact}`),
    isMethodologyPage: !!useMatch(`/:locale/${routes.methodology}`),
    isFinmaPage: !!useMatch(`/:locale/${routes.compliance.finma}`),
    isSecurityPage: !!useMatch(`/:locale/${routes.security}`),
    isAboutPage: !!useMatch(`/:locale/${routes.about}`),
    isPrivacyPolicy: !!useMatch(`/:locale/${routes.privacyPolicy}`),
    isTermsOfService: !!useMatch(`/:locale/${routes.termsAndConditions}`),
    isDashboardPage: location.pathname.startsWith(routes.dashboard.base),
  };

  const handleSetDrawer = (isOpen: boolean) => () => {
    setIsDrawerOpen(isOpen);
  };

  const handleOnMenuItemClick = (sectionId: string) => {
    trackEvent("nav_click", {
      section: sectionId,
      page_path: location.pathname,
    });

    switch (sectionId) {
      case "home":
        navigate(
          location.pathname === routes.featuresCh
            ? routes.featuresCh
            : localizedPath(routes.features),
        );
        break;
      case "methodology":
        navigate(localizedPath(routes.methodology));
        break;
      case "security":
        navigate(localizedPath(routes.security));
        break;
      case "about":
        navigate(localizedPath(routes.about));
        break;
      case "compliance-finma":
        navigate(localizedPath(routes.compliance.finma));
        break;
      case "compliance-eu-ai-act":
        navigate(localizedPath(routes.compliance.euAiAct));
        break;
      case "contact":
        navigate(localizedPath(routes.contact));
        break;
      case "demo":
        navigate(localizedPath(routes.demo));
        break;
      case "request-evaluation":
        navigate(localizedPath(routes.contact));
        break;
      case "install":
        setIsInstallAppDialogOpen(true);
        return;
      case "my-reports":
        auth.user &&
          navigate(routes.dashboard.reports.reportsByUserId(auth.user._id));
        return;
      case "create":
        navigate(routes.dashboard.reports.create);
        break;
      default:
        scrollToSection("hero");
    }
    setIsDrawerOpen(false);
  };

  return (
    <>
      {isAppBarVisible && (
        <AppBar
          position="fixed"
          sx={(theme) => ({
            boxShadow: 0,
            bgcolor: "background.default",
            backgroundImage: "none",
            borderBottom: `1px solid ${theme.palette.divider}`,
            backdropFilter: "blur(12px)",
          })}
        >
          <Container
            maxWidth={false}
            className="application-bar-container"
            sx={{ px: { xs: 3, sm: 6 } }}
          >
            <Toolbar
              variant="regular"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                minHeight: { xs: 56, md: 64 },
                py: 1,
              }}
            >
              {isDesktop ? (
                <ApplicationBarDesktopView
                  auth={auth}
                  pagesMatch={pagesMatch}
                  handleToggleLoginModal={handleToggleLoginModal}
                  handleToggleRegisterModal={handleToggleRegisterModal}
                  setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
                  handleOnMenuItemClick={handleOnMenuItemClick}
                />
              ) : (
                <ApplicationBarMobileView
                  auth={auth}
                  pagesMatch={pagesMatch}
                  isDrawerOpen={isDrawerOpen}
                  isScrolledFromTop={isScrolledFromTop}
                  handleSetDrawer={handleSetDrawer}
                  handleToggleLoginModal={handleToggleLoginModal}
                  handleToggleRegisterModal={handleToggleRegisterModal}
                  setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
                  handleOnMenuItemClick={handleOnMenuItemClick}
                />
              )}
            </Toolbar>
          </Container>
        </AppBar>
      )}

      {/* Modals */}
      <LoginModal />
      <RegisterModal />
      <InstallAppModal
        isInstallAppDialogOpen={isInstallAppDialogOpen}
        setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
      />
      <PricingModal />
    </>
  );
};

export default ApplicationBar;
