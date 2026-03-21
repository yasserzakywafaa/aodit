import { AppBar, Container, Toolbar } from "@mui/material";
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
import { useLoginModalContext } from "src/components/Modals/LoginModal/store/Provider";
import { useRegisterModalContext } from "src/components/Modals/RegisterModal/store/Provider";
import { useState } from "react";

export interface PagesMatch {
  isFeaturesPage: boolean;
  isReportsPage: boolean;
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
    isFeaturesPage: !!useMatch(routes.features),
    isPricingPage: !!useMatch(routes.pricing),
    isContactPage: !!useMatch(routes.contact),
    isPrivacyPolicy: !!useMatch(routes.privacyPolicy),
    isTermsOfService: !!useMatch(routes.termsAndConditions),
    isReportsPage: !!useMatch(routes.dashboard.reports.base),
    isDashboardPage: location.pathname.startsWith(routes.dashboard.base),
  };

  const handleSetDrawer = (isOpen: boolean) => () => {
    setIsDrawerOpen(isOpen);
  };

  const handleOnMenuItemClick = (sectionId: string) => () => {
    switch (sectionId) {
      case "reports":
        scrollToSection("ratings");
        break;
      case "ratings":
      case "methodology":
      case "about":
      case "subscribe":
        if (location.pathname === routes.features) {
          scrollToSection(sectionId);
        } else {
          navigate(`${routes.features}#${sectionId}`);
        }
        break;
      case "pricing":
        navigate(routes.pricing);
        break;
      case "contact":
        if (location.pathname === routes.features) {
          scrollToSection("contact");
        } else {
          navigate(`${routes.features}#contact`);
        }
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
        scrollToSection(sectionId);
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
