import { Box, Button, Stack, Typography } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";

import { dataGridStyle } from "src/application/shared/themes";
import { getDashboardReportsDataGridConfig } from "./features/dataGridConfig";
import { routes } from "src/application/routes";
import { useDashboardReportsContext } from "./store/Provider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardReports = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { isFetching, reports, paging },
    },
    manager: { setUp, handleGetReportsByPage },
  } = useDashboardReportsContext();

  const config = getDashboardReportsDataGridConfig(reports);

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    const pageNumber = model.page + 1;
    const pageSize = model.pageSize;
    handleGetReportsByPage(pageNumber, pageSize);
  };

  const handleCreateReportClick = () => {
    navigate(routes.dashboard.reports.create);
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Stack spacing={2}>
          <Typography variant="h4" component="h1" color="primary" gutterBottom>
            Reports
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {paging.totalCount
              ? `${paging.totalCount} total`
              : "Manage reports and view run results from here."}
          </Typography>
        </Stack>

        <Box alignSelf="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCreateReportClick}
          >
            Create Report
          </Button>
        </Box>
      </Box>

      <Box sx={{ overflowX: "auto", position: "relative", width: "100%" }}>
        <DataGrid
          showToolbar
          rows={config.rows}
          columns={config.columns}
          paginationMode="server"
          rowCount={paging.totalCount || 0}
          paginationModel={{
            page: (paging.pageNumber || 1) - 1,
            pageSize: paging.pageSize || 10,
          }}
          onPaginationModelChange={handlePaginationModelChange}
          pageSizeOptions={[10, 20, 50, 100]}
          disableRowSelectionOnClick
          disableAutosize
          disableColumnResize
          loading={isFetching}
          sx={(theme) => dataGridStyle(theme)}
        />
      </Box>
    </Box>
  );
};

export default DashboardReports;
