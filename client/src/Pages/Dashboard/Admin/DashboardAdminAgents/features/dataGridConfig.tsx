import { Box, Chip, Typography } from "@mui/material";
import { Agent, AgentStatus } from "src/shared/types/agent";

import DataGridRowActionsMenu from "./dataGridRowActionsMenu";
import { GridColDef } from "@mui/x-data-grid";

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
      headerName: "AGENT",
      editable: false,
      sortable: true,
      minWidth: 220,
      flex: 1,
      description: "Agent information",
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
            display="flex"
            alignItems="center"
            justifyContent="flex-start"
            gap={1.5}
            sx={{ height: "100%" }}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              sx={{ height: "100%" }}
            >
              <Typography variant="body2" fontWeight="medium">
                {agent.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID {displayId}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "ownerName",
      headerName: "OWNER",
      editable: false,
      sortable: true,
      minWidth: 150,
      flex: 1,
      display: "flex",
      description: "Human responsible for this agent",
    },
    {
      field: "userId",
      headerName: "CREATOR",
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: "User who created this agent",
      renderCell: (params) => {
        const uid = params.row.userId;
        const displayUid = uid.length > 8 ? uid.slice(-6).toUpperCase() : uid;
        return (
          <Typography variant="body2" color="text.secondary">
            {displayUid}
          </Typography>
        );
      },
    },
    {
      field: "status",
      headerName: "STATUS",
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      display: "flex",
      description: "Agent status",
      renderCell: (params) => {
        const status = params.row.status;
        const chipColor: Record<string, "default" | "success"> = {
          [AgentStatus.active]: "success",
          [AgentStatus.inactive]: "default",
        };
        return (
          <Chip
            label={status.toUpperCase()}
            color={chipColor[status] ?? "default"}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "createdAt",
      headerName: "CREATED DATE",
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: "Date agent was created",
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
