import * as React from "react";

import { Box, ListItemIcon, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import {
  InstallMobileOutlined,
  ModeNightOutlined,
  RefreshOutlined,
  Settings,
  WbSunnyOutlined,
} from "@mui/icons-material";

import { LanguageSwitcher } from "@yasserzakywafaa/client-core/web/i18n";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { SupportedLang } from "@yasserzakywafaa/client-core";
import { useApplicationContext } from "src/application/store/Provider";
import { useDetectBrowserType } from "@yasserzakywafaa/client-core/web";
import { useLocaleContext } from "@yasserzakywafaa/client-core/web/i18n";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export interface SettingsMenuButtonProps {
  children?: JSX.Element;
  setIsInstallAppDialogOpen: Dispatch<SetStateAction<boolean>>;
}

const SettingsMenuButton = (props: SettingsMenuButtonProps) => {
  const { t } = useTranslation("common");
  const {
    store: {
      state: { themeMode, auth },
    },
    manager: { handleToggleThemeMode, handleUpdateUserInfoInApplication },
  } = useApplicationContext();
  const { isInStandaloneMode } = useDetectBrowserType();
  const { changeLocale } = useLocaleContext();
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

  const handleOnLanguageChange = async (lang: SupportedLang) => {
    changeLocale(lang);
    const user = auth.user;
    if (user) {
      await handleUpdateUserInfoInApplication({
        preferences: { ...user.preferences, languagePreference: lang },
      });
    }
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
        slotProps={{
          list: {
            "aria-labelledby": "settings-button",
          },
        }}
        variant="menu"
        onClose={handleCloseMenu}
      >
        <LanguageSwitcher
          styles={{ ...buttonHoverStylePrimary }}
          onLanguageChange={handleOnLanguageChange}
        />

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

          <Typography variant="body1">{t("settings.theme")}</Typography>
        </MenuItem>

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

            <Typography variant="body1">{t("settings.install")}</Typography>
          </MenuItem>
        )}

        <MenuItem
          sx={{ ...buttonHoverStylePrimary }}
          onClick={handleOnRefreshClick}
        >
          <RefreshOutlined fontSize="medium" color="primary" sx={{ mr: 1 }} />
          <Typography variant="body1">{t("settings.refreshApp")}</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default SettingsMenuButton;
