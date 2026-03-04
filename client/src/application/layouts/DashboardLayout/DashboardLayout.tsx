import "./DashboardLayout.scss";

import {
  AdminPanelSettings,
  Article as ArticleIcon,
  Dashboard as DashboardIcon,
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Fragment, useState } from "react";
import Logo, { LogoComponentEnum } from "src/components/shared/Logo";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import DashboardBreadcrumbs from "./features/DashboardBreadcrumbs/DashboardBreadcrumbs";
import { InstallAppModal } from "src/components/Modals/InstallAppModal/InstallAppModal";
import { Notification } from "src/components/shared/Notification/Notification";
import SettingsMenuButton from "src/components/shared/SettingsMenuButton";
import UserAccountMenuButton from "src/components/shared/UserAccountButton";
import { UserRole } from "src/shared/types/user";
import { hasAdminRights } from "src/shared/utils/getUserRoles";
import { routes } from "../../../application/routes";
import { useApplicationContext } from "../../../application/store/Provider";

const DRAWER_WIDTH = 240;
const APP_BAR_HEIGHT = 64; // Material-UI default Toolbar height

interface DashboardMenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  hide?: boolean;
  disabled?: boolean;
  subItems?: DashboardMenuItem[];
  requiresRole?: UserRole;
}

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isInstallAppDialogOpen, setIsInstallAppDialogOpen] = useState(false);
  const [openMenuItem, setOpenMenuItem] = useState<string | null>(() => {
    // Check if current pathname matches any admin subitem paths
    const adminSubPaths = [
      routes.dashboard.admin.users.base,
      routes.dashboard.admin.projects.base,
    ];

    const isOnAdminSubPage = adminSubPaths.some((subPath) =>
      location.pathname.includes(subPath),
    );

    return isOnAdminSubPage ? routes.dashboard.admin.base : null;
  });

  const {
    store: { state },
  } = useApplicationContext();

  const { auth } = state;
  const user = auth.user;

  const menuItems: DashboardMenuItem[] = [
    {
      label: "Overview",
      path: routes.dashboard.base,
      icon: <DashboardIcon />,
    },
    {
      label: "Projects",
      path: routes.dashboard.projects.base,
      icon: <ArticleIcon />,
    },
    {
      label: "Admin",
      path: routes.dashboard.admin.base,
      icon: <AdminPanelSettings />,
      requiresRole: UserRole.admin,
      subItems: [
        {
          label: "Users",
          path: routes.dashboard.admin.users.base,
          icon: <PeopleIcon />,
        },
        {
          label: "Projects",
          path: routes.dashboard.admin.projects.base,
          icon: <ArticleIcon />,
        },
      ],
    },
  ];
  const isAdmin = hasAdminRights(user);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (item: DashboardMenuItem) => {
    if (item.subItems) {
      // If the item has sub-items, toggle its open state
      setOpenMenuItem((prevOpenMenuItem) =>
        prevOpenMenuItem === item.path ? null : item.path,
      );
    } else {
      // If the item does not have sub-items, navigate to its path
      setMobileOpen(false);
      navigate(item.path);
    }
  };

  const drawer = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <Toolbar
        className="dashboard-sidebar-toolbar"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          minHeight: "64px !important",
          "& .MuiDrawer-paper": {
            "&.MuiDrawer-root": {
              backgroundColor: "transparent",
            },
          },
        }}
      >
        <Logo component={LogoComponentEnum.ANCHOR} style={{ width: "70%" }} />
      </Toolbar>

      <List sx={{ flexGrow: 1 }} disablePadding>
        {menuItems.map((item) => {
          if (item.hide) {
            return null;
          }
          const isActive =
            item.path === routes.dashboard.base
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);
          const isAdminItem = item.requiresRole === UserRole.admin;
          return !isAdminItem || isAdmin ? (
            <Fragment key={item.path}>
              <ListItem disablePadding>
                <ListItemButton
                  disabled={item.disabled}
                  selected={isActive}
                  onClick={() => handleMenuItemClick(item)}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      "& .MuiListItemIcon-root": {
                        color: "primary.contrastText",
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "primary.contrastText" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText primary={item.label} />

                  {item.subItems &&
                    (openMenuItem ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </ListItem>
              {item.subItems && (
                <Collapse
                  in={openMenuItem === item.path}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" dense>
                    {item.subItems?.map((subItem) => {
                      return (
                        <ListItem key={subItem.path}>
                          <ListItemButton
                            disabled={subItem.disabled}
                            selected={location.pathname.includes(subItem.path)}
                            onClick={() => handleMenuItemClick(subItem)}
                          >
                            <ListItemIcon>{subItem.icon}</ListItemIcon>
                            <ListItemText primary={subItem.label} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Fragment>
          ) : null;
        })}
      </List>

      <Box>
        <Divider orientation="horizontal" flexItem sx={{ my: 1, mx: "1rem" }} />

        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            my: { xs: 3, sm: 2 },
          }}
        >
          {user && (
            <>
              <UserAccountMenuButton user={user} />
              <SettingsMenuButton
                setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );

  if (!auth.isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "background.default",
          zIndex: -2,
        }}
      />

      <Box sx={{ display: "flex", minHeight: "100vh", position: "relative" }}>
        {/* AppBar for mobile */}
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            ml: { md: `${DRAWER_WIDTH}px` },
            backgroundColor: "background.default",
            color: "text.primary",
          }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
              <DashboardBreadcrumbs />
            </Box>

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Sidebar Drawer */}
        <Box
          component="nav"
          sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        >
          {/* Mobile drawer */}
          <Drawer
            anchor="right"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
              },
            }}
          >
            {drawer}
          </Drawer>

          {/* Desktop drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                width: DRAWER_WIDTH,
                backgroundColor: "transparent",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* Main content */}
        <Box
          className="dashboard-main"
          component="main"
          sx={{
            alignSelf: "end",
            flexGrow: 1,
            p: 3,
            width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
            mt: { xs: `${APP_BAR_HEIGHT}px`, md: 0 },
            height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
          }}
        >
          <Notification />
          <Outlet />
        </Box>

        <InstallAppModal
          isInstallAppDialogOpen={isInstallAppDialogOpen}
          setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
        />
      </Box>
    </>
  );
};

export default DashboardLayout;
