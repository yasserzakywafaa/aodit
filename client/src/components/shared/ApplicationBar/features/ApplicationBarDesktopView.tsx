import { Box, Button, MenuItem, Typography } from "@mui/material";
import { LockOpenOutlined, VpnKeyOutlined } from "@mui/icons-material";
import Logo, { LogoComponentEnum } from "../../Logo";

import APP_CONSTANTS from "src/application/shared/app_constants";
import { Authentication } from "src/application/store/state";
import { PagesMatch } from "../ApplicationBar";
import SettingsMenuButton from "../../SettingsMenuButton";
import { User } from "src/shared/types/user";
import UserAccountMenuButton from "../../UserAccountButton";
import { routes } from "src/application/routes";
import useDeviceSize from "src/shared/hooks/useDeviceSize";

const NAV_LINKS = [
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
  const { isTablet } = useDeviceSize();

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
      {!isTablet && (
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
                gap: 4,
              }}
            >
              <Logo variant="small" component={LogoComponentEnum.ANCHOR} />

              {NAV_LINKS.map((item) => (
                <>
                  {/* TODO: Uncomment this when EU AI Act is live */}
                  {/* {id === "compliance-finma" ? (
                    <ComplianceDropdown />
                  ) : ( */}
                  <Button
                    key={item.id}
                    component="a"
                    href={item.route}
                    sx={{ color: "text.primary", fontSize: 14 }}
                    variant="text"
                    onClick={handleOnMenuItemClickEvent(item.id)}
                  >
                    {item.label}
                  </Button>
                  {/* // )} */}
                </>
              ))}
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
              // TODO: Remove this after going live to PROD
              (APP_CONSTANTS.IS_DEV || APP_CONSTANTS.IS_LOCAL) && (
                <>
                  <MenuItem
                    sx={{ ...buttonHoverStyleSecondary }}
                    onClick={handleToggleRegisterModal}
                  >
                    <LockOpenOutlined
                      fontSize="small"
                      color="primary"
                      sx={{ mr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.primary">
                      Register
                    </Typography>
                  </MenuItem>

                  <MenuItem
                    sx={{ ...buttonHoverStyleSecondary }}
                    onClick={handleToggleLoginModal}
                  >
                    <VpnKeyOutlined
                      fontSize="small"
                      color="primary"
                      sx={{ mr: 0.5 }}
                    />
                    <Typography variant="body2" color="text.primary">
                      Login
                    </Typography>
                  </MenuItem>
                </>
              )
            )}

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

            <MenuItem sx={{ ...buttonHoverStyleSecondary }}>
              <SettingsMenuButton
                setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
              />
            </MenuItem>
          </Box>
        </>
      )}
    </>
  );
};

export default ApplicationBarDesktopView;
