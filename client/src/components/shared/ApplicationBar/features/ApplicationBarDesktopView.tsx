import { Box, Button, Typography } from "@mui/material";
import { LockOpenOutlined, VpnKeyOutlined } from "@mui/icons-material";
import Logo, { LogoComponentEnum } from "../../Logo";

import APP_CONSTANTS from "src/application/shared/app_constants";
import { Authentication } from "src/application/store/state";
import IndustriesDropdown from "src/components/navbar/IndustriesDropdown";
import { PagesMatch } from "../ApplicationBar";
import SettingsMenuButton from "../../SettingsMenuButton";
import { User } from "src/shared/types/user";
import UserAccountMenuButton from "../../UserAccountButton";
import { routes } from "src/application/routes";
import useDeviceSize from "src/shared/hooks/useDeviceSize";

const NAV_LINKS = [
  { id: "industries", label: "Industries", route: null },
  { id: "methodology", label: "Methodology", route: routes.methodology },
  {
    id: "compliance-finma",
    label: "Compliance",
    route: routes.compliance.finma,
  },
  { id: "security", label: "Security", route: routes.security },
  { id: "about", label: "About", route: routes.about },
  { id: "contact", label: "Contact", route: routes.contact },
] as const;

interface ApplicationBarDesktopViewParams {
  auth: Authentication;
  pagesMatch: PagesMatch;
  handleToggleLoginModal: () => void;
  handleToggleRegisterModal: () => void;
  setIsInstallAppDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOnMenuItemClick: (sectionId: string) => void;
}

const ApplicationBarDesktopView = (props: ApplicationBarDesktopViewParams) => {
  const {
    auth,
    handleToggleLoginModal,
    handleToggleRegisterModal,
    setIsInstallAppDialogOpen,
    handleOnMenuItemClick,
  } = props;
  const { isDesktop } = useDeviceSize();

  const buttonHoverStyleSecondary = {
    "&:hover": {
      "& .MuiTypography-root": { color: "primary.main" },
      "& .MuiSvgIcon-root": { color: "primary.main" },
    },
  };

  const handleOnMenuItemClickEvent =
    (sectionId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      handleOnMenuItemClick(sectionId);
    };

  return (
    <>
      {isDesktop && (
        <>
          <Box
            role="menu"
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "space-between",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
              }}
            >
              <Logo variant="small" component={LogoComponentEnum.ANCHOR} />

              {NAV_LINKS.map((item) => {
                if (item.id === "industries") {
                  return <IndustriesDropdown key={item.id} />;
                }

                return (
                  <Button
                    key={item.id}
                    component="a"
                    href={item.route ?? undefined}
                    sx={{ color: "text.primary", fontSize: 14 }}
                    variant="text"
                    onClick={handleOnMenuItemClickEvent(item.id)}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          </Box>

          <Box
            sx={{
              gap: 1,
              alignItems: "center",
              display: { xs: "none", md: "flex" },
            }}
          >
            {auth.isAuthenticated ? (
              <UserAccountMenuButton user={auth.user as User} />
            ) : (
              // Show Login in dev/local/on-prem (users need to log in)
              ((APP_CONSTANTS.IS_DEV ||
                APP_CONSTANTS.IS_LOCAL || APP_CONSTANTS.IS_ON_PREM) && (<Button
                sx={{ ...buttonHoverStyleSecondary }}
                onClick={handleToggleLoginModal}
              >
                <VpnKeyOutlined
                  fontSize="small"
                  color="primary"
                  sx={{ mr: 0.5 }}
                />
                <Typography variant="body2" sx={{
                  color: "text.primary"
                }}>
                  Login
                </Typography>
              </Button>))
            )}

            {/* Show Register only in dev/local (NOT on-prem - admin creates users) */}
            {!auth.isAuthenticated &&
              (APP_CONSTANTS.IS_DEV || APP_CONSTANTS.IS_LOCAL) && (
                <Button
                  sx={{ ...buttonHoverStyleSecondary }}
                  onClick={handleToggleRegisterModal}
                >
                  <LockOpenOutlined
                    fontSize="small"
                    color="primary"
                    sx={{ mr: 0.5 }}
                  />
                  <Typography variant="body2" sx={{
                    color: "text.primary"
                  }}>
                    Register
                  </Typography>
                </Button>
              )}

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              <Button
                component="a"
                href={routes.contact}
                variant="contained"
                size="small"
                onClick={handleOnMenuItemClickEvent("request-evaluation")}
                sx={{ ml: 1 }}
              >
                Request Evaluation
              </Button>
              <Button
                component="a"
                href={routes.demo}
                variant="outlined"
                size="small"
                onClick={handleOnMenuItemClickEvent("demo")}
                sx={{ ml: 1 }}
              >
                Demo
              </Button>
            </Box>

            <SettingsMenuButton
              setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default ApplicationBarDesktopView;
