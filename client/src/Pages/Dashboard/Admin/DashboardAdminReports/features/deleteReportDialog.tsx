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
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <DeleteOutlined color="error" fontSize="large" />
          <Typography variant="h5">Delete Report</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Are you sure you want to delete the report{" "}
          <strong className="text-underline-secondary">"{reportName}"</strong>?
          <br /> This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="primary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          startIcon={<DeleteOutlined />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteReportDialog;
