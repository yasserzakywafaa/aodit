import { IosShareOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const InstallWebAppOnMacOs: React.FC = () => {
  const { t } = useTranslation("page");

  return (
    <>
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
        }}
      >
        {t("installApp.macDescription")}
      </Typography>
      <br />
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
        }}
      >
        {t("installApp.fromBrowser")}
        <span className="bold"> {t("installApp.macStep1")} </span>
        {t("installApp.browserWord")}, <br />
        {t("installApp.tapIconAndThen")}{" "}
        <IosShareOutlined color="primary" /> {t("installApp.iconAndThen")}
        <br />
        <Typography
          variant="button"
          color="primary"
          sx={{
            textTransform: "capitalize",
          }}
        >
          "{t("installApp.macStep2")}"
        </Typography>
      </Typography>
    </>
  );
};

export default InstallWebAppOnMacOs;
