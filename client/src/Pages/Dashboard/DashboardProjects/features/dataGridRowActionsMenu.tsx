import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Delete, Edit, MoreVert } from "@mui/icons-material";

import { DashboardProjectsGridFields } from "./dataGridConfig";
import DeleteProjectDialog from "./deleteProjectDialog";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { routes } from "src/application/routes";
import { secondaryColor } from "src/application/shared/themes";
import { useDashboardProjectsContext } from "../store/Provider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DataGridRowActionsMenu = (params: GridRenderCellParams) => {
  const navigate = useNavigate();
  const {
    manager: { handleDeleteProject },
  } = useDashboardProjectsContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<{
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
    (params: GridRenderCellParams<DashboardProjectsGridFields>) => () => {
      navigate(routes.dashboard.projects.projectById(params.row.id));
      handleMenuClose();
    };

  const handleOnClickDelete =
    (params: GridRenderCellParams<DashboardProjectsGridFields>) => () => {
      const project = params.row;
      setProjectToDelete({
        id: project.id,
        name: project.name,
      });
      setIsDeleteDialogOpen(true);
      handleMenuClose();
    };

  const handleConfirmDelete = () => {
    if (projectToDelete) {
      handleDeleteProject(projectToDelete.id);
      setIsDeleteDialogOpen(false);
      setProjectToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  return (
    <Box display="flex" justifyContent="flex-end" alignItems="center" gap={1}>
      <IconButton
        size="small"
        color="secondary"
        sx={{
          borderRadius: "0px",
          border: `1px solid ${secondaryColor}`,
        }}
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

      {projectToDelete && (
        <DeleteProjectDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          projectName={projectToDelete.name}
        />
      )}
    </Box>
  );
};

export default DataGridRowActionsMenu;
