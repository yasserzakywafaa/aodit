import { IosShareOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const InstallWebAppOnIos: React.FC = () => {
  const { t } = useTranslation("page");

  return (
    <>
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
        }}
      >
        {t("installApp.iosDescription")}
      </Typography>
      <br />
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
        }}
      >
        {t("installApp.fromBrowser")}
        <span className="bold"> {t("installApp.iosStep1")} </span>
        {t("installApp.browserWord")}, <br />
        {t("installApp.tapIconAndThen")}{" "}
        <IosShareOutlined color="primary" /> {t("installApp.iconAndThen")}
        <Typography variant="body1" color="primary">
          "{t("installApp.iosStep2")}"
        </Typography>
      </Typography>
    </>
  );
};

export default InstallWebAppOnIos;
