import { Box, Button, Drawer, MenuItem, Typography } from "@mui/material";
import {
  LockOpenOutlined,
  MenuOutlined,
  VpnKeyOutlined,
} from "@mui/icons-material";
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
  { id: "home", label: "Home", route: routes.features },
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

interface ApplicationBarMobileViewParams {
  auth: Authentication;
  isDrawerOpen: boolean;
  pagesMatch: PagesMatch;
  isScrolledFromTop: boolean;
  handleSetDrawer: (newState: boolean) => () => void;
  handleToggleLoginModal: () => void;
  handleToggleRegisterModal: () => void;
  setIsInstallAppDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOnMenuItemClick: (sectionId: string) => void;
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

  const handleOnMenuItemClickEvent =
    (sectionId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      handleOnMenuItemClick(sectionId);
    };

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
                {NAV_LINKS.map((item) => (
                  <>
                    {/* TODO: Uncomment this when EU AI Act is live */}
                    {/* {id === "compliance-finma" ? (
                      <MenuItem>
                        <ComplianceDropdown />
                      </MenuItem>
                    ) : ( */}
                    <MenuItem
                      key={item.id}
                      component="a"
                      href={item.route}
                      onClick={handleOnMenuItemClickEvent(item.id)}
                    >
                      <Typography variant="body2" color="text.primary">
                        {item.label}
                      </Typography>
                    </MenuItem>
                    {/* // )} */}
                  </>
                ))}

                <Box sx={{ mt: 2, px: 2 }}>
                  <Button
                    component="a"
                    href={routes.contact}
                    variant="contained"
                    fullWidth
                    onClick={handleOnMenuItemClickEvent("request-evaluation")}
                  >
                    Request Evaluation
                  </Button>
                  <Button
                    component="a"
                    href={routes.demo}
                    variant="outlined"
                    fullWidth
                    onClick={handleOnMenuItemClickEvent("demo")}
                    sx={{ mt: 1 }}
                  >
                    Demo
                  </Button>
                </Box>
              </Box>

              <Box marginBottom="1rem">
                {auth.isAuthenticated ? (
                  <MenuItem>
                    <UserAccountMenuButton user={auth.user as User} />
                  </MenuItem>
                ) : (
                  // Show Login in dev/local/on-prem (users need to log in)
                  (APP_CONSTANTS.IS_DEV || APP_CONSTANTS.IS_LOCAL || APP_CONSTANTS.IS_ON_PREM) && (
                    <MenuItem onClick={handleToggleLoginModal}>
                      <VpnKeyOutlined
                        fontSize="small"
                        color="secondary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body1">Log in</Typography>
                    </MenuItem>
                  )
                )}

                {/* Show Register only in dev/local (NOT on-prem - admin creates users) */}
                {!auth.isAuthenticated && (APP_CONSTANTS.IS_DEV || APP_CONSTANTS.IS_LOCAL) && (
                  <MenuItem onClick={handleToggleRegisterModal}>
                    <LockOpenOutlined
                      fontSize="small"
                      color="secondary"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body1">Register</Typography>
                  </MenuItem>
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
