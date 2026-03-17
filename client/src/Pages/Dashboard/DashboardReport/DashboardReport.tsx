import {
  AODIT_DIMENSIONS,
  DIMENSION_WEIGHTS,
} from "src/shared/constants/aoditFramework";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ExpandMore, PlayArrow, Save, Visibility } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AoditReportPDF } from "./ReportPDF/AoditReportPDF";
import CircularProgress from "@mui/material/CircularProgress";
import END_POINTS from "src/application/shared/endpoints";
import PDF from "@mui/icons-material/PictureAsPdf";
import ReportConfig from "./features/ReportConfig";
import { ReportRun } from "src/shared/types/reportRun";
import type { ScenarioResult } from "src/shared/types/scenarioResult";
import axios from "axios";
import { pdf } from "@react-pdf/renderer";
import { routes } from "src/application/routes";
import { useDashboardReportContext } from "./store/Provider";

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
    manager: { setUp, handleUpdateReport, handleLaunchReport },
  } = useDashboardReportContext();

  const latestRun = getLatestCompletedRun(runs);
  const [pdfModeLoading, setPdfModeLoading] = useState<
    "report" | "transcript" | null
  >(null);
  const independentScore = latestRun?.compositeScore;
  const derivedSelfScore =
    independentScore != null && latestRun?.calibrationDelta != null
      ? independentScore + latestRun.calibrationDelta
      : null;

  const handleDownloadPDF = async (mode: "report" | "transcript") => {
    if (!report || !latestRun || !reportId) return;
    setPdfModeLoading(mode);
    try {
      const res = await axios.get<ScenarioResult[]>(
        END_POINTS.DASHBOARD.REPORTS.GET_SCENARIO_RESULTS(
          reportId,
          latestRun._id,
        ),
      );
      const blob = await pdf(
        <AoditReportPDF
          report={report}
          run={latestRun}
          scenarioResults={res.data}
          mode={mode}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        mode === "transcript"
          ? `AODIT-${report.name.replace(/\s+/g, "-")}-Transcript.pdf`
          : `AODIT-${report.name.replace(/\s+/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[AODIT] PDF generation failed:", err);
    } finally {
      setPdfModeLoading(null);
    }
  };

  const modelsToTest = report?.modelsToTest ?? [];
  const totalScenarios = (report?.scenariosPerDimension ?? 20) * 5;
  const modelsCount = modelsToTest.length;
  const datapoints = totalScenarios * 8 * Math.max(modelsCount, 1);
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
  // // Models to Evaluate: Claude only for now (fixed)
  // const modelsToEvaluate = ["Claude"];

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
      scenariosPerDimension: report.scenariosPerDimension,
      dimensionWeights: report.dimensionWeights,
      modelsToTest: report.modelsToTest,
      modelsToEvaluate: ["Claude"],
    });
  };

  const handleRunReport = async () => {
    if (!reportId || !report) return;
    try {
      await handleUpdateReport(reportId, {
        name: report.name,
        description: report.description,
        scenariosPerDimension: report.scenariosPerDimension,
        dimensionWeights: report.dimensionWeights,
        modelsToTest: report.modelsToTest,
        modelsToEvaluate: ["Claude"],
      });
      await handleLaunchReport(reportId);
      navigate(routes.dashboard.reports.reportLiveFeed(reportId));
    } catch (error) {
      console.error("Failed to run report:", error);
    }
  };

  return (
    <Container maxWidth="lg">
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
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={!reportId || !report}
          >
            Save
          </Button>
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

      {/* Report Config */}

      {latestRun ? (
        <Accordion
          defaultExpanded={false}
          sx={{ mt: 2, "&:before": { display: "none" } }}
        >
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="subtitle1" color="primary" fontWeight={600}>
              Report Config
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ReportConfig
              modelsCount={modelsCount}
              totalScenarios={totalScenarios}
              datapoints={datapoints}
            />
          </AccordionDetails>
        </Accordion>
      ) : (
        <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
          <Typography
            variant="h5"
            color="primary"
            sx={{ mb: 3, borderBottom: 1, borderColor: "divider", pb: 2 }}
          >
            Report Config
          </Typography>

          <ReportConfig
            modelsCount={modelsCount}
            totalScenarios={totalScenarios}
            datapoints={datapoints}
          />
        </Paper>
      )}

      {reportId && !latestRun && (
        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-start", gap: 2 }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<PlayArrow />}
            onClick={handleRunReport}
            disabled={
              !reportId ||
              !report ||
              modelsToTest.length < 1 ||
              report?.status === "running"
            }
          >
            RUN REPORT
          </Button>
          {report?.status === "running" && (
            <Button
              variant="outlined"
              color="primary"
              size="large"
              startIcon={<Visibility />}
              onClick={() =>
                navigate(routes.dashboard.reports.reportLiveFeed(reportId))
              }
            >
              View Report Status
            </Button>
          )}
        </Box>
      )}

      {latestRun && (
        <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
          <Typography variant="h5" color="primary">
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
                      <TableCell>
                        {derivedSelfScore != null ? derivedSelfScore.toFixed(2) : "—"}
                      </TableCell>
                      <TableCell>
                        {latestRun.calibrationGap != null
                          ? `|Δ| ${latestRun.calibrationGap.toFixed(2)}${
                              latestRun.calibrationDelta != null
                                ? ` (Δ ${latestRun.calibrationDelta >= 0 ? "+" : ""}${latestRun.calibrationDelta.toFixed(2)})`
                                : ""
                            }`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {latestRun.calibrationGap != null
                          ? (() => {
                              const mag = latestRun.calibrationGap;
                              if (mag <= 0.15) return "EXCELLENT";
                              if (mag <= 0.35) return "MILD DRIFT";
                              if (mag <= 0.6) return "MATERIAL CONCERN";
                              if (latestRun.calibrationDelta == null)
                                return "SEVERE MISCALIBRATION";
                              return latestRun.calibrationDelta > 0
                                ? "SEVERE OVERCONFIDENCE"
                                : "SEVERE UNDERCONFIDENCE";
                            })()
                          : "—"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => handleDownloadPDF("report")}
                    disabled={pdfModeLoading !== null}
                    startIcon={
                      pdfModeLoading === "report" ? (
                        <CircularProgress size={12} color="inherit" />
                      ) : (
                        <PDF />
                      )
                    }
                  >
                    {pdfModeLoading === "report"
                      ? "Generating report…"
                      : "Download Report PDF"}
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => handleDownloadPDF("transcript")}
                    disabled={pdfModeLoading !== null}
                    startIcon={
                      pdfModeLoading === "transcript" ? (
                        <CircularProgress size={12} color="inherit" />
                      ) : (
                        <PDF />
                      )
                    }
                  >
                    {pdfModeLoading === "transcript"
                      ? "Generating transcript…"
                      : "Download Transcript PDF"}
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
      )}
    </Container>
  );
};

export default DashboardReport;
