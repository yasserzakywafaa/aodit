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

const DeleteProjectDialog = ({
  isOpen,
  onClose,
  onConfirm,
  projectName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectName: string;
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth={true}>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <DeleteOutlined color="error" fontSize="large" />
          <Typography variant="h5">Delete Project</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          Are you sure you want to delete the project{" "}
          <strong className="text-underline-secondary">"{projectName}"</strong>?
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

export default DeleteProjectDialog;
