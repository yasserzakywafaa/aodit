import { Box, Container, Divider, Typography } from "@mui/material";

import APP_CONSTANTS from "src/application/shared/app_constants";
import EmailPasswordForm from "src/components/shared/Auth/EmailPasswordForm";
import { LockOpenOutlined } from "@mui/icons-material";
import Page from "src/components/shared/Page/Page";
import PhoneAuth from "src/components/shared/SocialLogins/PhoneAuth";
import SocialLogin from "src/components/Modals/LoginModal/features/SocialLogin/SocialLogin";
import { routes } from "src/application/routes";
import { useAppConfig } from "src/application/context/AppConfigContext";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isOnPrem } = useAppConfig();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  useEffect(() => {
    // Check BOTH localStorage AND context to be safe
    const isAuthenticated = localStorage.getItem(
      APP_CONSTANTS.LOCAL_STORAGE.AUTHENTICATED,
    );
    const hasUserInStorage = localStorage.getItem(
      APP_CONSTANTS.LOCAL_STORAGE.USER,
    );

    // Only redirect if BOTH localStorage says authenticated AND user exists in context
    if (
      isAuthenticated === "true" &&
      hasUserInStorage !== "null" &&
      auth?.user?._id
    ) {
      navigate(routes.dashboard.user.profile, { replace: true });
    }
  }, [auth, navigate]);

  // Check localStorage before rendering to prevent flash
  const isAuthenticated = localStorage.getItem(
    APP_CONSTANTS.LOCAL_STORAGE.AUTHENTICATED,
  );
  const hasUserInStorage = localStorage.getItem(
    APP_CONSTANTS.LOCAL_STORAGE.USER,
  );

  if (
    isAuthenticated === "true" &&
    hasUserInStorage !== "null" &&
    auth?.user?._id
  ) {
    return null;
  }

  return (
    <Page title="Login | aodit">
      <Container
        sx={{
          display: "flex",
          flexDirection: " column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          gap: { xs: 4, sm: 6 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <LockOpenOutlined color="primary" sx={{ m: 1 }} />

          <Typography component="h1" variant="h5">
            Login to your account
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" gap={2} alignItems="center">
          <EmailPasswordForm mode="login" />
          {!isOnPrem && (
            <>
              <Divider sx={{ width: "100%", maxWidth: 360 }}>or</Divider>
              <SocialLogin authType="login" />
              <PhoneAuth authType="login" />
            </>
          )}
        </Box>
      </Container>
    </Page>
  );
};

export default LoginPage;
