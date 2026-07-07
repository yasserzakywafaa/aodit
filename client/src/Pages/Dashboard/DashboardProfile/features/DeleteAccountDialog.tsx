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
import { DELETE_ACCOUNT_CONFIRMATION_PHRASE } from "src/shared/utils/deleteAccount";

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
          <Typography variant="h5">Delete Account</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          This will permanently delete your account and remove all associated
          data, including:
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
          label="I understand this action is permanent and cannot be undone"
        />

        <TextField
          fullWidth
          margin="normal"
          label="Type the confirmation phrase"
          value={confirmationPhrase}
          onChange={(event) => setConfirmationPhrase(event.target.value)}
          disabled={isDeleting}
          placeholder={DELETE_ACCOUNT_CONFIRMATION_PHRASE}
          helperText={`Type "${DELETE_ACCOUNT_CONFIRMATION_PHRASE}" to confirm`}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleConfirm}
          disabled={!canDelete}
          startIcon={<DeleteOutlined />}
        >
          {isDeleting ? "Deleting..." : "Delete Account"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAccountDialog;
