import {
  AlternateEmailOutlined,
  AutoFixHighOutlined,
  EarbudsOutlined,
  LockOpenOutlined,
  MenuOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  Drawer,
  MenuItem,
  Typography,
} from "@mui/material";

import { Authentication } from "src/application/store/state";
import Logo from "../../Logo";
import { PagesMatch } from "../ApplicationBar";
import SettingsMenuButton from "../../SettingsMenuButton";
import { User } from "src/shared/types/user";
import UserAccountMenuButton from "../../UserAccountButton";
import { primaryColor } from "src/application/shared/themes";
import useDeviceSize from "src/shared/hooks/useDeviceSize";

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
    pagesMatch,
    isDrawerOpen,
    isScrolledFromTop,
    handleSetDrawer,
    handleToggleLoginModal,
    handleToggleRegisterModal,
    setIsInstallAppDialogOpen,
    handleOnMenuItemClick,
  } = props;
  const { isDesktop, isTablet, isMobile } = useDeviceSize();

  return (
    <>
      {/* Mobile */}
      {(isTablet || isMobile) && !isDesktop && (
        <Box
          display="flex"
          component="div"
          flexDirection="row"
          justifyContent={"space-between"}
          alignItems="center"
          width="100%"
        >
          {pagesMatch.isFeaturesPage ? (
            !isScrolledFromTop ? (
              <Logo
                style={{
                  width: "50px",
                  height: "50px",
                }}
              />
            ) : (
              <Button
                size="medium"
                color="primary"
                variant="contained"
                onClick={handleOnMenuItemClick("create")}
              >
                Create Project
              </Button>
            )
          ) : (
            <Button
              size="medium"
              color="primary"
              variant="contained"
              onClick={handleOnMenuItemClick("create")}
            >
              Create Project
            </Button>
          )}

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
                p: 1,
                pt: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexGrow: 1,
                minWidth: "50dvw",
                backgroundColor: "background.paper",
              }}
            >
              <Box>
                <MenuItem
                  className={`menu-item`}
                  onClick={handleOnMenuItemClick("features")}
                >
                  <EarbudsOutlined
                    fontSize="small"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    variant="body1"
                    color={
                      pagesMatch.isFeaturesPage ? primaryColor : "text.primary"
                    }
                  >
                    Features
                  </Typography>
                </MenuItem>

                <MenuItem
                  className={`menu-item`}
                  onClick={handleOnMenuItemClick("create")}
                >
                  <AutoFixHighOutlined
                    fontSize="small"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body1">Create Project</Typography>
                </MenuItem>

                {/* <Divider
                  orientation="horizontal"
                  flexItem
                  sx={{ my: 1, width: "30%", mx: "2rem" }}
                />

                <MenuItem
                  className={`menu-item`}
                  onClick={handleOnMenuItemClick("pricing")}
                >
                  <AttachMoneyOutlined
                    fontSize="small"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    variant="body1"
                    color={
                      pagesMatch.isPricingPage ? primaryColor : "text.primary"
                    }
                  >
                    Pricing
                  </Typography>
                </MenuItem> */}

                <Divider
                  orientation="horizontal"
                  flexItem
                  sx={{ my: 1, width: "30%", mx: "2rem" }}
                />

                <MenuItem
                  className={`menu-item`}
                  onClick={handleOnMenuItemClick("contact")}
                >
                  <AlternateEmailOutlined
                    fontSize="small"
                    color="primary"
                    sx={{ mr: 1 }}
                  />
                  <Typography
                    variant="body1"
                    color={
                      pagesMatch.isContactPage ? primaryColor : "text.primary"
                    }
                  >
                    Contact Us
                  </Typography>
                </MenuItem>
              </Box>

              <Box marginBottom="1rem">
                {auth.isAuthenticated ? (
                  <MenuItem>
                    <UserAccountMenuButton user={auth.user as User} />
                  </MenuItem>
                ) : (
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
