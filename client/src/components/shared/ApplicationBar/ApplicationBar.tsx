import { AppBar, Container, Theme, Toolbar } from "@mui/material";
import { useLocation, useMatch, useNavigate } from "react-router-dom";

import ApplicationBarDesktopView from "./features/ApplicationBarDesktopView";
import ApplicationBarMobileView from "./features/ApplicationBarMobileView";
import { CancelSubscriptionModal } from "src/components/Modals/CancelSubscriptionModal/CancelSubscriptionModal";
import { InstallAppModal } from "src/components/Modals/InstallAppModal/InstallAppModal";
import { LoginModal } from "src/components/Modals/LoginModal/LoginModal";
import { PricingModal } from "src/components/Modals/PricingModal/PricingModal";
import { RegisterModal } from "src/components/Modals/RegisterModal/RegisterModal";
import { routes } from "src/application/routes";
import { scrollToSection } from "src/shared/utils/scrollTo";
import { useApplicationContext } from "src/application/store/Provider";
import useDetectScroll from "src/shared/hooks/useDetectScroll";
import useDeviceSize from "src/shared/hooks/useDeviceSize";
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { useState } from "react";

export interface PagesMatch {
  isFeaturesPage: boolean;
  isProjectsPage: boolean;
  isPricingPage: boolean;
  isContactPage: boolean;
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
  const { isDesktop } = useDeviceSize();
  const { isScrolledFromTop } = useDetectScroll();

  const {
    store: {
      state: { themeMode, auth },
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
    isFeaturesPage: !!useMatch(routes.features),
    isPricingPage: !!useMatch(routes.pricing),
    isContactPage: !!useMatch(routes.contact),
    isPrivacyPolicy: !!useMatch(routes.privacyPolicy),
    isTermsOfService: !!useMatch(routes.termsAndConditions),
    isProjectsPage: !!useMatch(routes.dashboard.projects.base),
    isDashboardPage: location.pathname.startsWith(routes.dashboard.base),
  };

  const handleSetDrawer = (isOpen: boolean) => () => {
    setIsDrawerOpen(isOpen);
  };

  const handleOnMenuItemClick = (sectionId: string) => () => {
    switch (sectionId) {
      case "features":
        navigate(routes.features);
        break;
      case "pricing":
        navigate(routes.pricing);
        break;
      case "contact":
        navigate(routes.contact);
        break;
      case "install":
        setIsInstallAppDialogOpen(true);
        return;
      case "my-projects":
        auth.user &&
          navigate(routes.dashboard.projects.projectsByUserId(auth.user._id));
        return;
      default:
        scrollToSection(sectionId);
    }
    setIsDrawerOpen(false);
  };

  return (
    <>
      {isAppBarVisible && (
        <AppBar
          position="fixed"
          sx={{
            boxShadow: 0,
            bgcolor: "transparent",
            backgroundImage: "none",
            mt: 1,
          }}
        >
          <Container maxWidth="lg" className="application-bar-container">
            <Toolbar
              variant="regular"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
                backdropFilter: "blur(24px)",
                maxHeight: 40,
                borderColor: "divider",
                boxShadow: isDesktop
                  ? (theme: Theme) =>
                      themeMode === "light"
                        ? `0 0 1px ${theme.palette.primary.light}`
                        : `0 0 1px ${theme.palette.primary.dark}`
                  : undefined,
              }}
            >
              <ApplicationBarDesktopView
                auth={auth}
                pagesMatch={pagesMatch}
                handleToggleLoginModal={handleToggleLoginModal}
                handleToggleRegisterModal={handleToggleRegisterModal}
                setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
                handleOnMenuItemClick={handleOnMenuItemClick}
              />

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
      <CancelSubscriptionModal />
    </>
  );
};

export default ApplicationBar;
