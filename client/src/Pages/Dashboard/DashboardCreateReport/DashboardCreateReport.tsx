import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormLabel,
  Grid,
  Slider,
  TextField,
  Typography,
} from "@mui/material";

import { routes } from "src/application/routes";
import {
  AODIT_DIMENSIONS,
  SCENARIOS_PER_DIMENSION_OPTIONS,
} from "src/shared/constants/aoditFramework";
import type { AoditDimensionId } from "src/shared/constants/aoditFramework";
import { useDashboardCreateReportContext } from "./store/Provider";
import { useNavigate } from "react-router-dom";
import type { DimensionWeights } from "src/shared/types/report";

const weightSum = (w: DimensionWeights | undefined): number => {
  if (!w) return 0;
  return (
    (w.Reliability ?? 0) +
    (w.Integrity ?? 0) +
    (w.Judgment ?? 0) +
    (w.Resistance ?? 0) +
    (w.Resilience ?? 0)
  );
};

const DashboardCreateReport = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { report },
      setReport,
    },
    manager: { handleCreateReport },
  } = useDashboardCreateReportContext();

  const weightsTotal = weightSum(report.dimensionWeights);
  const weightsOk = Math.abs(weightsTotal - 1) < 0.001;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >,
  ) => {
    const { name, value } = e.target;
    setReport({
      ...report,
      [name as string]: value,
    });
  };

  const handleWeightChange = (dim: AoditDimensionId, value: number) => {
    const next = { ...report.dimensionWeights, [dim]: value / 100 };
    setReport({ ...report, dimensionWeights: next });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weightsOk) return;
    try {
      const created = await handleCreateReport(report);
      if (created?._id) {
        navigate(routes.dashboard.reports.reportById(created._id));
      }
    } catch (error) {
      console.error("❌ Failed to create report:", error);
    }
  };

  return (
    <Container sx={{ margin: "0" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Create New Report
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Card variant="outlined" sx={{ borderWidth: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" color="primary" fontWeight={600} sx={{ mb: 2 }}>
                  Report details
                </Typography>
                <TextField
                  label="Report Name"
                  name="name"
                  value={report.name ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. Healthcare Agent Risk 2026"
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={report.description ?? ""}
                  onChange={handleChange}
                  placeholder="Optional description of the report"
                  fullWidth
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card variant="outlined" sx={{ borderWidth: 1 }}>
              <CardContent>
                <FormLabel component="legend" sx={{ mb: 1.5, display: "block", fontWeight: 600, color: "primary.main" }}>
                  Scenarios per dimension
                </FormLabel>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  {SCENARIOS_PER_DIMENSION_OPTIONS.map((opt) => {
                    const selected = (report.scenariosPerDimension ?? 20) === opt.value;
                    return (
                      <Box
                        key={opt.value}
                        onClick={() =>
                          setReport({
                            ...report,
                            scenariosPerDimension: opt.value,
                          })
                        }
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
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
                          border: 2,
                          borderColor: selected ? "primary.main" : "divider",
                          bgcolor: selected ? "action.selected" : "background.paper",
                          borderRadius: 1,
                          cursor: "pointer",
                          textAlign: "center",
                          "&:hover": {
                            borderColor: "primary.light",
                            bgcolor: selected ? "action.selected" : "action.hover",
                          },
                        }}
                      >
                        <Typography variant="h5" component="div" fontWeight="bold">
                          {opt.label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {opt.total} total
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Card variant="outlined" sx={{ borderWidth: 1 }}>
              <CardContent>
                <FormLabel component="legend" sx={{ mb: 1.5, display: "block", fontWeight: 600, color: "primary.main" }}>
                  Dimension weights (must total 100%)
                </FormLabel>
                <Box sx={{ px: 1 }}>
                  {AODIT_DIMENSIONS.map((dim) => (
                    <Box key={dim} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
                      <Typography sx={{ minWidth: 120 }} variant="body2" fontWeight={500}>
                        {dim.toUpperCase()}
                      </Typography>
                      <Slider
                        value={Math.round((report.dimensionWeights?.[dim] ?? 0.2) * 100)}
                        min={5}
                        max={50}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => `${v}%`}
                        onChange={(_, value) =>
                          handleWeightChange(dim, value as number)
                        }
                        sx={{ flex: 1 }}
                      />
                      <Typography variant="body2" sx={{ minWidth: 36 }}>
                        {Math.round((report.dimensionWeights?.[dim] ?? 0.2) * 100)}%
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <Box
                  sx={{
                    mt: 2,
                    py: 1.5,
                    px: 2,
                    borderRadius: 1,
                    border: 2,
                    borderColor: weightsOk ? "success.main" : "error.main",
                    bgcolor: "transparent",
                    color: weightsOk ? "success.main" : "error.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body1" fontWeight={600} color="inherit">
                    {weightsOk
                      ? `✓ TOTAL: ${Math.round(weightsTotal * 100)}%`
                      : `✗ TOTAL: ${Math.round(weightsTotal * 100)}% — must equal 100%`}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!weightsOk}
          sx={{ mt: 4 }}
        >
          Create Report
        </Button>
      </Box>
    </Container>
  );
};

export default DashboardCreateReport;
