import * as React from "react";

import AoditLogo from "src/assets/images/aodit_logo.webp";
import { routes } from "src/application/routes";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useLocation, useNavigate } from "react-router-dom";

export interface LogoProps {
  variant?: LogoVariant;
  component?: LogoComponentEnum;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export enum LogoComponentEnum {
  ANCHOR = "anchor",
  IMAGE = "image",
}

export type LogoVariant = "small" | "full";

const Logo = (props: LogoProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const localizedPath = useLocalizedPath();
  const {
    variant = "full",
    component = LogoComponentEnum.IMAGE,
    style,
    onClick,
  } = props;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (component === LogoComponentEnum.ANCHOR) {
      navigate(
        location.pathname === routes.featuresCh
          ? routes.featuresCh
          : localizedPath(routes.features),
      );
    }
  };

  const renderImageByVariant = (variant: LogoVariant) => {
    const logoSrc = variant === "small" ? AoditLogo : AoditLogo;
    const defaultStyle: React.CSSProperties = {
      maxWidth: variant === "small" ? "40px" : "100px",
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
