import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  ChevronLeftRounded,
  ChevronRightRounded,
  ExpandMoreRounded,
} from "@mui/icons-material";
import {
  type LandingPageCategoryId,
  getLandingPagesGrouped,
} from "src/application/shared/landingPages";
import { routes } from "src/application/routes";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const IndustriesDropdown = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const groups = getLandingPagesGrouped();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [activeCategoryId, setActiveCategoryId] =
    useState<LandingPageCategoryId | null>(null);

  const isOpen = Boolean(anchorEl);
  const activeGroup = groups.find((g) => g.category.id === activeCategoryId);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveCategoryId(null);
  };

  const handleSelectCategory = (categoryId: LandingPageCategoryId) => () => {
    setActiveCategoryId(categoryId);
  };

  const handleBackToCategories = () => {
    setActiveCategoryId(null);
  };

  const handlePageClick = (slug: string) => () => {
    handleClose();
    navigate(slug);
  };

  const handleViewAllIndustries = () => {
    handleClose();
    navigate(routes.industries);
  };

  return (
    <>
      <Button
        aria-haspopup="menu"
        aria-expanded={isOpen ? "true" : undefined}
        color="inherit"
        variant="text"
        onClick={handleOpen}
        endIcon={
          <ExpandMoreRounded
            sx={{
              transition: "transform 150ms ease",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        }
      >
        {t("nav.industries")}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: { minWidth: 280, maxWidth: 360, mt: 1 } } }}
      >
        {activeGroup
          ? [
              <MenuItem
                key="__back"
                onClick={handleBackToCategories}
                sx={{ py: 1 }}
              >
                <ChevronLeftRounded fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{
                  fontWeight: 600
                }}>
                  {activeGroup.category.label}
                </Typography>
              </MenuItem>,
              <Divider key="__divider" />,
              ...activeGroup.pages.map((page) => (
                <MenuItem
                  key={page.key}
                  onClick={handlePageClick(page.slug)}
                  sx={{ py: 1 }}
                >
                  <Box>
                    <Typography variant="body2" sx={{
                      color: "text.primary"
                    }}>
                      {page.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        fontSize: 11
                      }}>
                      {page.keyword}
                    </Typography>
                  </Box>
                </MenuItem>
              )),
              <Divider key="__view-all-divider" />,
              <MenuItem
                key="__view-all-industries"
                onClick={handleViewAllIndustries}
                sx={{ py: 1, fontWeight: 600 }}
              >
                {t("nav.viewAllIndustries")}
              </MenuItem>,
            ]
          : groups.map(({ category }) => (
              <MenuItem
                key={category.id}
                onClick={handleSelectCategory(category.id)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                  py: 1,
                }}
              >
                <Typography variant="body2" sx={{
                  color: "text.primary"
                }}>
                  {category.label}
                </Typography>
                <ChevronRightRounded fontSize="small" sx={{ opacity: 0.6 }} />
              </MenuItem>
            )).concat([
              <Divider key="__view-all-divider" />,
              <MenuItem
                key="__view-all-industries"
                onClick={handleViewAllIndustries}
                sx={{ py: 1, fontWeight: 600 }}
              >
                {t("nav.viewAllIndustries")}
              </MenuItem>,
            ])}
      </Menu>
    </>
  );
};

export default IndustriesDropdown;
