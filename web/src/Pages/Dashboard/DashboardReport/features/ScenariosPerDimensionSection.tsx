import { Box, Typography } from "@mui/material";

import { SCENARIOS_PER_DIMENSION_OPTIONS } from "src/shared/constants/aoditFramework";
import { useDashboardReportContext } from "../store/Provider";
import { useTranslation } from "react-i18next";

const ScenariosPerDimensionSection = () => {
  const { t } = useTranslation("report");
  const {
    store: {
      state: { report },
      setReport,
    },
  } = useDashboardReportContext();

  return (
    <>
      <Typography
        variant="h6"
        color="primary"
        sx={{
          mb: 1.5,
        }}
      >
        {t("configSections.scenariosPerDimension")}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
        {SCENARIOS_PER_DIMENSION_OPTIONS.map((opt) => {
          const selected = (report?.scenariosPerDimension ?? 20) === opt.value;
          return (
            <Box
              key={opt.value}
              onClick={() =>
                report &&
                setReport({ ...report, scenariosPerDimension: opt.value })
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && report) {
                  e.preventDefault();
                  setReport({ ...report, scenariosPerDimension: opt.value });
                }
              }}
              sx={{
                minWidth: 120,
                flex: "1 1 100px",
                maxWidth: 180,
                py: 2.5,
                px: 2,
                border: 1,
                borderColor: selected ? "primary.main" : "divider",
                bgcolor: selected ? "primary.main" : "background.paper",
                cursor: "pointer",
                textAlign: "center",
                "&:hover": {
                  borderColor: "primary.light",
                  bgcolor: selected ? "action.selected" : "action.hover",
                },
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  fontWeight: "bold",
                }}
              >
                {opt.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                }}
              >
                {t("configSections.totalLabel", { total: opt.total })}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default ScenariosPerDimensionSection;
