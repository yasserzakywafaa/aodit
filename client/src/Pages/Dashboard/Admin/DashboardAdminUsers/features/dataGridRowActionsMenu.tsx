import { Block, Delete, Edit, LockOpen, MoreVert } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import { DashboardUsersGridFields } from "./dataGridConfig";
import DeleteUserDialog from "./deleteUserDialog";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { UserStatus } from "src/shared/types/user";
import { routes } from "src/application/routes";
import { useDashboardUsersContext } from "../store/Provider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const DataGridRowActionsMenu = (params: GridRenderCellParams) => {
  const navigate = useNavigate();
  const {
    manager: { handleBlockUser, handleUnblockUser, handleDeleteUser },
  } = useDashboardUsersContext();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{
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
    (params: GridRenderCellParams<DashboardUsersGridFields>) => () => {
      navigate(routes.dashboard.user.userById(params.row.id));
      handleMenuClose();
    };

  const handleOnClickBlock =
    (params: GridRenderCellParams<DashboardUsersGridFields>) => () => {
      handleBlockUser(params.row.id);
      handleMenuClose();
    };

  const handleOnClickUnblock =
    (params: GridRenderCellParams<DashboardUsersGridFields>) => () => {
      handleUnblockUser(params.row.id);
      handleMenuClose();
    };

  const isUserBlocked = (status: UserStatus) => {
    return status === UserStatus.blocked || status === UserStatus.suspended;
  };

  const handleOnClickDelete =
    (params: GridRenderCellParams<DashboardUsersGridFields>) => () => {
      const user = params.row.user;
      setUserToDelete({
        id: params.row.id,
        name: `${user.name.givenName} ${user.name.familyName}`,
      });
      setIsDeleteDialogOpen(true);
      handleMenuClose();
    };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete.id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
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

        {isUserBlocked(params.row.status) ? (
          <MenuItem onClick={handleOnClickUnblock(params)}>
            <LockOpen fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              Unblock
            </Typography>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleOnClickBlock(params)}>
            <Block fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2" sx={{ fontSize: "14px" }}>
              Block
            </Typography>
          </MenuItem>
        )}

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
      {userToDelete && (
        <DeleteUserDialog
          isOpen={isDeleteDialogOpen}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleConfirmDelete}
          userName={userToDelete.name}
        />
      )}
    </Box>
  );
};

export default DataGridRowActionsMenu;
