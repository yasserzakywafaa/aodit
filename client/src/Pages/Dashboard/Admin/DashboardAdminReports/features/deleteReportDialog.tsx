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

const DeleteReportDialog = ({
  isOpen,
  onClose,
  onConfirm,
  reportName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reportName: string;
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
          <Typography variant="h5">{t("dashboard:reports.deleteReportTitle")}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          <Trans
            i18nKey="reports.deleteReportConfirm"
            ns="dashboard"
            values={{ name: reportName }}
            components={{ strong: <strong className="text-underline-secondary" /> }}
          />
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

export default DeleteReportDialog;
