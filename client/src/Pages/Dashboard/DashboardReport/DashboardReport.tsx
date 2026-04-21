import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Box,
  Button,
  Container,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  DEFAULT_FRAMEWORK_VERSION,
  getFrameworkDefinition,
  resolveFrameworkVersion,
} from "src/shared/constants/aoditFramework";
import {
  ExpandMore,
  OpenInNew,
  PlayArrow,
  Save,
  Visibility,
} from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AoditReportPDF } from "./ReportPDF/AoditReportPDF";
import CircularProgress from "@mui/material/CircularProgress";
import END_POINTS from "src/application/shared/endpoints";
import PDF from "@mui/icons-material/PictureAsPdf";
import ReportConfig from "./features/ReportConfig";
import { ReportRun } from "src/shared/types/reportRun";
import type { ScenarioResult } from "src/shared/types/scenarioResult";
import axios from "axios";
import { hasSuperAdminRights } from "src/shared/utils/getUserRoles";
import { pdf } from "@react-pdf/renderer";
import { routes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
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
      state: {
        report,
        runs,
        agents,
        agentConnectionStatus,
        agentConnectionMessage,
        agentConnectionCheckedAgentId,
      },
      setReport,
      resetAgentConnectionState,
    },
    manager: {
      setUp,
      handleUpdateReport,
      handleLaunchReport,
      handleTestAgentConnection,
    },
  } = useDashboardReportContext();

  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();
  const isSuperAdmin = hasSuperAdminRights(auth.user);

  const selectedAgent = agents.find((a) => a._id === report?.agentId) ?? null;
  const isAgentConnectionTesting = agentConnectionStatus === "testing";
  const isAgentConnectionValidForSelection = useMemo(
    () =>
      agentConnectionStatus === "success" &&
      !!report?.agentId &&
      agentConnectionCheckedAgentId === report.agentId,
    [agentConnectionCheckedAgentId, agentConnectionStatus, report?.agentId],
  );

  // Tab: 0 = Evaluate Your Agent, 1 = Benchmark Frontier Models
  // Non-admin users can only use agent evaluation mode
  const evaluationMode = isSuperAdmin
    ? (report?.evaluationMode ?? "benchmark")
    : "agent";
  const activeTab = evaluationMode === "agent" ? 0 : 1;

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    if (!report) return;
    setReport({
      ...report,
      evaluationMode: newValue === 0 ? "agent" : "benchmark",
    });
  };

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
          ? `aodit-${report.name.replace(/\s+/g, "-")}-Transcript.pdf`
          : `aodit-${report.name.replace(/\s+/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[aodit] PDF generation failed:", err);
    } finally {
      setPdfModeLoading(null);
    }
  };

  const modelsToTest = report?.modelsToTest ?? [];
  const frameworkVersion = resolveFrameworkVersion(
    report?.frameworkVersion ? DEFAULT_FRAMEWORK_VERSION : "aodit_v1",
  );
  const framework = getFrameworkDefinition(frameworkVersion);
  const totalScenarios =
    (report?.scenariosPerDimension ?? 20) * framework.dimensions.length;
  // In agent mode there is always exactly 1 "model" (the agent itself)
  const modelsCount = evaluationMode === "agent" ? 1 : modelsToTest.length;
  const datapoints = totalScenarios * 8 * Math.max(modelsCount, 1);
  const weightLabels = (
    report?.dimensionWeights
      ? framework.dimensions.map(
          (d) =>
            `${d.slice(0, 3).toUpperCase()} ${Math.round((report.dimensionWeights?.[d] ?? 0) * 100)}%`,
        )
      : framework.dimensions.map(
          (d) =>
            `${d.slice(0, 3).toUpperCase()} ${Math.round((framework.weights[d] ?? 0) * 100)}%`,
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

  const buildUpdatePayload = () => ({
    name: report?.name,
    description: report?.description,
    scenariosPerDimension: report?.scenariosPerDimension,
    frameworkVersion,
    dimensionWeights: report?.dimensionWeights,
    modelsToTest: report?.modelsToTest,
    modelsToEvaluate: ["Claude"],
    agentId: report?.agentId,
    evaluationMode,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportId || !report) return;
    handleUpdateReport(reportId, buildUpdatePayload());
  };

  const handleRunReport = async () => {
    if (!reportId || !report) return;
    try {
      await handleUpdateReport(reportId, buildUpdatePayload());
      await handleLaunchReport(reportId);
      navigate(routes.dashboard.reports.reportLiveFeed(reportId));
    } catch (error) {
      console.error("Failed to run report:", error);
    }
  };

  const handleTestConnection = async () => {
    if (!reportId || !report?.agentId) return;
    await handleTestAgentConnection(reportId, report.agentId);
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
            {totalScenarios} SCENARIOS · 8 TURNS · {framework.marketingLabel}
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

      {/* Evaluation Mode Tabs + Report Config */}
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
              evaluationMode={evaluationMode}
            />
          </AccordionDetails>
        </Accordion>
      ) : (
        <Paper variant="outlined" sx={{ mt: 2, overflow: "hidden" }}>
          {/* Tab switcher — only shown for admins */}
          {isSuperAdmin && (
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                px: 3,
                pt: 1,
                minHeight: 48,
              }}
            >
              <Tab
                label="Evaluate Your Agent"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
              <Tab
                label="Benchmark Frontier Models"
                sx={{ textTransform: "none", fontWeight: 600 }}
              />
            </Tabs>
          )}

          <Box sx={{ p: 3 }}>
            {/* ── TAB 0 / Non-admin default: Evaluate Your Agent ── */}
            {activeTab === 0 && (
              <>
                <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                  Evaluate Your Agent
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Select one of your registered agents and aodit will send
                  adversarial prompts directly to its endpoint using the AODIT-6
                  methodology. The agent must be reachable and respond to HTTP
                  POST requests.
                </Typography>

                {/* Agent selector */}
                <Typography
                  variant="subtitle2"
                  color="primary"
                  fontWeight={600}
                  sx={{ mb: 1 }}
                >
                  Agent Assignment
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1.5 }}
                >
                  Select the AI agent this report evaluates. A report cannot run
                  without an assigned agent (FINMA compliance).
                </Typography>
                <Autocomplete
                  options={agents}
                  getOptionLabel={(option) =>
                    `${option.name}${option.ownerName ? ` (${option.ownerName})` : ""}`
                  }
                  value={selectedAgent}
                  onChange={(_event, newValue) => {
                    if (!report) return;
                    resetAgentConnectionState();
                    setReport({
                      ...report,
                      agentId: newValue?._id ?? undefined,
                    });
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Agent"
                      placeholder="Search agents..."
                      fullWidth
                    />
                  )}
                  sx={{ maxWidth: 500, mb: 2 }}
                />

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleTestConnection}
                  disabled={
                    !reportId ||
                    !selectedAgent?._id ||
                    !selectedAgent?.agentUrl ||
                    isAgentConnectionTesting
                  }
                  sx={{ mb: 2 }}
                >
                  {isAgentConnectionTesting
                    ? "Testing connection..."
                    : "Test Connection"}
                </Button>

                {/* Agent URL status */}
                {selectedAgent && (
                  <Box sx={{ mb: 3 }}>
                    {selectedAgent.agentUrl ? (
                      <Typography variant="body2">
                        <strong>Agent URL:</strong>{" "}
                        <Box
                          component="span"
                          sx={{
                            fontFamily: "monospace",
                            wordBreak: "break-all",
                          }}
                        >
                          {selectedAgent.agentUrl}
                        </Box>
                      </Typography>
                    ) : (
                      <Alert
                        severity="warning"
                        variant="outlined"
                        sx={{ maxWidth: 600, gap: 2 }}
                      >
                        <Typography variant="body2">
                          <strong>{selectedAgent.name}</strong> does not have an{" "}
                          <strong>Agent URL</strong> configured. Add a URL in
                          the agent settings to run in Agent evaluation mode.
                        </Typography>

                        <Button
                          size="small"
                          color="warning"
                          variant="text"
                          endIcon={<OpenInNew fontSize="small" />}
                          onClick={() =>
                            navigate(
                              routes.dashboard.agents.agentById(
                                selectedAgent._id,
                              ),
                            )
                          }
                        >
                          Edit Agent
                        </Button>
                      </Alert>
                    )}
                  </Box>
                )}

                {!selectedAgent && (
                  <Alert
                    severity="info"
                    variant="outlined"
                    sx={{ maxWidth: 600, mb: 3 }}
                  >
                    <Typography variant="body2">
                      Select an agent above to evaluate it. The agent must have
                      an <strong>Agent URL</strong> configured.
                    </Typography>
                  </Alert>
                )}

                {selectedAgent?.agentUrl &&
                  report?.agentId &&
                  agentConnectionCheckedAgentId === report.agentId &&
                  agentConnectionStatus === "success" && (
                    <Alert
                      severity="success"
                      variant="outlined"
                      sx={{ maxWidth: 600, mb: 3 }}
                    >
                      <Typography variant="body2">
                        {agentConnectionMessage || "Connection successful."}
                      </Typography>
                    </Alert>
                  )}

                {selectedAgent?.agentUrl &&
                  report?.agentId &&
                  agentConnectionCheckedAgentId === report.agentId &&
                  agentConnectionStatus === "failed" && (
                    <Alert
                      severity="error"
                      variant="outlined"
                      sx={{ maxWidth: 600, mb: 3 }}
                    >
                      <Typography variant="body2">
                        {agentConnectionMessage ||
                          "Connection test failed. Verify your agent endpoint and try again."}
                      </Typography>
                    </Alert>
                  )}

                {selectedAgent?.agentUrl &&
                  report?.agentId &&
                  (agentConnectionCheckedAgentId !== report.agentId ||
                    agentConnectionStatus === "idle") && (
                    <Alert
                      severity="info"
                      variant="outlined"
                      sx={{ maxWidth: 600, mb: 3 }}
                    >
                      <Typography variant="body2">
                        Click <strong>Test Connection</strong> to verify this
                        agent endpoint.
                        <br />
                        <strong>Run Report</strong> will stay disabled until the
                        test succeeds.
                      </Typography>
                    </Alert>
                  )}

                {/* Still show evaluation config below */}
                <ReportConfig
                  modelsCount={1}
                  totalScenarios={totalScenarios}
                  datapoints={totalScenarios * 8}
                  evaluationMode="agent"
                />
              </>
            )}

            {/* ── TAB 1: Benchmark Frontier Models (admin only) ── */}
            {isSuperAdmin && activeTab === 1 && (
              <>
                <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                  Benchmark Frontier Models
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Select one or more frontier LLMs to benchmark against the
                  AODIT-6 framework. Each model runs every scenario
                  independently via OpenRouter.
                </Typography>

                <ReportConfig
                  modelsCount={modelsCount}
                  totalScenarios={totalScenarios}
                  datapoints={datapoints}
                  evaluationMode="benchmark"
                />
              </>
            )}
          </Box>
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
              report?.status === "running" ||
              // Benchmark mode: must have at least one model selected
              (evaluationMode === "benchmark" && modelsToTest.length < 1) ||
              // Agent mode: must select an agent that has a URL configured
              (evaluationMode === "agent" &&
                (!report?.agentId ||
                  !selectedAgent?.agentUrl ||
                  !isAgentConnectionValidForSelection))
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
            <Typography
              component="span"
              fontSize="inherit"
              color="primary.main"
            >
              aodit
            </Typography>{" "}
            Framework™
          </Typography>
          <Box sx={{ borderTop: 1, borderColor: "divider", pt: 2, mt: 1 }}>
            {latestRun ? (
              <>
                <Table size="small" sx={{ mb: 2 }}>
                  <TableBody>
                    {(latestRun.dimensionScores?.length
                      ? latestRun.dimensionScores
                      : framework.dimensions.map((dim) => ({
                          dimensionId: dim,
                          score: 0,
                          weight: framework.weights[dim] ?? 0,
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
                        {derivedSelfScore != null
                          ? derivedSelfScore.toFixed(2)
                          : "—"}
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

                  {/* <Button
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
                  </Button> */}
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
