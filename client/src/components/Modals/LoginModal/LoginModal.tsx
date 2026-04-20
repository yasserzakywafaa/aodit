import { Box, Button, Divider, Typography } from "@mui/material";
import { Close, LockOpenOutlined } from "@mui/icons-material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import APP_CONSTANTS from "src/application/shared/app_constants";
import EmailPasswordForm from "src/components/shared/Auth/EmailPasswordForm";
import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";
import { LoaderVariantEnum } from "src/shared/types/types";
import PhoneAuth from "src/components/shared/SocialLogins/PhoneAuth";
import SocialLogin from "./features/SocialLogin/SocialLogin";
import { useLoginModalContext } from "./store/Provider";

export const LoginModal = () => {
  const {
    store: { state, handleIsFetching, handleToggleLoginModal },
  } = useLoginModalContext();

  const onCloseModal = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason && reason === "backdropClick") return;

    handleCloseModal();
  };

  const handleCloseModal = () => {
    handleIsFetching(false);
    handleToggleLoginModal();
  };

  return (
    <>
      <Dialog
        maxWidth="sm"
        scroll="body"
        fullWidth={true}
        open={state.isVisible}
        onClose={onCloseModal}
      >
        <DialogContent sx={{ position: "relative" }}>
          {state.isFetching && (
            <LoaderSpinner variant={LoaderVariantEnum.Dots} />
          )}

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

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              width: "100%",
            }}
            className="login-form-wrapper"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="stretch"
              justifyContent="center"
              gap={2}
              sx={{ mt: 4 }}
              className="social-login-wrapper"
            >
              {/* Hide social logins in on-prem mode (air-gapped) */}
              {!APP_CONSTANTS.IS_ON_PREM && (
                <>
                  <SocialLogin authType="login" />
                  <PhoneAuth authType="login" onAuthSuccess={handleCloseModal} />
                  <Divider sx={{ width: "100%", maxWidth: 360 }}>or</Divider>
                </>
              )}
              <EmailPasswordForm mode="login" />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            size="small"
            type="button"
            color="primary"
            aria-label="close"
            variant="contained"
            startIcon={<Close />}
            onClick={handleCloseModal}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
