import { InstallDesktopOutlined } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const InstallWebAppOnWindows: React.FC = () => {
  const { t } = useTranslation("page");

  return (
    <>
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
        }}
      >
        {t("installApp.windowsDescription")}
      </Typography>
      <br />
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
        }}
      >
        {t("installApp.fromBrowser")}
        <span className="bold"> {t("installApp.windowsStep1")} </span>
        {t("installApp.browserWord")}, {t("installApp.windowsFromChrome")} <br />
        {t("installApp.clickIconAndThen")}{" "}
        <InstallDesktopOutlined color="primary" /> {t("installApp.iconAndThen")}{" "}
        <Typography
          variant="button"
          color="primary"
          sx={{
            textTransform: "capitalize",
          }}
        >
          "{t("installApp.windowsButton")}"
        </Typography>
      </Typography>
    </>
  );
};

export default InstallWebAppOnWindows;
