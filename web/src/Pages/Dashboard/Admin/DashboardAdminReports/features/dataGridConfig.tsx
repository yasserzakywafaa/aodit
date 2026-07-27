import { Box, Chip, Typography } from "@mui/material";
import { Report, ReportStatus } from "src/shared/types/report";

import DataGridRowActionsMenu from "./dataGridRowActionsMenu";
import { GridColDef } from "@mui/x-data-grid";
import type { TFunction } from "i18next";

export interface DashboardAdminReportsGridFields {
  id: string;
  name: string;
  userId: string;
  evaluationMode: string;
  status: ReportStatus;
  createdAt: string;
}

export interface DashboardAdminReportsGridResult {
  rows: DashboardAdminReportsGridFields[];
  columns: GridColDef<DashboardAdminReportsGridFields>[];
}

export const getDashboardAdminReportsDataGridConfig = (
  reports: Report[],
  t: TFunction<"dashboard">,
): DashboardAdminReportsGridResult => {
  if (!reports || reports.length === 0) return { rows: [], columns: [] };

  const rows: DashboardAdminReportsGridFields[] = reports.map((report) => {
    return {
      id: report._id || "",
      name: report.name || "",
      userId: report.userId || "",
      evaluationMode: report.evaluationMode || "agent",
      status: report.status || ReportStatus.draft,
      createdAt: new Date(report.createdAt || new Date()).toLocaleDateString(
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
      headerName: t("reports.columnReport"),
      editable: false,
      sortable: true,
      minWidth: 220,
      flex: 1,
      description: t("reports.columnReportDescription"),
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
                {t("grid.idLabel")} {displayId}
              </Typography>
            </Box>
          </Box>
        );
      },
    },
    {
      field: "userId",
      headerName: t("reports.columnOwner"),
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: t("reports.columnOwnerDescription"),
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
      field: "evaluationMode",
      headerName: t("reports.columnType"),
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: t("reports.columnTypeDescription"),
      renderCell: (params) => {
        const mode = params.row.evaluationMode;
        return (
          <Chip
            label={mode === "agent" ? t("reports.typeAgentEvaluation") : t("reports.typeBenchmark")}
            color={mode === "agent" ? "primary" : "info"}
            size="small"
            variant="outlined"
          />
        );
      },
    },
    {
      field: "status",
      headerName: t("reports.columnStatus"),
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      display: "flex",
      description: t("reports.columnStatusDescription"),
      renderCell: (params) => {
        const status = params.row.status;
        const chipColor: Record<
          string,
          "default" | "primary" | "success" | "error" | "info"
        > = {
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
      headerName: t("reports.columnCreatedDate"),
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: t("reports.columnCreatedDateDescription"),
    },
    {
      field: "action",
      align: "right",
      type: "actions",
      headerName: t("reports.columnActions"),
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
