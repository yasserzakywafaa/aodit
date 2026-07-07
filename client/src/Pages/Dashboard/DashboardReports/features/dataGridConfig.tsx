import { Box, Chip, Typography } from "@mui/material";
import { Report, ReportStatus } from "src/shared/types/report";

import DataGridRowActionsMenu from "./dataGridRowActionsMenu";
import { GridColDef } from "@mui/x-data-grid";

export interface DashboardReportsGridFields {
  id: string;
  name: string;
  createdAt: string;
  status: ReportStatus;
  evaluationMode: string;
}

export interface DashboardReportsGridResult {
  rows: DashboardReportsGridFields[];
  columns: GridColDef<DashboardReportsGridFields>[];
}

export const getDashboardReportsDataGridConfig = (
  reports: Report[],
): DashboardReportsGridResult => {
  if (!reports || reports.length === 0) return { rows: [], columns: [] };

  const rows: DashboardReportsGridFields[] = reports.map((report) => {
    return {
      id: report._id || "",
      name: report.name || "",
      createdAt: new Date(report.createdAt || new Date()).toLocaleDateString(
        "en-GB",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      ),
      status: report.status || ReportStatus.draft,
      evaluationMode: report.evaluationMode || "agent",
    };
  });

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: "id",
      headerName: "REPORT",
      editable: false,
      sortable: true,
      minWidth: 250,
      flex: 1,
      description: "Report information",
      valueGetter: (value, row) => row.name,
      renderCell: (params) => {
        const report = params.row;
        const reportId = report.id || "";
        const displayId =
          reportId.length > 8
            ? `#${reportId.slice(-6).toUpperCase()}`
            : `#${reportId.toUpperCase()}`;

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
                {report.name}
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
      field: "status",
      headerName: "STATUS",
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      display: "flex",
      description: "Report status",
      renderCell: (params) => {
        const status = params.row.status;
        const chipColor: Record<string, "default" | "primary" | "success" | "error" | "info"> = {
          [ReportStatus.draft]: "default",
          [ReportStatus.running]: "primary",
          [ReportStatus.completed]: "success",
          [ReportStatus.failed]: "error",
          [ReportStatus.scheduled]: "info",
          [ReportStatus.active]: "success",
          [ReportStatus.inactive]: "default",
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
      field: "evaluationMode",
      headerName: "TYPE",
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: "Report evaluation type",
      renderCell: (params) => {
        const mode = params.row.evaluationMode;
        return (
          <Chip
            label={mode === "agent" ? "Agent Evaluation" : "Benchmark"}
            color={mode === "agent" ? "primary" : "info"}
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
      description: "Date report was created",
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
