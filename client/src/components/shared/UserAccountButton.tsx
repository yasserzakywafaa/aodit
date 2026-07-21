import * as React from "react";

import { Box, Divider, ListItemIcon, Typography } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  LogoutOutlined,
  PersonOutlined,
} from "@mui/icons-material";

import END_POINTS from "src/application/shared/endpoints";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Notify } from "./Notification/Notification";
import ProfileAvatar from "./ProfileAvatar";
import { User } from "src/shared/types/user";
import axios from "axios";
import { routes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface UserAccountMenuButtonProps {
  user: User;
}

const UserAccountMenuButton = (props: UserAccountMenuButtonProps) => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const {
    manager: { handleSetAuthInfo },
  } = useApplicationContext();

  const { user } = props;
  const [element, setElement] = React.useState<null | HTMLElement>(null);
  const isDashboardPage = location.pathname.includes(routes.dashboard.base);

  if (!user) return;

  const userFullName = `${user.name.givenName} ${user.name.familyName.charAt(
    0,
  )}.`;

  const isOpen = Boolean(element);

  const handleMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setElement(event.currentTarget);
  };

  const handleCloseMenu = () => setElement(null);

  const handleOnProfileClick = () => {
    navigate(routes.dashboard.profile);
    handleCloseMenu();
  };

  const handleOnDashboardClick = () => {
    navigate(routes.dashboard.base);
    handleCloseMenu();
  };

  const handleOnLogoutClick = async () => {
    await axios.post(
      END_POINTS.AUTH.LOGOUT,
      {
        method: "POST",
      },
      {
        withCredentials: true,
      },
    );

    handleSetAuthInfo({
      isAuthenticated: false,
      user: null,
    });
    Notify({
      type: "info",
      content: t("loggedOut"),
    });

    navigate(routes.features);
  };

  const buttonHoverStylePrimary = {
    "&:hover": {
      "& .MuiTypography-root": {
        color: "primary.main",
      },
      "& .MuiSvgIcon-root": {
        color: "primary.main",
      },
    },
  };

  return (
    <>
      <Box
        id="user-account-button"
        aria-haspopup="true"
        aria-expanded={isOpen ? "true" : undefined}
        aria-controls={isOpen ? "user-account-menu" : undefined}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={handleMenuButtonClick}
      >
        <ProfileAvatar
          user={user}
          avatarSize={{ width: 25, height: 25 }}
          verifiedBadgeSize={14}
        />

        <Typography
          variant="body1"
          sx={{
            color: "text.primary",
            marginLeft: 1,
            maxWidth: "100px",
            overflowX: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",

            "&.MuiTypography-root:hover": {
              color: "primary.main",
            }
          }}>
          {userFullName}
        </Typography>
      </Box>
      <Menu
        open={isOpen}
        anchorEl={element}
        disableScrollLock
        id="user-account-menu"
        MenuListProps={{
          "aria-labelledby": "user-account-button",
        }}
        variant="menu"
        onClose={handleCloseMenu}
      >
        <MenuItem
          sx={{ ...buttonHoverStylePrimary }}
          onClick={handleOnProfileClick}
        >
          <ListItemIcon>
            <PersonOutlined fontSize="medium" color="primary" sx={{ mr: 1 }} />
          </ListItemIcon>
          <Typography variant="body1" sx={{
            color: "text.primary"
          }}>
            {t("settings.profile")}
          </Typography>
        </MenuItem>

        {!isDashboardPage && (
          <>
            <Divider />

            <MenuItem
              sx={{ ...buttonHoverStylePrimary }}
              onClick={handleOnDashboardClick}
            >
              <ListItemIcon>
                <DashboardIcon
                  fontSize="medium"
                  color="primary"
                  sx={{ mr: 1 }}
                />
              </ListItemIcon>
              <Typography variant="body1">{t("settings.dashboard")}</Typography>
            </MenuItem>
          </>
        )}

        {user && (
          <>
            <Divider />

            <MenuItem
              sx={{ ...buttonHoverStylePrimary }}
              onClick={handleOnLogoutClick}
            >
              <ListItemIcon>
                <LogoutOutlined
                  fontSize="medium"
                  color="error"
                  sx={{ mr: 1 }}
                />
              </ListItemIcon>

              <Typography variant="body1" color="error">
                {t("settings.logout")}
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default UserAccountMenuButton;
