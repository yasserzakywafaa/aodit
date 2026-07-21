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
import { useTranslation } from "react-i18next";

const NAV_LINKS = [
  { id: "industries", labelKey: "nav.industries", route: null },
  { id: "methodology", labelKey: "nav.methodology", route: routes.methodology },
  {
    id: "compliance-finma",
    labelKey: "nav.compliance",
    route: routes.compliance.finma,
  },
  { id: "security", labelKey: "nav.security", route: routes.security },
  { id: "about", labelKey: "nav.about", route: routes.about },
  { id: "contact", labelKey: "nav.contact", route: routes.contact },
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
  const { t } = useTranslation("common");

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
                    {t(item.labelKey)}
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
                  {t("nav.login")}
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
                    {t("nav.register")}
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
                {t("nav.requestEvaluation")}
              </Button>
              <Button
                component="a"
                href={routes.demo}
                variant="outlined"
                size="small"
                onClick={handleOnMenuItemClickEvent("demo")}
                sx={{ ml: 1 }}
              >
                {t("nav.demo")}
              </Button>
            </Box>

            <SettingsMenuButton
              setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
            />
          </Box>
    </>
  );
};

export default ApplicationBarDesktopView;
