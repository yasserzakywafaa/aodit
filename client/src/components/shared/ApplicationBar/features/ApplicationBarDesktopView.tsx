import { Box, Button, MenuItem, Typography } from "@mui/material";
import { LockOpenOutlined, VpnKeyOutlined } from "@mui/icons-material";
import Logo, { LogoComponentEnum } from "../../Logo";

import APP_CONSTANTS from "src/application/shared/app_constants";
import { Authentication } from "src/application/store/state";
import ComplianceDropdown from "src/components/navbar/ComplianceDropdown";
import { PagesMatch } from "../ApplicationBar";
import SettingsMenuButton from "../../SettingsMenuButton";
import { User } from "src/shared/types/user";
import UserAccountMenuButton from "../../UserAccountButton";
import useDeviceSize from "src/shared/hooks/useDeviceSize";

const NAV_LINKS = [
  { id: "reports", label: "Reports" },
  { id: "methodology", label: "Methodology" },
  { id: "about", label: "About" },
] as const;

interface ApplicationBarDesktopViewParams {
  auth: Authentication;
  pagesMatch: PagesMatch;
  handleToggleLoginModal: () => void;
  handleToggleRegisterModal: () => void;
  setIsInstallAppDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOnMenuItemClick: (sectionId: string) => () => void;
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
                gap: 5,
              }}
            >
              <Logo variant="small" component={LogoComponentEnum.ANCHOR} />

              {NAV_LINKS.map(({ id, label }) => (
                <Button
                  key={id}
                  component="a"
                  sx={{ color: "text.primary" }}
                  variant="text"
                  onClick={handleOnMenuItemClick(id)}
                >
                  {label}
                </Button>
              ))}
              <ComplianceDropdown />
              <Button
                component="a"
                variant="contained"
                onClick={handleOnMenuItemClick("contact")}
              >
                Get your agent rated
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              gap: 0.5,
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
