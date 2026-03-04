import "./LoaderSpinner.scss";

import { LoaderSizeEnum, LoaderVariantEnum } from "src/shared/types/types";

import { CircularProgress } from "@mui/material";

interface LoaderSpinnerProps {
  style?: React.CSSProperties;
  position?: "absolute" | "fixed" | "relative";
  variant?: LoaderVariantEnum;
  size?: LoaderSizeEnum;
}

const LoaderSpinner = (props: LoaderSpinnerProps) => {
  const {
    style,
    position,
    variant = LoaderVariantEnum.Dots,
    size = LoaderSizeEnum.Medium,
  } = props;

  const getSize = () => {
    switch (size) {
      case LoaderSizeEnum.Small:
        return "5px";
      case LoaderSizeEnum.Medium:
        return "10px";
      case LoaderSizeEnum.Large:
        return "20px";
      default:
        return "10px";
    }
  };

  const renderLoader = () => {
    switch (variant) {
      case LoaderVariantEnum.Dots:
        return (
          <div
            style={{
              ...style,
              position,
            }}
            className={`loader-spinner-dots ${
              position === "absolute" ? "absolute" : ""
            }`}
          >
            <span style={{ width: getSize(), height: getSize() }}></span>
            <span style={{ width: getSize(), height: getSize() }}></span>
            <span style={{ width: getSize(), height: getSize() }}></span>
          </div>
        );
      default:
        return (
          <div
            style={{
              ...style,
              position,
            }}
            className="loader-spinner-wrapper flex justify--center align--center"
          >
            <CircularProgress color="primary" />
          </div>
        );
    }
  };

  return renderLoader();
};

export default LoaderSpinner;
