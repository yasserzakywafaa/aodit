import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  DEFAULT_FRAMEWORK_VERSION,
  getFrameworkDefinition,
  resolveFrameworkVersion,
} from "src/shared/constants/aoditFramework";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Agent } from "src/shared/types/agent";
import END_POINTS from "src/application/shared/endpoints";
import type { FeedItem } from "src/shared/types/reportRun";
import type { Report } from "src/shared/types/report";
import { StopCircleOutlined } from "@mui/icons-material";
import axios from "axios";
import { routes } from "src/application/routes";

const POLL_INTERVAL_MS = 3000;

const scoreColor = (score: string): string => {
  const n = parseFloat(score);
  if (isNaN(n)) return "text.secondary";
  if (n >= 4) return "success.main";
  if (n >= 3) return "primary.main";
  if (n >= 2) return "warning.main";
  return "error.main";
};

const agrLabel = (type: FeedItem["type"]) =>
  type === "pass" ? "STRONG" : type === "warn" ? "MODERATE" : "LOW";

const agrColor = (type: FeedItem["type"]) =>
  type === "pass"
    ? "success.main"
    : type === "warn"
      ? "warning.main"
      : "error.main";

const DashboardReportRun = () => {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [progress, setProgress] = useState(0);
  const [totalScenarios, setTotalScenarios] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState(0);
  const [dimensionProgress, setDimensionProgress] = useState<
    Record<string, { completed: number; total: number }>
  >({});
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [runStatus, setRunStatus] = useState<string>("pending");
  const [currentTurnName, setCurrentTurnName] = useState<string>("—");
  const [noActiveRun, setNoActiveRun] = useState(false);
  const [stopDialogOpen, setStopDialogOpen] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!reportId) return;
    axios
      .get(END_POINTS.DASHBOARD.REPORTS.GET_REPORT_BY_ID, {
        params: { reportId },
      })
      .then((res) => setReport(res.data))
      .catch(() => setReport(null));
  }, [reportId]);

  // Fetch the assigned agent when running in agent evaluation mode
  useEffect(() => {
    if (!report?.agentId || report.evaluationMode !== "agent") {
      setAgent(null);
      return;
    }
    axios
      .get(END_POINTS.DASHBOARD.AGENTS.GET_AGENT_BY_ID, {
        params: { agentId: report.agentId },
      })
      .then((res) => setAgent(res.data))
      .catch(() => setAgent(null));
  }, [report?.agentId, report?.evaluationMode]);

  useEffect(() => {
    if (!reportId || !report) return;

    const poll = async () => {
      try {
        const res = await axios.get(
          END_POINTS.DASHBOARD.REPORTS.GET_RUN_STATUS(reportId),
        );
        const data = res.data;
        setNoActiveRun(false);
        setProgress(data.progress ?? 0);
        setTotalScenarios(data.totalScenarios ?? 0);
        setCompletedScenarios(data.completedScenarios ?? 0);
        if (data.dimensionProgress)
          setDimensionProgress(data.dimensionProgress);
        if (data.currentTurnName)
          setCurrentTurnName(
            serverTurnToDisplay[data.currentTurnName] ??
              data.currentTurnName.toUpperCase(),
          );
        setRunStatus(data.status ?? "running");
        if (data.feedItems && data.feedItems.length > 0)
          setFeedItems(data.feedItems);
        if (
          data.status === "completed" ||
          data.status === "failed" ||
          data.status === "stopped"
        ) {
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNoActiveRun(true);
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
        }
      }
    };

    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [reportId, report]);

  const isFinished =
    runStatus === "completed" ||
    runStatus === "failed" ||
    runStatus === "stopped";
  const frameworkVersion = resolveFrameworkVersion(
    report?.frameworkVersion ? DEFAULT_FRAMEWORK_VERSION : "aodit_v1",
  );
  const framework = getFrameworkDefinition(frameworkVersion);
  const turnDisplayNames = framework.turnProtocol.map((turn) =>
    turn.name.toUpperCase(),
  );
  const serverTurnToDisplay = Object.fromEntries(
    framework.turnTypes.map((turnType, idx) => [
      turnType,
      turnDisplayNames[idx] ?? turnType.toUpperCase(),
    ]),
  ) as Record<string, string>;
  const displayTotal =
    totalScenarios ||
    (report?.scenariosPerDimension ?? 20) *
      framework.dimensions.length *
      (report?.modelsToTest?.length ?? 1);

  // Derived stats
  const datapoints = completedScenarios * 8;
  const avgScore =
    feedItems.length > 0
      ? (
          feedItems.reduce(
            (sum, item) => sum + parseFloat(item.score || "0"),
            0,
          ) / feedItems.length
        ).toFixed(2)
      : "—";

  // Helper to get per-dimension progress (falls back to uniform estimate if not yet available)
  const getDimProgress = (dim: string) => {
    const entry = dimensionProgress[dim];
    if (entry && entry.total > 0) return entry;
    // Fallback for initial load before first poll resolves
    const fallbackTotal = Math.max(
      1,
      Math.floor(displayTotal / framework.dimensions.length),
    );
    return { completed: 0, total: fallbackTotal };
  };

  // Current turn index driven by server-pushed currentTurnName (not derived from feed items)
  const latestItem = feedItems[0] ?? null;
  const currentTurnIdx = (turnDisplayNames as readonly string[]).indexOf(
    currentTurnName,
  );

  const handleStopConfirm = async () => {
    if (!reportId) return;
    setIsStopping(true);
    try {
      await axios.post(END_POINTS.DASHBOARD.REPORTS.STOP_REPORT(reportId));
      setStopDialogOpen(false);
      setRunStatus("stopped");
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    } catch {
      // Silently ignore — the next poll will reflect the actual state
    } finally {
      setIsStopping(false);
    }
  };

  if (noActiveRun) {
    return (
      <Box sx={{ maxWidth: 740, mx: "auto" }}>
        <Box
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            No active run found for this report.
          </Typography>
          {reportId && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() =>
                navigate(routes.dashboard.reports.reportById(reportId))
              }
            >
              Back to Report
            </Button>
          )}
        </Box>
      </Box>
    );
  }

  return (
    // Break out of the dashboard's p:3 padding to fill the full content area
    <Box
      sx={{
        m: -3,
        height: "calc(100% + 48px)",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* ── LEFT PANEL ── */}
      <Box
        sx={{
          width: 260,
          flexShrink: 0,
          borderRight: "1px solid",
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {/* Report status header */}
        <Box
          sx={{
            p: "14px 24px",
            flexShrink: 0,
          }}
        >
          <Typography variant="h6" color="primary" className="ellipsis">
            {report?.name ?? "Loading…"}
          </Typography>
          {report?.evaluationMode === "agent" && (
            <Typography
              variant="caption"
              sx={{
                display: "inline-block",
                mt: 0.5,
                px: 1,
                py: 0.25,
                border: "1px solid",
                borderColor: "primary.main",
                color: "primary.main",
                letterSpacing: 1,
                fontSize: 9,
              }}
            >
              AGENT EVALUATION
            </Typography>
          )}
        </Box>

        {/* Overall progress */}
        <Box
          sx={{
            p: "16px 24px",
            borderBottom: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <Box sx={{ height: 2, bgcolor: "action.disabledBackground", mb: 1 }}>
            <Box
              sx={{
                height: "100%",
                width: `${progress}%`,
                bgcolor: "primary.main",
                transition: "width 0.5s ease",
              }}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="caption" color="text.secondary">
              {completedScenarios} / {displayTotal} completed
            </Typography>
            <Typography variant="caption" color="primary">
              {progress}%
            </Typography>
          </Box>
        </Box>

        {/* Dimension list */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: "16px 24px",
            "&::-webkit-scrollbar": { width: 3 },
            "&::-webkit-scrollbar-thumb": { bgcolor: "divider" },
          }}
        >
          {framework.dimensions.map((dim) => {
            const { completed: dDone, total: dTotal } = getDimProgress(dim);
            const dPct = dTotal > 0 ? Math.round((dDone / dTotal) * 100) : 0;
            return (
              <Box key={dim} sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.75,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ letterSpacing: 1 }}
                  >
                    {dim.toUpperCase()}
                  </Typography>
                  <Typography variant="caption" color="primary">
                    {dDone}/{dTotal}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 1,
                    bgcolor: "action.disabledBackground",
                    mb: 0.75,
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${dPct}%`,
                      bgcolor: "primary.main",
                      transition: "width 0.4s",
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
                  {report?.evaluationMode === "agent" ? (
                    /* Agent evaluation mode: show agent chip */
                    <Tooltip
                      title={agent?.agentUrl ?? ""}
                      placement="right"
                      arrow
                    >
                      <Box
                        sx={{
                          px: "6px",
                          py: "2px",
                          border: "1px solid",
                          borderColor: "primary.main",
                          color: "primary.main",
                          cursor: agent?.agentUrl ? "pointer" : "default",
                        }}
                      >
                        <Typography variant="caption">
                          {(agent?.name ?? "AGENT").toUpperCase()}
                        </Typography>
                      </Box>
                    </Tooltip>
                  ) : (
                    /* Benchmark mode: show model chips */
                    (report?.modelsToTest ?? []).map((m) => (
                      <Box
                        key={m}
                        sx={{
                          px: "6px",
                          py: "2px",
                          border: "1px solid",
                          borderColor: "divider",
                          color: "text.primary",
                        }}
                      >
                        <Typography variant="caption">
                          {m.toUpperCase()}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* ── RIGHT PANEL ── */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header stats */}
        <Box
          sx={{
            p: "16px 28px",
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="h6" color="primary">
              LIVE SCENARIO FEED
            </Typography>
            {report?.evaluationMode === "agent" && agent && (
              <Typography variant="caption" color="text.secondary">
                Evaluating:{" "}
                <Box component="span" sx={{ color: "primary.main" }}>
                  {agent.name}
                </Box>
                {agent.agentUrl && (
                  <>
                    {" "}
                    ·{" "}
                    <Box
                      component="span"
                      sx={{ fontFamily: "monospace", fontSize: 10 }}
                    >
                      {agent.agentUrl}
                    </Box>
                  </>
                )}
              </Typography>
            )}
          </Box>

          {/* Active processing indicator */}
          {runStatus === "running" && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  p: "10px 12px",
                  border: "1px solid",
                  borderColor: "primary.main",
                  my: 0.5,
                  "@keyframes pulseBorder": {
                    "0%,100%": { opacity: 0.5 },
                    "50%": { opacity: 1 },
                  },
                  animation: "pulseBorder 1.5s ease infinite",
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    "@keyframes dotPulse": {
                      "0%,100%": { opacity: 1 },
                      "50%": { opacity: 0.3 },
                    },
                    animation: "dotPulse 1s ease infinite",
                  }}
                />
                <Typography
                  sx={{ fontSize: 10, letterSpacing: 1, color: "primary.main" }}
                >
                  PROCESSING
                </Typography>
              </Box>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<StopCircleOutlined />}
                onClick={() => setStopDialogOpen(true)}
              >
                Stop
              </Button>
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 2.5 }}>
            {[
              { val: runStatus === "running" ? 1 : 0, key: "RUNNING" },
              { val: completedScenarios, key: "COMPLETE" },
              { val: avgScore, key: "AVG SCORE" },
              { val: datapoints.toLocaleString(), key: "DATAPOINTS" },
            ].map(({ val, key }) => (
              <Box key={key} sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    color: "primary.main",
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {val}
                </Typography>
                <Typography variant="caption" color="text.primary">
                  {key}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Column headers */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "56px 1fr 80px 64px 64px",
            gap: "12px",
            px: "40px",
            py: "8px",
            borderBottom: "1px solid",
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          {(["ID", "SCENARIO", "MODEL", "SCORE", "AGREEMENT"] as const).map(
            (col) => (
              <Typography
                key={col}
                variant="body2"
                sx={{
                  color: "text.disabled",
                  textAlign:
                    col === "SCORE" || col === "AGREEMENT" ? "center" : "left",
                }}
              >
                {col}
              </Typography>
            ),
          )}
        </Box>

        {/* Feed list */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: "28px",
            "&::-webkit-scrollbar": { width: 3 },
            "&::-webkit-scrollbar-thumb": { bgcolor: "divider" },
          }}
        >
          {feedItems.length === 0 && !isFinished && (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Starting up…
              </Typography>
            </Box>
          )}

          {feedItems.length === 0 && isFinished && (
            <Box sx={{ py: 4, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                No feed items recorded.
              </Typography>
            </Box>
          )}

          {feedItems.map((item, idx) => (
            <Box
              key={`${item.id}-${item.model}-${item.turn}-${idx}`}
              sx={{
                display: "grid",
                gridTemplateColumns: "56px 1fr 80px 64px 64px",
                gap: "12px",
                alignItems: "center",
                px: "12px",
                py: "9px",
                borderBottom: "1px solid",
                borderColor: "rgba(255,255,255,0.04)",
                ...(idx === 0 && {
                  "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(-4px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                  animation: "fadeIn 0.3s ease",
                }),
              }}
            >
              {/* ID */}
              <Typography variant="caption" sx={{ color: "primary.main" }}>
                {item.id.replace("#", "")}
              </Typography>
              {/* Scenario name */}
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {item.scenarioTitle ?? item.dim}
              </Typography>
              {/* Model */}
              <Typography variant="caption" color="text.primary">
                {item.model.toUpperCase()}
              </Typography>
              {/* Score */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  textAlign: "center",
                  color: scoreColor(item.score),
                }}
              >
                {item.score}
              </Typography>
              {/* Agreement */}
              <Typography
                variant="caption"
                sx={{
                  textAlign: "center",
                  color: agrColor(item.type),
                }}
              >
                {agrLabel(item.type)}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Bottom turn bar */}
        <Box
          sx={{
            flexShrink: 0,
            p: "10px 28px",
            borderTop: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* 8 turn dots */}
          <Box sx={{ display: "flex", gap: 0.5 }}>
            {turnDisplayNames.map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: 24,
                  height: 6,
                  bgcolor:
                    i < currentTurnIdx
                      ? "success.main"
                      : i === currentTurnIdx
                        ? "warning.main"
                        : "action.disabledBackground",
                  transition: "background-color 0.3s",
                  ...(i === currentTurnIdx && runStatus === "running"
                    ? {
                        "@keyframes turnDot": {
                          from: { opacity: 0.5 },
                          to: { opacity: 1 },
                        },
                        animation: "turnDot 0.8s ease infinite alternate",
                      }
                    : {}),
                }}
              />
            ))}
          </Box>
          {/* Turn type label */}
          <Typography variant="caption" color="text.primary">
            TURN:{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              {currentTurnName}
            </Box>
          </Typography>
          {/* Right side: scenario info or back button */}
          <Box
            sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 2 }}
          >
            {latestItem && !isFinished && (
              <Typography variant="caption" color="text.primary">
                {latestItem.id} ·{" "}
                {report?.evaluationMode === "agent"
                  ? (agent?.name ?? latestItem.model).toUpperCase()
                  : latestItem.model.toUpperCase()}
              </Typography>
            )}
            {isFinished && reportId && (
              <Button
                size="small"
                variant="outlined"
                color="primary"
                onClick={() =>
                  navigate(routes.dashboard.reports.reportById(reportId))
                }
              >
                Back to Report
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Stop confirmation dialog — Dialog uses a Portal so it renders at body level */}
      <Dialog
        open={stopDialogOpen}
        onClose={() => setStopDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <StopCircleOutlined color="error" fontSize="large" />
            <Typography variant="h5">Stop Report</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Are you sure you want to stop{" "}
            <strong>"{report?.name ?? "this report"}"</strong>?
            <br />
            The current run will be terminated immediately. You can re-launch
            the report at any time.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setStopDialogOpen(false)}
            disabled={isStopping}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<StopCircleOutlined />}
            onClick={handleStopConfirm}
            disabled={isStopping}
          >
            {isStopping ? "Stopping…" : "Stop Report"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardReportRun;
