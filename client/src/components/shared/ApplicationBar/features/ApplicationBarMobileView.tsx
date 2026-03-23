import { Box, Button, Drawer, MenuItem, Typography } from "@mui/material";
import {
  LockOpenOutlined,
  MenuOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
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

interface ApplicationBarMobileViewParams {
  auth: Authentication;
  isDrawerOpen: boolean;
  pagesMatch: PagesMatch;
  isScrolledFromTop: boolean;
  handleSetDrawer: (newState: boolean) => () => void;
  handleToggleLoginModal: () => void;
  handleToggleRegisterModal: () => void;
  setIsInstallAppDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOnMenuItemClick: (sectionId: string) => () => void;
}

const ApplicationBarMobileView = (props: ApplicationBarMobileViewParams) => {
  const {
    auth,
    isDrawerOpen,
    handleSetDrawer,
    handleToggleLoginModal,
    handleToggleRegisterModal,
    setIsInstallAppDialogOpen,
    handleOnMenuItemClick,
  } = props;
  const { isDesktop, isTablet, isMobile } = useDeviceSize();

  return (
    <>
      {(isTablet || isMobile) && !isDesktop && (
        <Box
          display="flex"
          component="div"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
        >
          <Logo variant="small" component={LogoComponentEnum.ANCHOR} />

          <Button
            variant="text"
            color="primary"
            aria-label="menu"
            onClick={handleSetDrawer(true)}
            sx={{ minWidth: "30px", p: "4px" }}
          >
            <MenuOutlined fontSize="small" />
          </Button>

          <Drawer
            anchor="right"
            open={isDrawerOpen}
            onClose={handleSetDrawer(false)}
          >
            <Box
              role="menu"
              sx={{
                p: 2,
                pt: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1,
                minWidth: "50dvw",
                backgroundColor: "background.default",
              }}
            >
              <Box>
                <MenuItem
                  className="menu-item"
                  onClick={handleOnMenuItemClick("reports")}
                >
                  <Typography variant="body1" color="primary">
                    Reports
                  </Typography>
                </MenuItem>
                {NAV_LINKS.map(({ id, label }) => (
                  <MenuItem
                    key={id}
                    className="menu-item"
                    onClick={handleOnMenuItemClick(id)}
                  >
                    <Typography variant="body1" color="text.primary">
                      {label}
                    </Typography>
                  </MenuItem>
                ))}

                <ComplianceDropdown />

                <MenuItem
                  className="menu-item"
                  onClick={handleOnMenuItemClick("contact")}
                >
                  <Typography variant="body1" color="primary">
                    Get your agent rated
                  </Typography>
                </MenuItem>
              </Box>

              <Box marginBottom="1rem">
                {auth.isAuthenticated ? (
                  <MenuItem>
                    <UserAccountMenuButton user={auth.user as User} />
                  </MenuItem>
                ) : (
                  // TODO: Remove this after going live to PROD
                  (APP_CONSTANTS.IS_DEV || APP_CONSTANTS.IS_LOCAL) && (
                    <>
                      <MenuItem onClick={handleToggleRegisterModal}>
                        <LockOpenOutlined
                          fontSize="small"
                          color="secondary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body1">Register</Typography>
                      </MenuItem>
                      <MenuItem onClick={handleToggleLoginModal}>
                        <VpnKeyOutlined
                          fontSize="small"
                          color="secondary"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body1">Log in</Typography>
                      </MenuItem>
                    </>
                  )
                )}
                <MenuItem>
                  <SettingsMenuButton
                    setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
                  >
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      Settings
                    </Typography>
                  </SettingsMenuButton>
                </MenuItem>
              </Box>
            </Box>
          </Drawer>
        </Box>
      )}
    </>
  );
};

export default ApplicationBarMobileView;
