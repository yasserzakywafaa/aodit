import { useState, type MouseEvent } from "react";
import { ExpandMoreRounded } from "@mui/icons-material";
import { Box, Button, Menu, MenuItem, Stack, Typography } from "@mui/material";
import SwissFlag from "src/assets/images/switzerland_flag.png";
import { routes } from "src/application/routes";
import { getEffectiveRegion } from "src/application/shared/regionContent";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const COMPLIANCE_ITEMS = [
  {
    flag: SwissFlag,
    labelKey: "compliance.finmaLabel",
    descriptionKey: "compliance.finmaDescription",
    to: routes.compliance.finma,
  },
] as const;

const ComplianceDropdown = () => {
  const { t } = useTranslation("common");
  const location = useLocation();
  const region = getEffectiveRegion(location.pathname, location.search);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  if (region === "global") {
    return null;
  }

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = () => {
    handleClose();
  };

  return (
    <>
      <Button
        aria-controls={open ? "compliance-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="menu"
        onClick={handleOpen}
        color="inherit"
        variant="text"
        sx={{ padding: 0 }}
      >
        <Typography variant="body2">{t("nav.compliance")}</Typography>
        <ExpandMoreRounded
          sx={{
            transition: "transform 150ms ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </Button>
      <Menu
        id="compliance-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        keepMounted
      >
        {COMPLIANCE_ITEMS.map((item, index) => (
          <MenuItem
            key={item.to}
            component="a"
            href={item.to}
            divider={index < COMPLIANCE_ITEMS.length - 1}
            onClick={handleItemClick}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{
                alignItems: "center",
              }}
            >
              <img
                src={item.flag}
                alt={t(item.labelKey)}
                width={24}
                height={24}
              />
              <Box>
                <Typography
                  className="compliance-item-label"
                  variant="body2"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    transition: "color 150ms ease",
                  }}
                >
                  {t(item.labelKey)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.primary",
                  }}
                >
                  {t(item.descriptionKey)}
                </Typography>
              </Box>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ComplianceDropdown;
