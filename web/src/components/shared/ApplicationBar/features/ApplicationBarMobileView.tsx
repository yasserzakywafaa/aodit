import {
  Box,
  Button,
  Collapse,
  Drawer,
  MenuItem,
  MenuList,
  Typography,
} from "@mui/material";
import {
  ExpandLessRounded,
  ExpandMoreRounded,
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
import {
  type LandingPageCategoryId,
  getLandingPagesGrouped,
} from "src/application/shared/landingPages";
import { routes, toPublicSegment } from "src/application/routes";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const NAV_LINKS = [
  { id: "home", labelKey: "nav.home", route: routes.features },
  { id: "industries", labelKey: "nav.industries", route: null },
  { id: "methodology", labelKey: "nav.methodology", route: routes.methodology },
  {
    id: "compliance-finma",
    labelKey: "nav.compliance",
    route: routes.compliance.finma,
  },
  { id: "security", labelKey: "nav.security", route: routes.security },
  { id: "about", labelKey: "nav.about", route: routes.about },
  { id: "contact", labelKey: "nav.contact", route: routes.contact },
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
  const { t } = useTranslation("common");
  const [isIndustriesOpen, setIsIndustriesOpen] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] =
    useState<LandingPageCategoryId | null>(null);
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();
  const landingGroups = getLandingPagesGrouped();

  const handleOnMenuItemClickEvent =
    (sectionId: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      handleOnMenuItemClick(sectionId);
    };

  const handleToggleCategory = (categoryId: LandingPageCategoryId) => () => {
    setExpandedCategoryId((current) =>
      current === categoryId ? null : categoryId,
    );
  };

  const handleLandingPageClick =
    (slug: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      setIsIndustriesOpen(false);
      setExpandedCategoryId(null);
      handleSetDrawer(false)();
      navigate(localizedPath(toPublicSegment(slug)));
    };

  const handleViewAllIndustriesClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    setIsIndustriesOpen(false);
    setExpandedCategoryId(null);
    handleSetDrawer(false)();
    navigate(localizedPath(routes.industries));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
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
              <MenuList disablePadding>
                {NAV_LINKS.map((item) => {
                  if (item.id === "industries") {
                    return (
                      <Box key={item.id}>
                        <MenuItem
                          onClick={() => setIsIndustriesOpen((prev) => !prev)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body2" sx={{
                            color: "text.primary"
                          }}>
                            {t(item.labelKey)}
                          </Typography>
                          {isIndustriesOpen ? (
                            <ExpandLessRounded fontSize="small" />
                          ) : (
                            <ExpandMoreRounded fontSize="small" />
                          )}
                        </MenuItem>
                        <Collapse
                          in={isIndustriesOpen}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box sx={{ pl: 1, pb: 0.5 }}>
                            {landingGroups.map((group) => {
                              const isExpanded =
                                expandedCategoryId === group.category.id;
                              return (
                                <Box key={group.category.id}>
                                  <MenuItem
                                    onClick={handleToggleCategory(
                                      group.category.id,
                                    )}
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      py: 0.75,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: "text.primary",
                                        fontSize: 13,
                                        fontWeight: 600
                                      }}>
                                      {group.category.label}
                                    </Typography>
                                    {isExpanded ? (
                                      <ExpandLessRounded fontSize="small" />
                                    ) : (
                                      <ExpandMoreRounded fontSize="small" />
                                    )}
                                  </MenuItem>
                                  <Collapse
                                    in={isExpanded}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <Box sx={{ pl: 1.5, pb: 0.5 }}>
                                      {group.pages.map((page) => (
                                        <MenuItem
                                          key={page.key}
                                          component="a"
                                          href={page.slug}
                                          onClick={handleLandingPageClick(
                                            page.slug,
                                          )}
                                          sx={{ py: 0.5 }}
                                        >
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              color: "text.primary",
                                              fontSize: 12.5
                                            }}>
                                            {page.title}
                                          </Typography>
                                        </MenuItem>
                                      ))}
                                    </Box>
                                  </Collapse>
                                </Box>
                              );
                            })}
                            <Box
                              sx={{
                                mt: 0.5,
                                pt: 0.5,
                                borderTop: "1px solid",
                                borderColor: "divider",
                              }}
                            >
                              <MenuItem
                                component="a"
                                href={localizedPath(routes.industries)}
                                onClick={handleViewAllIndustriesClick}
                                sx={{ py: 0.75 }}
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: "text.primary",
                                    fontSize: 13,
                                    fontWeight: 600
                                  }}>
                                  {t("nav.viewAllIndustries")}
                                </Typography>
                              </MenuItem>
                            </Box>
                          </Box>
                        </Collapse>
                      </Box>
                    );
                  }

                  return (
                    <MenuItem
                      key={item.id}
                      component="a"
                      href={item.route ? localizedPath(item.route) : undefined}
                      onClick={handleOnMenuItemClickEvent(item.id)}
                    >
                      <Typography variant="body2" sx={{
                        color: "text.primary"
                      }}>
                        {t(item.labelKey)}
                      </Typography>
                    </MenuItem>
                  );
                })}

                <Box sx={{ mt: 2, px: 2 }}>
                  <Button
                    component="a"
                    href={localizedPath(routes.contact)}
                    variant="contained"
                    fullWidth
                    onClick={handleOnMenuItemClickEvent("request-evaluation")}
                  >
                    {t("nav.requestEvaluation")}
                  </Button>
                  <Button
                    component="a"
                    href={localizedPath(routes.demo)}
                    variant="outlined"
                    fullWidth
                    onClick={handleOnMenuItemClickEvent("demo")}
                    sx={{ mt: 1 }}
                  >
                    {t("nav.demo")}
                  </Button>
                </Box>
              </MenuList>

              <MenuList disablePadding sx={{ mb: 1 }}>
                {auth.isAuthenticated ? (
                  <Box sx={{ px: 2, py: 1 }}>
                    <UserAccountMenuButton user={auth.user as User} />
                  </Box>
                ) : (
                  // Show Login in dev/local/on-prem (users need to log in)
                  ((APP_CONSTANTS.IS_DEV ||
                    APP_CONSTANTS.IS_LOCAL || APP_CONSTANTS.IS_ON_PREM) && (<MenuItem onClick={handleToggleLoginModal}>
                    <VpnKeyOutlined
                      fontSize="small"
                      color="secondary"
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="body1">{t("nav.login")}</Typography>
                  </MenuItem>))
                )}

                {/* Show Register only in dev/local (NOT on-prem - admin creates users) */}
                {!auth.isAuthenticated &&
                  (APP_CONSTANTS.IS_DEV || APP_CONSTANTS.IS_LOCAL) && (
                    <MenuItem onClick={handleToggleRegisterModal}>
                      <LockOpenOutlined
                        fontSize="small"
                        color="secondary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body1">{t("nav.register")}</Typography>
                    </MenuItem>
                  )}

                <Box sx={{ px: 2, py: 1 }}>
                  <SettingsMenuButton
                    setIsInstallAppDialogOpen={setIsInstallAppDialogOpen}
                  >
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {t("settings.menu")}
                    </Typography>
                  </SettingsMenuButton>
                </Box>
              </MenuList>
            </Box>
          </Drawer>
    </Box>
  );
};

export default ApplicationBarMobileView;
