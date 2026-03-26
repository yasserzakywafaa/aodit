import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Delete, Edit, MoreVert } from "@mui/icons-material";

import { DashboardAgentsGridFields } from "./dataGridConfig";
import DeleteAgentDialog from "./deleteAgentDialog";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { routes } from "src/application/routes";
import { useDashboardAgentsContext } from "../store/Provider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DataGridRowActionsMenu = (params: GridRenderCellParams) => {
  const navigate = useNavigate();
  const {
    manager: { handleDeleteAgent },
  } = useDashboardAgentsContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<{
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
    (params: GridRenderCellParams<DashboardAgentsGridFields>) => () => {
      navigate(routes.dashboard.agents.agentById(params.row.id));
      handleMenuClose();
    };

  const handleOnClickDelete =
    (params: GridRenderCellParams<DashboardAgentsGridFields>) => () => {
      const agent = params.row;
      setAgentToDelete({
        id: agent.id,
        name: agent.name,
      });
      setIsDeleteDialogOpen(true);
      handleMenuClose();
    };

  const handleConfirmDelete = () => {
    if (agentToDelete) {
      handleDeleteAgent(agentToDelete.id);
      setIsDeleteDialogOpen(false);
      setAgentToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setAgentToDelete(null);
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

      {agentToDelete && (
        <DeleteAgentDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          agentName={agentToDelete.name}
        />
      )}
    </Box>
  );
};

export default DataGridRowActionsMenu;
