import { Box, Typography } from "@mui/material";
import { DataGrid, GridPaginationModel } from "@mui/x-data-grid";

import { dataGridStyle } from "src/application/shared/themes";
import { getDashboardAdminReportsDataGridConfig } from "./features/dataGridConfig";
import { useDashboardAdminReportsContext } from "./store/Provider";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const DashboardAdminReports = () => {
  const { t } = useTranslation("dashboard");
  const {
    store: {
      state: { isFetching, reports, paging },
    },
    manager: { setUp, handleGetReportsByPage },
  } = useDashboardAdminReportsContext();

  const config = getDashboardAdminReportsDataGridConfig(reports, t);

  const handlePaginationModelChange = (model: GridPaginationModel) => {
    const pageNumber = model.page + 1;
    const pageSize = model.pageSize;
    handleGetReportsByPage(pageNumber, pageSize);
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        {t("reports.title")}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 3
        }}>
        {paging.totalCount
          ? t("totalCount", { count: paging.totalCount })
          : t("reports.adminSubtitle")}
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

export default DashboardAdminReports;
