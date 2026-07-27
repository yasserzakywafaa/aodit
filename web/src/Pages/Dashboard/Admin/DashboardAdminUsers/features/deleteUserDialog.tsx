import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { DeleteOutlined } from "@mui/icons-material";
import { Trans, useTranslation } from "react-i18next";

const DeleteUserDialog = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
}) => {
  const { t } = useTranslation(["dashboard", "common"]);
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1
          }}>
          <DeleteOutlined color="error" fontSize="large" />
<Typography variant="h5">{t("dashboard:admin.users.deleteUserTitle")}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
<Trans i18nKey="admin.users.deleteUserConfirm" ns="dashboard" values={{ name: userName }} components={{ strong: <strong className="text-underline-secondary" /> }} />
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={onClose}>
          {t("common:cancel")}
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          startIcon={<DeleteOutlined />}
        >
          {t("common:delete")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserDialog;

