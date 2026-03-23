import { useState, type MouseEvent } from "react";
import { ExpandMoreRounded } from "@mui/icons-material";
import { Box, Button, Menu, MenuItem, Stack, Typography } from "@mui/material";
import EuFlag from "src/assets/images/eu_flag.png";
import SwissFlag from "src/assets/images/switzerland_flag.png";

const COMPLIANCE_ITEMS = [
  {
    flag: SwissFlag,
    label: "FINMA AI Guidelines",
    description: "Swiss financial market supervision",
    to: "/compliance/finma",
  },
  {
    flag: EuFlag,
    label: "EU AI Act",
    description: "European AI regulation framework",
    to: "/compliance/eu-ai-act",
  },
] as const;

const ComplianceDropdown = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
        sx={{
          color: "text.primary",
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          textTransform: "none",
        }}
      >
        <Typography variant="button" sx={{ fontWeight: 500 }}>
          Compliance
        </Typography>
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
            <Stack direction="row" spacing={1.5} alignItems="center">
              <img src={item.flag} alt={item.label} width={24} height={24} />
              <Box>
                <Typography
                  className="compliance-item-label"
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: "text.primary",
                    transition: "color 150ms ease",
                  }}
                >
                  {item.label}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.primary" }}>
                  {item.description}
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
