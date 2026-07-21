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
import { useTranslation } from "react-i18next";

export const RegisterModal = () => {
  const { t } = useTranslation(["auth", "common"]);
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
              {t("auth:accessRestricted")}
            </Typography>
            <Typography variant="body1" sx={{
              color: "text.secondary"
            }}>
              {t("auth:accessRestrictedBody")}
            </Typography>
            <Typography variant="body2" sx={{
              color: "text.secondary"
            }}>
              {t("auth:contactAdmin")}
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
            {t("common:close")}
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
              {t("auth:modalRegisterHeading")}
            </Typography>
          </Box>
          <Box
            className="register-form-wrapper"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%"
            }}>
            <Box
              className="social-login-wrapper"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                justifyContent: "center",
                gap: 2,
                mt: 4
              }}>
              <SocialRegister authType="register" />
              <PhoneAuth authType="register" onAuthSuccess={handleCloseModal} />
              <Divider sx={{ width: "100%", maxWidth: 360 }}>
                {t("common:or")}
              </Divider>
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
            {t("common:close")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
