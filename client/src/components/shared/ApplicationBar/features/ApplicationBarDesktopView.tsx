import { Box, Link, MenuItem, Typography } from "@mui/material";
import { LockOpenOutlined, VpnKeyOutlined } from "@mui/icons-material";

import { Authentication } from "src/application/store/state";
import Logo from "../../Logo";
import { PagesMatch } from "../ApplicationBar";
import SettingsMenuButton from "../../SettingsMenuButton";
import { User } from "src/shared/types/user";
import UserAccountMenuButton from "../../UserAccountButton";
import { primaryColor } from "src/application/shared/themes";
import useDeviceSize from "src/shared/hooks/useDeviceSize";

const NAV_LINKS = [
  { id: "ratings", label: "Ratings" },
  { id: "methodology", label: "Methodology" },
  { id: "about", label: "About" },
  { id: "subscribe", label: "Subscribe" },
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
      "& .MuiTypography-root": { color: primaryColor },
      "& .MuiSvgIcon-root": { color: primaryColor },
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
              <Logo textLogo onClick={handleOnMenuItemClick("features")} />

              {NAV_LINKS.map(({ id, label }) => (
                <Link
                  key={id}
                  component="button"
                  variant="body2"
                  onClick={handleOnMenuItemClick(id)}
                >
                  {label}
                </Link>
              ))}
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
