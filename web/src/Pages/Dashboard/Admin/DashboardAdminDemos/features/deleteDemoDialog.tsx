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
import { useTranslation } from "react-i18next";

const DeleteDemoDialog = ({
  isOpen,
  onClose,
  onConfirm,
  demoLabel,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  demoLabel: string;
}) => {
  const { t } = useTranslation(["dashboard", "common"]);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DeleteOutlined color="error" fontSize="large" />
          <Typography variant="h5">{t("dashboard:admin.demos.deleteDemoTitle")}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">{t("dashboard:admin.demos.deleteDemoConfirm")}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong className="text-underline-secondary">"{demoLabel}"</strong>
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

export default DeleteDemoDialog;
