import { Box, Typography } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";

import { dataGridStyle } from "src/application/shared/themes";
import { getDashboardAdminAgentsDataGridConfig } from "./features/dataGridConfig";
import { useDashboardAdminAgentsContext } from "./store/Provider";
import { useEffect } from "react";

const DashboardAdminAgents = () => {
  const {
    store: {
      state: { isFetching, agents, paging },
    },
    manager: { setUp, handleGetAgentsByPage },
  } = useDashboardAdminAgentsContext();

  const config = getDashboardAdminAgentsDataGridConfig(agents);

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    const pageNumber = model.page + 1;
    const pageSize = model.pageSize;
    handleGetAgentsByPage(pageNumber, pageSize);
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        Agents
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 3
        }}>
        {paging.totalCount
          ? `${paging.totalCount} total`
          : "Manage all agents across users from here."}
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

export default DashboardAdminAgents;
