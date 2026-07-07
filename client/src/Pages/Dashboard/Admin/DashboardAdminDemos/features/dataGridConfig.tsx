import { Box, Chip, Typography } from "@mui/material";
import { DemoSession, DemoStatus } from "src/shared/types/demoSession";

import DataGridRowActionsMenu from "./dataGridRowActionsMenu";
import { GridColDef } from "@mui/x-data-grid";

export interface DashboardDemosGridFields {
  id: string;
  demo: DemoSession;
  source: string;
  sourcePath: string;
  model: string;
  status: DemoStatus;
  score: number | null;
  turns: number;
  date: string;
}

export interface DashboardDemosGridResult {
  rows: DashboardDemosGridFields[];
  columns: GridColDef<DashboardDemosGridFields>[];
}

export const getDemoStatusColor = (status: DemoStatus) => {
  switch (status) {
    case "completed":
      return "success";
    case "running":
    case "pending":
      return "info";
    case "failed":
      return "error";
    case "cancelled":
      return "default";
    default:
      return "default";
  }
};

export const getDashboardDemosDataGridConfig = (
  demos: DemoSession[],
): DashboardDemosGridResult => {
  if (!demos || demos.length === 0) return { rows: [], columns: [] };

  const rows: DashboardDemosGridFields[] = demos.map((demo) => {
    return {
      id: demo._id || "",
      demo,
      source: demo.sourceLabel || "—",
      sourcePath: demo.sourcePath || "",
      model: demo.modelId || "—",
      status: demo.status,
      score: demo.rawScore ?? null,
      turns: demo.turns?.length || 0,
      date: new Date(demo.createdAt || new Date()).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
  });

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: "source",
      headerName: "SOURCE",
      editable: false,
      sortable: true,
      minWidth: 200,
      flex: 1,
      description: "Page/industry where the demo ran",
      renderCell: (params) => (
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
            {params.row.source}
          </Typography>
          {params.row.sourcePath && (
            <Typography variant="caption" sx={{
              color: "text.secondary"
            }}>
              {params.row.sourcePath}
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: "model",
      headerName: "MODEL",
      editable: false,
      sortable: true,
      minWidth: 180,
      flex: 1,
      display: "flex",
      description: "Model under test",
      renderCell: (params) => (
        <Typography variant="body2">{params.row.model}</Typography>
      ),
    },
    {
      field: "status",
      headerName: "STATUS",
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: "Demo run status",
      renderCell: (params) => (
        <Chip
          label={
            params.row.status.charAt(0).toUpperCase() +
            params.row.status.slice(1)
          }
          color={getDemoStatusColor(params.row.status) as any}
          size="small"
        />
      ),
    },
    {
      field: "score",
      headerName: "SCORE",
      editable: false,
      sortable: true,
      minWidth: 90,
      flex: 1,
      display: "flex",
      description: "Raw average score",
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.score !== null ? params.row.score.toFixed(2) : "—"}
        </Typography>
      ),
    },
    {
      field: "turns",
      headerName: "TURNS",
      editable: false,
      sortable: true,
      minWidth: 80,
      flex: 1,
      display: "flex",
      description: "Number of turns completed",
    },
    {
      field: "date",
      headerName: "DATE",
      editable: false,
      sortable: true,
      minWidth: 110,
      flex: 1,
      display: "flex",
      description: "Date the demo ran",
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
