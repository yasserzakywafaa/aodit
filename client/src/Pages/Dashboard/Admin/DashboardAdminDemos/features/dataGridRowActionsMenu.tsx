import { Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { Delete, MoreVert, Visibility } from "@mui/icons-material";

import { DashboardDemosGridFields } from "./dataGridConfig";
import DeleteDemoDialog from "./deleteDemoDialog";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { routes } from "src/application/routes";
import { useDashboardDemosContext } from "../store/Provider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DataGridRowActionsMenu = (params: GridRenderCellParams) => {
  const navigate = useNavigate();
  const {
    manager: { handleDeleteDemo },
  } = useDashboardDemosContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [demoToDelete, setDemoToDelete] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleOnClickView =
    (params: GridRenderCellParams<DashboardDemosGridFields>) => () => {
      navigate(routes.dashboard.admin.demos.demoById(params.row.id));
      handleMenuClose();
    };

  const handleOnClickDelete =
    (params: GridRenderCellParams<DashboardDemosGridFields>) => () => {
      setDemoToDelete({
        id: params.row.id,
        label: params.row.source || params.row.id,
      });
      setIsDeleteDialogOpen(true);
      handleMenuClose();
    };

  const handleConfirmDelete = () => {
    if (demoToDelete) {
      handleDeleteDemo(demoToDelete.id);
      setIsDeleteDialogOpen(false);
      setDemoToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDemoToDelete(null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 1
      }}>
      <IconButton
        size="small"
        color="primary"
        sx={(theme) => ({
          borderRadius: "0px",
          border: `1px solid ${theme.palette.primary.main}`,
        })}
        aria-haspopup="true"
        aria-controls={anchorEl ? "demo-row-actions-menu" : undefined}
        aria-expanded={anchorEl ? "true" : undefined}
        onClick={handleToggleMenu}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="demo-row-actions-menu"
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
        <MenuItem onClick={handleOnClickView(params)}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ fontSize: "14px" }}>
            View
          </Typography>
        </MenuItem>

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
      {demoToDelete && (
        <DeleteDemoDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          demoLabel={demoToDelete.label}
        />
      )}
    </Box>
  );
};

export default DataGridRowActionsMenu;
