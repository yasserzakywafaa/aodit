import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Delete, Edit, MoreVert } from "@mui/icons-material";

import { DashboardAdminReportsGridFields } from "./dataGridConfig";
import DeleteReportDialog from "./deleteReportDialog";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { routes } from "src/application/routes";
import { useDashboardAdminReportsContext } from "../store/Provider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DataGridRowActionsMenu = (params: GridRenderCellParams) => {
  const navigate = useNavigate();
  const {
    manager: { handleDeleteReport },
  } = useDashboardAdminReportsContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleOnClickViewEdit =
    (params: GridRenderCellParams<DashboardAdminReportsGridFields>) => () => {
      navigate(routes.dashboard.reports.reportById(params.row.id));
      handleMenuClose();
    };

  const handleOnClickDelete =
    (params: GridRenderCellParams<DashboardAdminReportsGridFields>) => () => {
      const report = params.row;
      setReportToDelete({
        id: report.id,
        name: report.name,
      });
      setIsDeleteDialogOpen(true);
      handleMenuClose();
    };

  const handleConfirmDelete = () => {
    if (reportToDelete) {
      handleDeleteReport(reportToDelete.id);
      setIsDeleteDialogOpen(false);
      setReportToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setReportToDelete(null);
  };

  return (
    <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
      <IconButton
        size="small"
        color="primary"
        sx={(theme) => ({
          borderRadius: "0px",
          border: `1px solid ${theme.palette.primary.main}`,
        })}
        aria-haspopup="true"
        aria-controls={anchorEl ? "row-actions-menu" : undefined}
        aria-expanded={anchorEl ? "true" : undefined}
        onClick={handleToggleMenu}
      >
        <MoreVert />
      </IconButton>

      <Menu
        id="row-actions-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleToggleMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleOnClickViewEdit(params)}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontSize: "14px" }}>
            View/Edit
          </Typography>
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        <MenuItem
          onClick={handleOnClickDelete(params)}
          sx={{ color: "error.main" }}
        >
          <Delete fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontSize: "14px" }}>
            Delete
          </Typography>
        </MenuItem>
      </Menu>

      {reportToDelete && (
        <DeleteReportDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          reportName={reportToDelete.name}
        />
      )}
    </Box>
  );
};

export default DataGridRowActionsMenu;
