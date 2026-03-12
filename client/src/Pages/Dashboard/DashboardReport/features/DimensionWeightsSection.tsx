import { Box, Slider, Typography } from "@mui/material";

import { AODIT_DIMENSIONS } from "src/shared/constants/aoditFramework";
import type { AoditDimensionId } from "src/shared/constants/aoditFramework";
import { useDashboardReportContext } from "../store/Provider";
import { weightSum } from "./weightSum";

const DimensionWeightsSection = () => {
  const {
    store: {
      state: { report },
      setReport,
    },
  } = useDashboardReportContext();

  const total = weightSum(report?.dimensionWeights);
  const weightsOk = Math.abs(total - 1) < 0.001;

  return (
    <>
      <Typography variant="h6" color="primary" mb={1.5}>
        Dimension weights - <i>must total 100%</i>
      </Typography>
      <Box sx={{ px: 1, mb: 3 }}>
        {AODIT_DIMENSIONS.map((dim) => (
          <Box
            key={dim}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 1.5,
            }}
          >
            <Typography sx={{ minWidth: 120 }} variant="body2" fontWeight={500}>
              {dim.toUpperCase()}
            </Typography>
            <Slider
              value={Math.round((report?.dimensionWeights?.[dim] ?? 0.2) * 100)}
              min={5}
              max={50}
              valueLabelDisplay="auto"
              valueLabelFormat={(v) => `${v}%`}
              onChange={(_, value) => {
                if (!report) return;
                const next = {
                  ...report.dimensionWeights,
                  [dim as AoditDimensionId]: (value as number) / 100,
                };
                setReport({ ...report, dimensionWeights: next });
              }}
              sx={{ flex: 1 }}
            />
            <Typography
              component="code"
              variant="body1"
              sx={{
                minWidth: 36,
                border: "1px solid",
                borderColor: "divider",
                padding: 1,
              }}
            >
              {Math.round((report?.dimensionWeights?.[dim] ?? 0.2) * 100)}%
            </Typography>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          mb: 3,
          py: 1,
          border: 1,
          borderColor: weightsOk ? "success.main" : "error.main",
          bgcolor: "transparent",
          color: weightsOk ? "success.main" : "error.main",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 150,
          ml: "auto",
        }}
      >
        <Typography variant="caption" fontWeight={600} color="inherit">
          {weightsOk
            ? ` TOTAL: ${Math.round(total * 100)}%`
            : ` TOTAL: ${Math.round(total * 100)}%`}
        </Typography>
        {!weightsOk && (
          <Typography variant="caption" fontWeight={600} color="inherit">
            must equal 100%
          </Typography>
        )}
      </Box>
    </>
  );
};

export default DimensionWeightsSection;
