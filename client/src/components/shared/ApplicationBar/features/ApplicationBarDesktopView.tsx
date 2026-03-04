import {
  AutoFixHighOutlined,
  LockOpenOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
import { Box, MenuItem, Typography } from "@mui/material";
import {
  primaryColor,
  secondaryColorForDarkTheme,
} from "src/application/shared/themes";

import { Authentication } from "src/application/store/state";
import Logo from "../../Logo";
import { PagesMatch } from "../ApplicationBar";
import SettingsMenuButton from "../../SettingsMenuButton";
import { User } from "src/shared/types/user";
import UserAccountMenuButton from "../../UserAccountButton";
import useDeviceSize from "src/shared/hooks/useDeviceSize";

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

  const buttonHoverStylePrimary = {
    "&:hover": {
      "& .MuiTypography-root": {
        color: secondaryColorForDarkTheme,
      },
      "& .MuiSvgIcon-root": {
        color: secondaryColorForDarkTheme,
      },
    },
  };

  const buttonHoverStyleSecondary = {
    "&:hover": {
      "& .MuiTypography-root": {
        color: primaryColor,
      },
      "& .MuiSvgIcon-root": {
        color: primaryColor,
      },
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
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <MenuItem
                className={`menu-item`}
                sx={{ ...buttonHoverStylePrimary }}
                onClick={handleOnMenuItemClick("features")}
              >
                <Logo
                  style={{
                    width: "50px",
                    height: "50px",
                  }}
                />
              </MenuItem>

              <MenuItem
                className={`menu-item`}
                sx={{
                  py: "6px",
                  px: "6px",
                  ...buttonHoverStylePrimary,
                }}
                onClick={handleOnMenuItemClick("create")}
              >
                <AutoFixHighOutlined
                  fontSize="small"
                  color="primary"
                  sx={{ mr: 0.5 }}
                />
                <Typography variant="body2">Create Project</Typography>
              </MenuItem>

              {/* <MenuItem
                className={`menu-item`}
                sx={{
                  py: "6px",
                  px: "12px",
                  "&:hover": {
                    "& .MuiTypography-root": {
                      color: secondaryColor,
                    },
                    "& .MuiSvgIcon-root": {
                      color: secondaryColor,
                    },
                  },
                }}
                onClick={handleOnMenuItemClick("pricing")}
              >
                <AttachMoneyOutlined
                  fontSize="small"
                  color="primary"
                  sx={{ mr: 0.5 }}
                />

                <Typography
                  variant="body2"
                  color={
                    pagesMatch.isPricingPage ? primaryColor : "text.primary"
                  }
                >
                  Pricing
                </Typography>
              </MenuItem> */}
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
              <>
                <MenuItem
                  sx={{ ...buttonHoverStyleSecondary }}
                  onClick={handleToggleRegisterModal}
                >
                  <LockOpenOutlined
                    fontSize="small"
                    color="secondary"
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
                    color="secondary"
                    sx={{ mr: 0.5 }}
                  />

                  <Typography variant="body2" color="text.primary">
                    Login
                  </Typography>
                </MenuItem>
              </>
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
