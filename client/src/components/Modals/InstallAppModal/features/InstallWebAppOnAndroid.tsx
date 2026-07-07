import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";

type UserChoice = Promise<{
  outcome: "accepted" | "dismissed";
  platform: string;
}>;

const InstallWebAppOnAndroid: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const beforeInstallPromptHandler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install banner
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstallPromptHandler);

    // Listen for the appinstalled event
    window.addEventListener("appinstalled", () => {
      console.log("INSTALL: Success");
    });

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        beforeInstallPromptHandler
      );
      window.removeEventListener("appinstalled", () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt

      const userChoice = (await deferredPrompt.userChoice) as UserChoice;
      const outcome = (await userChoice).outcome;

      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      setDeferredPrompt(null); // Clear the saved prompt
      setShowInstallPrompt(false); // Hide the install banner
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
        alignItems: "center"
      }}>
      <Typography
        variant="body1"
        sx={{
          textAlign: "center",
          mb: 2
        }}>
        Install this app on your device and enjoy the native application
        functionality
      </Typography>
      <Button variant="contained" color="primary" onClick={handleInstallClick}>
        Install App
      </Button>
    </Box>
  );
};

export default InstallWebAppOnAndroid;
