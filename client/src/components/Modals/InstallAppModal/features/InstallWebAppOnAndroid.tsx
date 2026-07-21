import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

type UserChoice = Promise<{
  outcome: "accepted" | "dismissed";
  platform: string;
}>;

const InstallWebAppOnAndroid: React.FC = () => {
  const { t } = useTranslation("page");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const beforeInstallPromptHandler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);

    window.addEventListener("appinstalled", () => {
      console.log("INSTALL: Success");
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallPromptHandler,
      );
      window.removeEventListener("appinstalled", () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();

      const userChoice = (await deferredPrompt.userChoice) as UserChoice;
      const outcome = (await userChoice).outcome;

      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  console.log({
    showInstallPrompt,
    handleInstallClick,
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          mb: 2,
        }}
      >
        {t("installApp.androidDescription")}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleInstallClick}>
        {t("installApp.androidButton")}
      </Button>
    </Box>
  );
};

export default InstallWebAppOnAndroid;
