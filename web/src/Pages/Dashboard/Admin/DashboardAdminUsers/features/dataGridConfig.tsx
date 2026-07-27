import {
  AuthProviderEnum,
  User,
  UserRole,
  UserStatus,
} from "src/shared/types/user";
import { Box, Chip, Typography } from "@mui/material";

import DataGridRowActionsMenu from "./dataGridRowActionsMenu";
import { GridColDef } from "@mui/x-data-grid";
import type { TFunction } from "i18next";
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

export const getUserTypeLabel = (role: UserRole, t: TFunction<"dashboard">) => {
  switch (role) {
    case UserRole.super_admin:
      return t("admin.users.roleSuperAdmin");
    case UserRole.admin:
      return t("admin.users.roleAdmin");
    case UserRole.user:
      return t("admin.users.roleRegular");
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

export const getAuthSourceLabel = (provider: AuthProviderEnum | undefined, t: TFunction<"dashboard">): string => {
  switch (provider) {
    case AuthProviderEnum.google:
      return t("admin.users.sourceGoogle");
    case AuthProviderEnum.linkedin:
      return t("admin.users.sourceLinkedIn");
    case AuthProviderEnum.phone:
      return t("admin.users.sourcePhone");
    case AuthProviderEnum.email:
      return t("admin.users.sourceEmail");
    default:
      return "—";
  }
};

export const getDashboardUsersDataGridConfig = (
  users: User[],
  t: TFunction<"dashboard">,
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
      headerName: t("admin.users.columnUser"),
      editable: false,
      sortable: true,
      minWidth: 200,
      flex: 1,
      description: t("admin.users.columnUserDescription"),
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
                {t("grid.idLabel")} {displayId}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "email",
      headerName: t("admin.users.columnEmail"),
      editable: false,
      sortable: true,
      minWidth: 220,
      flex: 1,
      display: "flex",
      description: t("admin.users.columnEmailDescription"),
      renderCell: (params) => (
        <Typography variant="body2">{params.row.email}</Typography>
      ),
    },
    {
      field: "type",
      headerName: t("admin.users.columnType"),
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      display: "flex",
      description: t("admin.users.columnTypeDescription"),
      renderCell: (params) => (
        <Chip
          label={getUserTypeLabel(params.row.type, t)}
          color={getUserTypeColor(params.row.type) as any}
          size="small"
        />
      ),
    },
    {
      field: "source",
      headerName: t("admin.users.columnSource"),
      editable: false,
      sortable: true,
      minWidth: 110,
      flex: 1,
      display: "flex",
      description: t("admin.users.columnSourceDescription"),
      renderCell: (params) => (
        <Chip
          label={getAuthSourceLabel(params.row.source, t)}
          color={params.row.source ? "primary" : "default"}
          size="small"
          variant={params.row.source ? "filled" : "outlined"}
        />
      ),
    },
    {
      field: "projects",
      headerName: t("admin.users.columnProjects"),
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      display: "flex",
      description: t("admin.users.columnProjectsDescription"),
    },
    {
      field: "joinDate",
      headerName: t("admin.users.columnJoinDate"),
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      display: "flex",
      description: t("admin.users.columnJoinDateDescription"),
    },
    {
      field: "status",
      headerName: t("admin.users.columnStatus"),
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: t("admin.users.columnStatusDescription"),
      renderCell: (params) => (
        <Chip
          label={
            t(`admin.users.statusValues.${params.row.status}`, { defaultValue: params.row.status })
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
      headerName: t("admin.users.columnActions"),
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
