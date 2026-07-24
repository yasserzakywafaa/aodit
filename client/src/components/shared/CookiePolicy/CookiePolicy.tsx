import { Box, Button, Link as MuiLink, Paper, Snackbar, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { useState } from "react";
import APP_CONSTANTS from "src/application/shared/app_constants";
import { routes } from "src/application/routes";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";

const CONSENT_KEY = APP_CONSTANTS.LOCAL_STORAGE.COOKIE_CONSENT;

const CookiePolicy = () => {
  const { t } = useTranslation("common");
  const localizedPath = useLocalizedPath();
  const [visible, setVisible] = useState(
    () => !localStorage.getItem(CONSENT_KEY),
  );

  const handleAcknowledge = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  return (
    <Snackbar
      open={visible}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={{ maxWidth: { xs: "100%", sm: 480 } }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 2,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <Box
          component="span"
          sx={{
            zIndex: 1,
            opacity: 0.25,
            top: "-2.5rem",
            right: "-5rem",
            fontSize: "11rem",
            position: "absolute",
            pointerEvents: "none",
          }}
        >
          🍪
        </Box>

        <Typography variant="body2" sx={{ position: "relative", zIndex: 2 }}>
          <Trans
            t={t}
            i18nKey="cookiePolicy.message"
            components={{
              privacyLink: (
                <MuiLink href={localizedPath(routes.privacyPolicy)} underline="hover" />
              ),
            }}
          />
        </Typography>

        <Box
          sx={{
            mt: 2,
            position: "relative",
            zIndex: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAcknowledge}
          >
            {t("cookiePolicy.ok")}
          </Button>
        </Box>
      </Paper>
    </Snackbar>
  );
};

export default CookiePolicy;
