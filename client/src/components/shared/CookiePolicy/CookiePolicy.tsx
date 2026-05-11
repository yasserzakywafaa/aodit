import { Box, Button, Paper, Snackbar, Typography } from "@mui/material";

import APP_CONSTANTS from "src/application/shared/app_constants";
import { Link as MuiLink } from "@mui/material";
import { routes } from "src/application/routes";
import { useState } from "react";

const CONSENT_KEY = APP_CONSTANTS.LOCAL_STORAGE.COOKIE_CONSENT;

const CookiePolicy = () => {
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
          backgroundColor: "red !important",
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
          By continuing to use this website, you agree to our use of cookies to
          improve your experience and analyze site traffic. See our{" "}
          <MuiLink href={routes.privacyPolicy} underline="hover">
            Privacy Policy
          </MuiLink>{" "}
          for more information.
        </Typography>

        <Box mt={2} sx={{ position: "relative", zIndex: 2 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleAcknowledge}
          >
            OK
          </Button>
        </Box>
      </Paper>
    </Snackbar>
  );
};

export default CookiePolicy;
