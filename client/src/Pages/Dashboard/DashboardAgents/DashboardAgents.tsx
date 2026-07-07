import { Box, Button, Stack, Typography } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";

import { dataGridStyle } from "src/application/shared/themes";
import { getDashboardAgentsDataGridConfig } from "./features/dataGridConfig";
import { routes } from "src/application/routes";
import { useDashboardAgentsContext } from "./store/Provider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardAgents = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { isFetching, agents, paging },
    },
    manager: { setUp, handleGetAgentsByPage },
  } = useDashboardAgentsContext();

  const config = getDashboardAgentsDataGridConfig(agents);

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    const pageNumber = model.page + 1;
    const pageSize = model.pageSize;
    handleGetAgentsByPage(pageNumber, pageSize);
  };

  const handleCreateAgentClick = () => {
    navigate(routes.dashboard.agents.create);
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Stack spacing={2}>
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
              : "Manage AI agents and their human owners from here."}
          </Typography>
        </Stack>

        <Box sx={{
          alignSelf: "center"
        }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleCreateAgentClick}
          >
            Create Agent
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

export default DashboardAgents;
