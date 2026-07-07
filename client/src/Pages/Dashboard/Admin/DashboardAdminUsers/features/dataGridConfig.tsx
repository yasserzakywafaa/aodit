import {
  AuthProviderEnum,
  User,
  UserRole,
  UserStatus,
} from "src/shared/types/user";
import { Box, Chip, Typography } from "@mui/material";

import DataGridRowActionsMenu from "./dataGridRowActionsMenu";
import { GridColDef } from "@mui/x-data-grid";
import ProfileAvatar from "src/components/shared/ProfileAvatar";

export interface DashboardUsersGridFields {
  id: string;
  user: User;
  email: string;
  type: UserRole;
  source?: AuthProviderEnum;
  projects: number;
  joinDate: string;
  status: UserStatus;
}

export interface DashboardUsersGridResult {
  rows: DashboardUsersGridFields[];
  columns: GridColDef<DashboardUsersGridFields>[];
}

export const getUserTypeColor = (role: UserRole) => {
  switch (role) {
    case UserRole.super_admin:
    case UserRole.admin:
      return "warning";
    case UserRole.user:
      return "info";
    default:
      return "default";
  }
};

export const getUserTypeLabel = (role: UserRole) => {
  switch (role) {
    case UserRole.super_admin:
      return "Super Admin";
    case UserRole.admin:
      return "Admin";
    case UserRole.user:
      return "Regular";
    default:
      return role;
  }
};

export const getUserStatusColor = (status: UserStatus) => {
  switch (status) {
    case UserStatus.active:
      return "success";
    case UserStatus.inactive:
      return "default";
    case UserStatus.suspended:
      return "error";
    case UserStatus.blocked:
      return "error";
    default:
      return "default";
  }
};

export const getAuthSourceLabel = (provider?: AuthProviderEnum): string => {
  switch (provider) {
    case AuthProviderEnum.google:
      return "Google";
    case AuthProviderEnum.linkedin:
      return "LinkedIn";
    case AuthProviderEnum.phone:
      return "Phone";
    case AuthProviderEnum.email:
      return "Email";
    default:
      return "—";
  }
};

export const getDashboardUsersDataGridConfig = (
  users: User[],
): DashboardUsersGridResult => {
  if (!users || users.length === 0) return { rows: [], columns: [] };

  const rows: DashboardUsersGridFields[] = users.map((user) => {
    return {
      id: user._id || "",
      user: user,
      email: user.email || "",
      type: user.role || UserRole.user,
      source: user.provider,
      projects: user.reportsCount || 0,
      joinDate: new Date(user.createdAt || new Date()).toLocaleDateString(
        "en-GB",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      ),
      status: user.status || UserStatus.inactive,
    };
  });

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: "user",
      headerName: "USER",
      editable: false,
      sortable: true,
      minWidth: 200,
      flex: 1,
      description: "User information",
      valueGetter: (value, row) => {
        const { givenName = "", familyName = "" } = row.user.name;
        return `${givenName} ${familyName}`.trim();
      },
      renderCell: (params) => {
        const user = params.row.user;
        const userId = user.userId || user._id || "";
        const displayId =
          userId.length > 8
            ? `#${userId.slice(-6).toUpperCase()}`
            : `#${userId.toUpperCase()}`;

        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1.5,
              height: "100%"
            }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
              <ProfileAvatar
                user={user}
                avatarSize={{ width: 32, height: 32 }}
                verifiedBadgeSize={12}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%"
              }}>
              <Typography variant="body2" sx={{
                fontWeight: "medium"
              }}>
                {user.name.givenName} {user.name.familyName}
              </Typography>
              <Typography variant="caption" sx={{
                color: "text.secondary"
              }}>
                ID {displayId}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "email",
      headerName: "EMAIL",
      editable: false,
      sortable: true,
      minWidth: 220,
      flex: 1,
      display: "flex",
      description: "User email address",
      renderCell: (params) => (
        <Typography variant="body2">{params.row.email}</Typography>
      ),
    },
    {
      field: "type",
      headerName: "TYPE",
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      display: "flex",
      description: "User account type",
      renderCell: (params) => (
        <Chip
          label={getUserTypeLabel(params.row.type)}
          color={getUserTypeColor(params.row.type) as any}
          size="small"
        />
      ),
    },
    {
      field: "source",
      headerName: "SOURCE",
      editable: false,
      sortable: true,
      minWidth: 110,
      flex: 1,
      display: "flex",
      description: "Authentication source",
      renderCell: (params) => (
        <Chip
          label={getAuthSourceLabel(params.row.source)}
          color={params.row.source ? "primary" : "default"}
          size="small"
          variant={params.row.source ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: "projects",
      headerName: "PROJECTS",
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      display: "flex",
      description: "Number of projects",
    },
    {
      field: "joinDate",
      headerName: "JOIN DATE",
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      display: "flex",
      description: "Date user joined",
    },
    {
      field: "status",
      headerName: "STATUS",
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: "User account status",
      renderCell: (params) => (
        <Chip
          label={
            params.row.status.charAt(0).toUpperCase() +
            params.row.status.slice(1)
          }
          color={getUserStatusColor(params.row.status) as any}
          size="small"
        />
      ),
    },
    {
      field: "action",
      align: "right",
      type: "actions",
      headerName: "ACTIONS",
      headerAlign: "right",
      flex: 1,
      minWidth: 100,
      editable: false,
      sortable: false,
      resizable: false,
      renderCell: (params) => <DataGridRowActionsMenu {...params} />,
    },
  ];

  return {
    rows,
    columns,
  };
};
