import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DELETE_ACCOUNT_CONFIRMATION_PHRASE } from "@yasserzakywafaa/client-core";

interface DeleteAccountDialogProps {
  isOpen: boolean;
  isDeleting: boolean;
  impactItems: string[];
  warningMessage?: string;
  onClose: () => void;
  onConfirm: (confirmationPhrase: string) => void;
}

const DeleteAccountDialog = ({
  isOpen,
  isDeleting,
  impactItems,
  warningMessage,
  onClose,
  onConfirm,
}: DeleteAccountDialogProps) => {
  const { t } = useTranslation(["dashboard", "common"]);
  const [hasAcknowledged, setHasAcknowledged] = useState(false);
  const [confirmationPhrase, setConfirmationPhrase] = useState("");

  const isPhraseMatch =
    confirmationPhrase.trim() === DELETE_ACCOUNT_CONFIRMATION_PHRASE;
  const canDelete = hasAcknowledged && isPhraseMatch && !isDeleting;

  const handleClose = () => {
    if (isDeleting) return;
    setHasAcknowledged(false);
    setConfirmationPhrase("");
    onClose();
  };

  const handleConfirm = () => {
    if (!canDelete) return;
    onConfirm(confirmationPhrase.trim());
  };

  return (
    <Dialog
      open={isOpen}
      onClose={(_, reason) => {
        if (reason === "backdropClick" || isDeleting) return;
        handleClose();
      }}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={isDeleting}
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1
          }}>
          <DeleteOutlined color="error" fontSize="large" />
          <Typography variant="h5">{t("dashboard:profile.deleteAccount")}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {t("dashboard:profile.deleteAccountIntro")}
        </Typography>

        <Box component="ul" sx={{ pl: 2, mb: 2 }}>
          {impactItems.map((item) => (
            <Typography component="li" variant="body2" key={item}>
              {item}
            </Typography>
          ))}
        </Box>

        {warningMessage && (
          <Typography
            variant="body2"
            sx={{
              color: "warning.main",
              mb: 2
            }}>
            {warningMessage}
          </Typography>
        )}

        <FormControlLabel
          control={
            <Checkbox
              checked={hasAcknowledged}
              onChange={(event) => setHasAcknowledged(event.target.checked)}
              disabled={isDeleting}
            />
          }
          label={t("dashboard:profile.deleteAcknowledge")}
        />

        <TextField
          fullWidth
          margin="normal"
          label={t("dashboard:profile.typeConfirmationPhrase")}
          value={confirmationPhrase}
          onChange={(event) => setConfirmationPhrase(event.target.value)}
          disabled={isDeleting}
          placeholder={DELETE_ACCOUNT_CONFIRMATION_PHRASE}
          helperText={t("dashboard:profile.typeToConfirm", { phrase: DELETE_ACCOUNT_CONFIRMATION_PHRASE })}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose} disabled={isDeleting}>
          {t("common:cancel")}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={!canDelete}
          startIcon={<DeleteOutlined />}
        >
          {isDeleting ? t("dashboard:profile.deleting") : t("dashboard:profile.deleteAccount")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountDialog;
