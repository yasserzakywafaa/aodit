import { Box, Chip, Typography } from "@mui/material";
import { Project, ProjectStatus } from "src/shared/types/project";

import DataGridRowActionsMenu from "./dataGridRowActionsMenu";
import { GridColDef } from "@mui/x-data-grid";

export interface DashboardProjectsGridFields {
  id: string;
  name: string;
  createdAt: string;
  status: ProjectStatus;
}

export interface DashboardProjectsGridResult {
  rows: DashboardProjectsGridFields[];
  columns: GridColDef<DashboardProjectsGridFields>[];
}

export const getDashboardProjectsDataGridConfig = (
  projects: Project[],
): DashboardProjectsGridResult => {
  if (!projects || projects.length === 0) return { rows: [], columns: [] };

  const rows: DashboardProjectsGridFields[] = projects.map((project) => {
    return {
      id: project._id || "",
      name: project.name || "",
      createdAt: new Date(project.createdAt || new Date()).toLocaleDateString(
        "en-GB",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      ),
      status: project.status || ProjectStatus.active,
    };
  });

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: "id",
      headerName: "PROJECT",
      editable: false,
      sortable: true,
      minWidth: 250,
      flex: 1,
      description: "Project information",
      valueGetter: (value, row) => row.name,
      renderCell: (params) => {
        const project = params.row;
        const projectId = project.id || "";
        const displayId =
          projectId.length > 8
            ? `#${projectId.slice(-6).toUpperCase()}`
            : `#${projectId.toUpperCase()}`;

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
                {project.name}
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
      field: "status",
      headerName: "STATUS",
      editable: false,
      sortable: true,
      minWidth: 100,
      flex: 1,
      display: "flex",
      description: "Project status",
      renderCell: (params) => (
        <Chip
          label={params.row.status}
          color={
            params.row.status === ProjectStatus.active ? "success" : "error"
          }
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "CREATED DATE",
      editable: false,
      sortable: true,
      minWidth: 120,
      flex: 1,
      display: "flex",
      description: "Date project was created",
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
