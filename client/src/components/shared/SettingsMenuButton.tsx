import * as React from "react";

import { Box, Divider, ListItemIcon, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import {
  InstallMobileOutlined,
  ModeNightOutlined,
  RefreshOutlined,
  Settings,
  WbSunnyOutlined,
} from "@mui/icons-material";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ThemeColorPicker from "./ThemeColorPicker/ThemeColorPicker";
import { useApplicationContext } from "src/application/store/Provider";
import { useDetectBrowserType } from "src/shared/hooks/useDetectBrowserType";
import { useTheme } from "@mui/material/styles";

export interface SettingsMenuButtonProps {
  children?: JSX.Element;
  setIsInstallAppDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const SettingsMenuButton = (props: SettingsMenuButtonProps) => {
  const {
    store: {
      state: { themeMode },
    },
    manager: { handleToggleThemeMode },
  } = useApplicationContext();
  const { isInStandaloneMode } = useDetectBrowserType();
  const muiTheme = useTheme();
  const [element, setElement] = React.useState<null | HTMLElement>(null);

  const isOpen = Boolean(element);

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setElement(event.currentTarget);
  };

  const handleCloseMenu = () => setElement(null);

  const handleOnInstallClick = () => {
    props.setIsInstallAppDialogOpen(true);
  };

  const handleOnRefreshClick = () => {
    window.location.reload();
  };

  const accentColor = muiTheme.palette.primary.main;

  const buttonHoverStylePrimary = {
    "&:hover": {
      "& .MuiTypography-root": { color: accentColor },
      "& .MuiSvgIcon-root": { color: accentColor },
    },
  };

  return (
    <>
      <Box
        id="settings-button"
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
        aria-controls={isOpen ? "settings-button" : undefined}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleMenuButtonClick}
      >
        <Settings fontSize="medium" color="primary" />

        {props.children}
      </Box>

      <Menu
        open={isOpen}
        anchorEl={element}
        disableScrollLock
        id="settings-menu"
        MenuListProps={{
          "aria-labelledby": "settings-button",
        }}
        variant="menu"
        onClose={handleCloseMenu}
      >
        <MenuItem
          sx={{ ...buttonHoverStylePrimary }}
          onClick={handleToggleThemeMode}
        >
          <ListItemIcon>
            {themeMode === "dark" ? (
              <WbSunnyOutlined
                fontSize="medium"
                color="primary"
                sx={{ mr: 1 }}
              />
            ) : (
              <ModeNightOutlined
                fontSize="medium"
                color="primary"
                sx={{ mr: 1 }}
              />
            )}
          </ListItemIcon>

          <Typography variant="body1">Theme</Typography>
        </MenuItem>

        <Divider sx={{ my: 0.5, opacity: 0.4 }} />

        {/* Accent color picker — no close-on-click so the user can browse colors */}
        <ThemeColorPicker />

        <Divider sx={{ my: 0.5, opacity: 0.4 }} />

        {!isInStandaloneMode && (
          <MenuItem
            sx={{ ...buttonHoverStylePrimary }}
            onClick={handleOnInstallClick}
          >
            <ListItemIcon>
              <InstallMobileOutlined
                fontSize="medium"
                color="primary"
                sx={{ mr: 1 }}
              />
            </ListItemIcon>

            <Typography variant="body1">Install </Typography>
          </MenuItem>
        )}

        <MenuItem
          sx={{ ...buttonHoverStylePrimary }}
          onClick={handleOnRefreshClick}
        >
          <RefreshOutlined fontSize="medium" color="primary" sx={{ mr: 1 }} />
          <Typography variant="body1">Refresh App</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default SettingsMenuButton;
