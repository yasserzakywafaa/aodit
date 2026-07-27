import { Box, Button, Typography } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";

import { Add } from "@mui/icons-material";
import CreateUserDialog from "./CreateUserDialog";
import { dataGridStyle } from "src/application/shared/themes";
import { getDashboardUsersDataGridConfig } from "./features/dataGridConfig";
import { useDashboardUsersContext } from "./store/Provider";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const DashboardUsers = () => {
  const { t } = useTranslation("dashboard");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const {
    store: {
      state: { isFetching, users, paging },
    },
    manager: { setUp, handleGetUsersByPage },
  } = useDashboardUsersContext();

  const config = getDashboardUsersDataGridConfig(users, t);

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    const pageNumber = model.page + 1;
    const pageSize = model.pageSize;
    handleGetUsersByPage(pageNumber, pageSize);
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
          {t("admin.users.title")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="small"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          {t("admin.users.createUser")}
        </Button>
      </Box>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 3
        }}>
        {paging.totalCount
          ? t("totalCount", { count: paging.totalCount })
          : t("admin.users.subtitle")}
      </Typography>
      <CreateUserDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => handleGetUsersByPage(1, paging.pageSize || 10)}
      />
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

export default DashboardUsers;
