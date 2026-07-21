import { Box, Chip, Typography } from "@mui/material";
import { Agent, AgentStatus } from "src/shared/types/agent";

import DataGridRowActionsMenu from "./dataGridRowActionsMenu";
import { GridColDef } from "@mui/x-data-grid";
import type { TFunction } from "i18next";

export interface DashboardAdminAgentsGridFields {
  id: string;
  name: string;
  ownerName: string;
  userId: string;
  status: AgentStatus;
  createdAt: string;
}

export interface DashboardAdminAgentsGridResult {
  rows: DashboardAdminAgentsGridFields[];
  columns: GridColDef<DashboardAdminAgentsGridFields>[];
}

export const getDashboardAdminAgentsDataGridConfig = (
  agents: Agent[],
  t: TFunction<"dashboard">,
): DashboardAdminAgentsGridResult => {
  if (!agents || agents.length === 0) return { rows: [], columns: [] };

  const rows: DashboardAdminAgentsGridFields[] = agents.map((agent) => {
    return {
      id: agent._id || "",
      name: agent.name || "",
      ownerName: agent.ownerName || "—",
      userId: agent.userId || "",
      status: agent.status || AgentStatus.active,
      createdAt: new Date(agent.createdAt || new Date()).toLocaleDateString(
        "en-GB",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      ),
    };
  });

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: "id",
      headerName: t("agents.columnAgent"),
      editable: false,
      sortable: true,
      minWidth: 220,
      flex: 1,
      description: t("agents.columnAgentDescription"),
      valueGetter: (value, row) => row.name,
      renderCell: (params) => {
        const agent = params.row;
        const agentId = agent.id || "";
        const displayId =
          agentId.length > 8
            ? `#${agentId.slice(-6).toUpperCase()}`
            : `#${agentId.toUpperCase()}`;

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
                flexDirection: "column",
                justifyContent: "center",
                height: "100%"
              }}>
              <Typography variant="body2" sx={{
                fontWeight: "medium"
              }}>
                {agent.name}
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
      field: "ownerName",
      headerName: t("agents.columnOwner"),
      editable: false,
      sortable: true,
      minWidth: 150,
      flex: 1,
      display: "flex",
      description: t("agents.columnOwnerDescription"),
    },
    {
      field: "userId",
      headerName: t("agents.columnOwner"),
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: t("agents.columnOwnerDescription"),
      renderCell: (params) => {
        const uid = params.row.userId;
        const displayUid = uid.length > 8 ? uid.slice(-6).toUpperCase() : uid;
        return (
          <Typography variant="body2" sx={{
            color: "text.secondary"
          }}>
            {displayUid}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: t("agents.columnStatus"),
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      display: "flex",
      description: t("agents.columnStatusDescription"),
      renderCell: (params) => {
        const status = params.row.status;
        const chipColor: Record<string, "default" | "success"> = {
          [AgentStatus.active]: "success",
          [AgentStatus.inactive]: "default",
        };
        return (
          <Chip
            label={t(`status.${status}`, { defaultValue: status.toUpperCase() })}
            color={chipColor[status] ?? "default"}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "createdAt",
      headerName: t("agents.columnCreatedDate"),
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: t("agents.columnCreatedDateDescription"),
    },
    {
      field: "action",
      align: "right",
      type: "actions",
      headerName: t("agents.columnActions"),
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
