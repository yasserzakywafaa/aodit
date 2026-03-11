import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { PlayArrow, Save } from "@mui/icons-material";

import { useDashboardReportContext } from "./store/Provider";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  AODIT_DIMENSIONS,
  DIMENSION_WEIGHTS,
  REPORT_TYPES,
} from "src/shared/constants/aoditFramework";
import { ReportRun } from "src/shared/types/reportRun";

const getLatestCompletedRun = (runs: ReportRun[]): ReportRun | undefined => {
  const completed = runs.filter((r) => r.status === "completed");
  if (completed.length === 0) return undefined;
  return completed.sort(
    (a, b) =>
      new Date(b.completedAt || b.createdAt || 0).getTime() -
      new Date(a.completedAt || a.createdAt || 0).getTime(),
  )[0];
};

const DashboardReport = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const {
    store: {
      state: { report, runs },
      setReport,
    },
    manager: { setUp, handleUpdateReport, handleLaunchReport },
  } = useDashboardReportContext();

  const latestRun = getLatestCompletedRun(runs);

  useEffect(() => {
    if (reportId) {
      setUp(reportId);
    }
  }, [reportId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >,
  ) => {
    const { name, value } = e.target;
    if (!report) return;
    setReport({ ...report, [name as string]: value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportId || !report) return;
    handleUpdateReport(reportId, {
      name: report.name,
      description: report.description,
      reportType: report.reportType,
    });
  };

  return (
    <Container maxWidth="xl" sx={{ margin: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
          mb: 2,
        }}
      >
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          {report?.name || "Report"}
        </Typography>
        {reportId && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={!reportId || !report}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PlayArrow />}
              onClick={() => handleLaunchReport(reportId)}
              disabled={!reportId}
            >
              Launch report
            </Button>
          </Box>
        )}
      </Box>

      {/* Edit form — same fields as Create */}
      <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Report details
        </Typography>
        <Box component="form" onSubmit={handleSave}>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Report Name"
                name="name"
                value={report?.name ?? ""}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel id="report-type-label">Report Type</InputLabel>
                <Select
                  labelId="report-type-label"
                  label="Report Type"
                  name="reportType"
                  value={report?.reportType ?? ""}
                  onChange={(e) =>
                    report && setReport({ ...report, reportType: e.target.value })
                  }
                >
                  {REPORT_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                label="Description"
                name="description"
                multiline
                rows={4}
                value={report?.description ?? ""}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
        <Typography
          variant="overline"
          color="primary"
          sx={{ letterSpacing: 1 }}
        >
          AODIT Framework™
        </Typography>
        <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2, mt: 1 }}>
          <Table size="small">
            <TableBody>
              {(latestRun?.dimensionScores?.length
                ? latestRun.dimensionScores
                : AODIT_DIMENSIONS.map((dim) => ({
                    dimensionId: dim,
                    score: 0,
                    weight: DIMENSION_WEIGHTS[dim] ?? 0,
                  }))
              ).map((row: { dimensionId: string; score: number; weight: number }) => (
                <TableRow key={row.dimensionId}>
                  <TableCell>{row.dimensionId}</TableCell>
                  <TableCell align="right">
                    {latestRun ? row.score.toFixed(1) : "—"}
                  </TableCell>
                  <TableCell align="right">
                    {Math.round((row.weight || 0) * 100)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {latestRun && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Composite score:</strong> {latestRun.compositeScore?.toFixed(2) ?? "—"}
              </Typography>
              <Typography variant="body2">
                <strong>Rating:</strong> {latestRun.rating ?? "—"}
              </Typography>
              {latestRun.calibrationGap != null && (
                <Typography variant="body2">
                  <strong>Calibration gap:</strong> {latestRun.calibrationGap.toFixed(2)}
                </Typography>
              )}
              {latestRun.outlook && (
                <Typography variant="body2">
                  <strong>Outlook:</strong> {latestRun.outlook}
                </Typography>
              )}
              {latestRun.deploymentVerdict && (
                <Typography variant="body2">
                  <strong>Deployment:</strong> {latestRun.deploymentVerdict}
                </Typography>
              )}
            </Box>
          )}
          {!latestRun && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Launch a report run to see dimension scores, composite score,
              rating, calibration gap, and deployment verdict.
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default DashboardReport;
