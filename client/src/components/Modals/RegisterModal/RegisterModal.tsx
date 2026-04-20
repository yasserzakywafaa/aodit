import { Box, Button, Divider, Typography } from "@mui/material";
import { Close, LockOutlined } from "@mui/icons-material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import APP_CONSTANTS from "src/application/shared/app_constants";
import EmailPasswordForm from "src/components/shared/Auth/EmailPasswordForm";
import LoaderSpinner from "src/components/shared/Loader/LoaderSpinner";
import { LoaderVariantEnum } from "src/shared/types/types";
import PhoneAuth from "src/components/shared/SocialLogins/PhoneAuth";
import SocialRegister from "./features/SocialRegister/SocialRegister";
import { useRegisterModalContext } from "./store/Provider";

export const RegisterModal = () => {
  const {
    store: { state, handleIsFetching, handleToggleRegisterModal },
  } = useRegisterModalContext();

  const onCloseModal = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason && reason === "backdropClick") return;

    handleCloseModal();
  };

  const handleCloseModal = () => {
    handleIsFetching(false);
    handleToggleRegisterModal();
  };

  // In on-prem mode, show Access Restricted
  if (APP_CONSTANTS.IS_ON_PREM) {
    return (
      <Dialog
        maxWidth="sm"
        scroll="body"
        fullWidth={true}
        open={state.isVisible}
        onClose={onCloseModal}
      >
        <DialogContent sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              py: 4,
              textAlign: "center",
            }}
          >
            <LockOutlined color="primary" sx={{ m: 1 }} />
            <Typography component="h1" variant="h5">
              Access Restricted
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Account creation is managed by your IT administrator.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please contact your system administrator to request access.
            </Typography>
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
    );
  }

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
            <LockOutlined color="primary" sx={{ m: 1 }} />
            <Typography component="h1" variant="h5">
              Create a new account
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
            className="register-form-wrapper"
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
              <SocialRegister authType="register" />
              <PhoneAuth authType="register" onAuthSuccess={handleCloseModal} />
              <Divider sx={{ width: "100%", maxWidth: 360 }}>or</Divider>
              <EmailPasswordForm mode="register" />
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
