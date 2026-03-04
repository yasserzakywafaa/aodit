import * as React from "react";

import FullLogo from "src/assets/images/logo_512x512.webp";
import SmallLogo from "src/assets/images/icon_192x192.webp";
import { routes } from "src/application/routes";
import { useNavigate } from "react-router-dom";
import { primaryColor } from "src/application/shared/themes";
import { Box } from "@mui/material";

export interface LogoProps {
  variant?: LogoVariant;
  component?: LogoComponentEnum;
  style?: React.CSSProperties;
  onClick?: () => void;
  /** When true, render text "SWISSLII" (SWISS in gold) instead of image */
  textLogo?: boolean;
}

export enum LogoComponentEnum {
  ANCHOR = "anchor",
  IMAGE = "image",
}

export type LogoVariant = "small" | "full";

const Logo = (props: LogoProps) => {
  const navigate = useNavigate();
  const {
    variant = "full",
    component = LogoComponentEnum.IMAGE,
    style,
    onClick,
    textLogo = false,
  } = props;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (component === LogoComponentEnum.ANCHOR || textLogo) {
      navigate(routes.features);
    }
  };

  if (textLogo) {
    return (
      <Box
        component="a"
        href={routes.features}
        onClick={(e: React.MouseEvent) => {
          e.preventDefault();
          if (onClick) onClick();
          else handleClick();
        }}
        sx={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
          fontWeight: 500,
          letterSpacing: "0.15em",
          color: "var(--white, #f5f3ef)",
          textDecoration: "none",
          cursor: "pointer",
          ...style,
        }}
      >
        <Box component="span" sx={{ color: primaryColor }}>
          SWISS
        </Box>
        LII
      </Box>
    );
  }

  const renderImageByVariant = (variant: LogoVariant) => {
    const logoSrc = variant === "small" ? SmallLogo : FullLogo;
    const defaultStyle: React.CSSProperties = {
      maxWidth: variant === "small" ? "120px" : "200px",
      width: "100%",
      height: "auto",
      objectFit: "contain",
      pointerEvents: "unset",
      margin: 0,
      cursor: component === LogoComponentEnum.ANCHOR ? "pointer" : "default",
      ...style,
    };

    return (
      <img
        src={logoSrc}
        alt="Aodit Logo"
        style={defaultStyle}
        width={style?.width}
        height={style?.height}
        onClick={handleClick}
        aria-label="aodit.ai logo image"
      />
    );
  };

  return renderImageByVariant(variant);
};

export default Logo;
