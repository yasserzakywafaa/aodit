import {
  AODIT_DIMENSIONS,
  DIMENSION_WEIGHTS,
  MODELS_TO_TEST_OPTIONS,
} from "src/shared/constants/aoditFramework";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ExpandMore, PlayArrow, Save } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

import { ReportRun } from "src/shared/types/reportRun";
import { routes } from "src/application/routes";
import { useDashboardReportContext } from "./store/Provider";
import { useEffect } from "react";

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
  const navigate = useNavigate();
  const {
    store: {
      state: { report, runs },
      setReport,
    },
    manager: { setUp, handleUpdateReport },
  } = useDashboardReportContext();

  const latestRun = getLatestCompletedRun(runs);
  const totalScenarios = (report?.scenariosPerDimension ?? 20) * 5;
  const interactions = totalScenarios * 8;
  const weightLabels = (
    report?.dimensionWeights
      ? AODIT_DIMENSIONS.map(
          (d) =>
            `${d.slice(0, 3).toUpperCase()} ${Math.round((report.dimensionWeights?.[d] ?? 0) * 100)}%`,
        )
      : AODIT_DIMENSIONS.map(
          (d) =>
            `${d.slice(0, 3).toUpperCase()} ${Math.round((DIMENSION_WEIGHTS[d] ?? 0) * 100)}%`,
        )
  ).join(" · ");
  const modelsToTest = report?.modelsToTest ?? [];
  // // Models to Evaluate: Claude only for now (fixed)
  // const modelsToEvaluate = ["Claude"];

  useEffect(() => {
    if (reportId) {
      setUp(reportId);
    }
  }, [reportId]);

  const toggleModelTest = (model: string) => {
    if (!report) return;
    const next = modelsToTest.includes(model)
      ? modelsToTest.filter((m) => m !== model)
      : [...modelsToTest, model];
    setReport({ ...report, modelsToTest: next });
  };

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
      scenariosPerDimension: report.scenariosPerDimension,
      dimensionWeights: report.dimensionWeights,
      modelsToTest: report.modelsToTest,
      modelsToEvaluate: ["Claude"],
    });
  };

  const handleRunReport = () => {
    if (!reportId) return;
    navigate(routes.dashboard.reports.reportRun(reportId));
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
        <Box>
          <Typography variant="h4" component="h1" color="primary" gutterBottom>
            {report?.name || "Report"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalScenarios} SCENARIOS · 8 TURNS · AODIT-5
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {weightLabels}
          </Typography>
        </Box>
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
              onClick={handleRunReport}
              disabled={!reportId || !modelsToTest.length}
            >
              RUN REPORT
            </Button>
          </Box>
        )}
      </Box>

      {/* Report details — accordion, collapsed by default */}
      <Accordion
        defaultExpanded={false}
        sx={{ mt: 2, "&:before": { display: "none" } }}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle1" color="primary" fontWeight={600}>
            Report details
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box component="form" onSubmit={handleSave}>
            <TextField
              label="Report Name"
              name="name"
              value={report?.name ?? ""}
              onChange={handleChange}
              required
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              name="description"
              multiline
              rows={4}
              value={report?.description ?? ""}
              onChange={handleChange}
              fullWidth
            />
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Section 01 — Models to Test */}
      <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          01 — Models to Test
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Select which AI agents to pentest
        </Typography>
        <FormGroup row>
          {MODELS_TO_TEST_OPTIONS.map((model) => (
            <FormControlLabel
              key={model}
              control={
                <Checkbox
                  checked={modelsToTest.includes(model)}
                  onChange={() => toggleModelTest(model)}
                />
              }
              label={model}
            />
          ))}
        </FormGroup>
      </Paper>

      {/* Section 02 — Models to Evaluate (Claude only for now) */}
      <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          02 — Models to Evaluate
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Model used to judge the results
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          Claude
        </Typography>
      </Paper>

      {/* Estimates bar */}
      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" color="primary">
              {totalScenarios}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              SCENARIOS
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" color="primary">
              {interactions}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              INTERACTIONS
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" color="primary">
              ~45m
            </Typography>
            <Typography variant="caption" color="text.secondary">
              EST. RUNTIME
            </Typography>
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h6" color="primary">
              ~CHF 14
            </Typography>
            <Typography variant="caption" color="text.secondary">
              EST. COST
            </Typography>
          </Box>
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
          {latestRun ? (
            <>
              <Table size="small" sx={{ mb: 2 }}>
                <TableBody>
                  {(latestRun.dimensionScores?.length
                    ? latestRun.dimensionScores
                    : AODIT_DIMENSIONS.map((dim) => ({
                        dimensionId: dim,
                        score: 0,
                        weight: DIMENSION_WEIGHTS[dim] ?? 0,
                      }))
                  ).map(
                    (row: {
                      dimensionId: string;
                      score: number;
                      weight: number;
                    }) => (
                      <TableRow key={row.dimensionId}>
                        <TableCell>{row.dimensionId}</TableCell>
                        <TableCell align="right">
                          {row.score.toFixed(1)}
                        </TableCell>
                        <TableCell align="right">
                          {Math.round((row.weight || 0) * 100)}%
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                  <TableRow sx={{ borderTop: 1, borderColor: "divider" }}>
                    <TableCell>
                      <strong>Composite</strong>
                    </TableCell>
                    <TableCell align="right">
                      {latestRun.compositeScore?.toFixed(2) ?? "—"}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Rating</strong>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          border: 1,
                          ...(/^AAA|AA$/i.test(latestRun.rating ?? "")
                            ? {
                                color: "success.main",
                                borderColor: "success.main",
                              }
                            : /^A$/i.test(latestRun.rating ?? "")
                              ? {
                                  color: "warning.main",
                                  borderColor: "warning.main",
                                }
                              : /^BBB$/i.test(latestRun.rating ?? "")
                                ? {
                                    color: "warning.dark",
                                    borderColor: "warning.dark",
                                  }
                                : {
                                    color: "error.main",
                                    borderColor: "error.main",
                                  }),
                        }}
                      >
                        {latestRun.rating ?? "—"}
                      </Typography>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Outlook</strong>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        component="span"
                        variant="caption"
                        sx={{
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          border: 1,
                          ...(latestRun.outlook === "Stable"
                            ? {
                                color: "success.main",
                                borderColor: "success.main",
                              }
                            : latestRun.outlook === "Watch"
                              ? {
                                  color: "warning.main",
                                  borderColor: "warning.main",
                                }
                              : latestRun.outlook === "Negative"
                                ? {
                                    color: "error.main",
                                    borderColor: "error.main",
                                  }
                                : {
                                    color: "text.secondary",
                                    borderColor: "divider",
                                  }),
                        }}
                      >
                        {latestRun.outlook ?? "—"}
                      </Typography>
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mb: 1 }}
              >
                CALIBRATION GAP ANALYSIS
              </Typography>
              <Table size="small" sx={{ mb: 2 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Model</TableCell>
                    <TableCell>Independent score</TableCell>
                    <TableCell>Self score</TableCell>
                    <TableCell>Gap</TableCell>
                    <TableCell>Assessment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{latestRun.modelName ?? "—"}</TableCell>
                    <TableCell>
                      {latestRun.compositeScore?.toFixed(2) ?? "—"}
                    </TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>
                      {latestRun.calibrationGap != null
                        ? `${latestRun.calibrationGap >= 0 ? "+" : ""}${latestRun.calibrationGap.toFixed(2)}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {latestRun.calibrationGap != null
                        ? latestRun.calibrationGap <= 0.15
                          ? "EXCELLENT"
                          : latestRun.calibrationGap <= 0.35
                            ? "MILD DRIFT"
                            : latestRun.calibrationGap <= 0.6
                              ? "MATERIAL CONCERN"
                              : "SEVERE OVERCONFIDENCE"
                        : "—"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                <Button variant="outlined" size="small" onClick={() => {}}>
                  Share
                </Button>
                <Button variant="outlined" size="small" onClick={() => {}}>
                  Embed
                </Button>
                <Button variant="contained" size="small" onClick={() => {}}>
                  Download PDF
                </Button>
              </Box>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Run a report to see dimension scores, composite score, rating,
              calibration gap, and deployment verdict.
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default DashboardReport;
