import { Box, Typography } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";

import { dataGridStyle } from "src/application/shared/themes";
import { getDashboardDemosDataGridConfig } from "./features/dataGridConfig";
import { useDashboardDemosContext } from "./store/Provider";
import { useEffect } from "react";

const DashboardAdminDemos = () => {
  const {
    store: {
      state: { isFetching, demos, paging },
    },
    manager: { setUp, handleGetDemosByPage },
  } = useDashboardDemosContext();

  const config = getDashboardDemosDataGridConfig(demos);

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    const pageNumber = model.page + 1;
    const pageSize = model.pageSize;
    handleGetDemosByPage(pageNumber, pageSize);
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1
        }}>
        <Typography variant="h4" component="h1" color="primary">
          Demos
        </Typography>
      </Box>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 3
        }}>
        {paging.totalCount
          ? `${paging.totalCount} total`
          : "Free demos run by visitors across all pages."}
      </Typography>
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

export default DashboardAdminDemos;
