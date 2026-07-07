import { Box, Container, Divider, Typography } from "@mui/material";

import APP_CONSTANTS from "src/application/shared/app_constants";
import EmailPasswordForm from "src/components/shared/Auth/EmailPasswordForm";
import { LockOutlined } from "@mui/icons-material";
import Page from "src/components/shared/Page/Page";
import PhoneAuth from "src/components/shared/SocialLogins/PhoneAuth";
import SocialRegister from "src/components/Modals/RegisterModal/features/SocialRegister/SocialRegister";
import { routes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  useEffect(() => {
    if (auth?.user?._id) {
      navigate(routes.dashboard.user.profile, { replace: true });
    }
  }, [auth, navigate]);

  if (auth?.user?._id) {
    return null;
  }

  return (
    <Page title="Register | aodit" noIndex>
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
          <LockOutlined color="primary" sx={{ m: 1 }} />

          <Typography component="h1" variant="h5">
            {APP_CONSTANTS.IS_ON_PREM
              ? "Access Restricted"
              : "Create a new account"}
          </Typography>
        </Box>

        {APP_CONSTANTS.IS_ON_PREM ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              maxWidth: 360,
              textAlign: "center"
            }}>
            <Typography variant="body1" sx={{
              color: "text.secondary"
            }}>
              Account creation is managed by your IT administrator.
            </Typography>
            <Typography variant="body2" sx={{
              color: "text.secondary"
            }}>
              Please contact your system administrator to request access.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center"
            }}>
            <SocialRegister authType="register" />
            <PhoneAuth authType="register" />
            <Divider sx={{ width: "100%", maxWidth: 360 }}>or</Divider>
            <EmailPasswordForm mode="register" />
          </Box>
        )}
      </Container>
    </Page>
  );
};

export default RegisterPage;
