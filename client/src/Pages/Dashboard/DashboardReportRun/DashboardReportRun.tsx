import {
  Box,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { routes } from "src/application/routes";
import axios from "axios";
import END_POINTS from "src/application/shared/endpoints";
import type { Report } from "src/shared/types/report";
import type { FeedItem } from "src/shared/types/reportRun";

const PIPELINE_STEPS = [
  "Generating scenarios",
  "Running conversations",
  "Evaluating responses",
  "Calculating scores",
  "Generating report",
] as const;

const POLL_INTERVAL_MS = 3000;

function stepIndexFromName(stepName: string): number {
  const idx = PIPELINE_STEPS.findIndex(
    (s) => s.toLowerCase() === stepName.toLowerCase(),
  );
  return idx >= 0 ? idx : 0;
}

export default function DashboardReportRun() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Generating scenarios");
  const [totalScenarios, setTotalScenarios] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState(0);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [runStatus, setRunStatus] = useState<string>("pending");
  const launchedRef = useRef(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load report info
  useEffect(() => {
    if (!reportId) return;
    axios
      .get(END_POINTS.DASHBOARD.REPORTS.GET_REPORT_BY_ID, {
        params: { reportId },
      })
      .then((res) => setReport(res.data))
      .catch(() => setReport(null));
  }, [reportId]);

  // Launch the report run
  useEffect(() => {
    if (!reportId || launchedRef.current || !report) return;
    launchedRef.current = true;
    axios
      .post(END_POINTS.DASHBOARD.REPORTS.LAUNCH_REPORT(reportId))
      .catch(() => {});
  }, [reportId, report]);

  // Poll for real progress
  useEffect(() => {
    if (!reportId || !report) return;

    const poll = async () => {
      try {
        const res = await axios.get(
          END_POINTS.DASHBOARD.REPORTS.GET_RUN_STATUS(reportId),
        );
        const data = res.data;

        setProgress(data.progress ?? 0);
        setCurrentStep(data.currentStep ?? "Generating scenarios");
        setTotalScenarios(data.totalScenarios ?? 0);
        setCompletedScenarios(data.completedScenarios ?? 0);
        setRunStatus(data.status ?? "running");

        if (data.feedItems && data.feedItems.length > 0) {
          setFeedItems(data.feedItems);
        }

        if (data.status === "completed" || data.status === "failed") {
          if (pollRef.current) {
            clearInterval(pollRef.current);
            pollRef.current = null;
          }
          // Navigate back to report detail after a short delay
          setTimeout(() => {
            navigate(routes.dashboard.reports.reportById(reportId));
          }, 1500);
        }
      } catch {
        // Silently retry on next interval
      }
    };

    // Initial poll immediately
    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [reportId, report, navigate]);

  const currentStepIndex = stepIndexFromName(currentStep);
  const displayTotal = totalScenarios || (report?.scenariosPerDimension ?? 20) * 5;

  return (
    <Box sx={{ maxWidth: 740, mx: "auto", p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        AODIT RUNNING
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {report?.name ?? "Report"}
      </Typography>

      {runStatus === "failed" && (
        <Paper
          variant="outlined"
          sx={{ p: 2, mb: 3, borderColor: "error.main" }}
        >
          <Typography variant="body2" color="error.main">
            Test execution failed. Please check the report configuration and try
            again.
          </Typography>
        </Paper>
      )}

      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        {PIPELINE_STEPS.map((name, i) => (
          <Box
            key={name}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              py: 1,
              borderBottom:
                i < PIPELINE_STEPS.length - 1 ? 1 : 0,
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                border: "1px solid",
                borderColor:
                  i < currentStepIndex
                    ? "success.main"
                    : i === currentStepIndex
                      ? "primary.main"
                      : "divider",
                bgcolor:
                  i < currentStepIndex
                    ? "success.main"
                    : i === currentStepIndex
                      ? "action.selected"
                      : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
              }}
            >
              {i < currentStepIndex ? "✓" : i === currentStepIndex ? "▶" : "○"}
            </Box>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {name.toUpperCase()}
            </Typography>
            <Typography
              variant="caption"
              color={
                i < currentStepIndex
                  ? "success.main"
                  : i === currentStepIndex
                    ? "primary.main"
                    : "text.secondary"
              }
            >
              {i < currentStepIndex ? "DONE" : i === currentStepIndex ? "LIVE" : "QUEUE"}
            </Typography>
          </Box>
        ))}
      </Paper>

      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 0.5,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            SCENARIOS COMPLETE
          </Typography>
          <Typography variant="caption" color="primary">
            {completedScenarios} / {displayTotal}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 4 }}
        />
      </Box>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          LIVE FEED
        </Typography>
        <Box sx={{ maxHeight: 320, overflow: "auto" }}>
          {feedItems.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Starting…
            </Typography>
          )}
          {feedItems.map((item: FeedItem, idx: number) => (
            <Box
              key={idx}
              sx={{
                py: 1.5,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography variant="caption" color="primary">
                {item.id} {item.dim} · {item.model} · TURN {item.turn}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.text}
              </Typography>
              <Typography
                variant="caption"
                color={
                  item.type === "pass"
                    ? "success.main"
                    : item.type === "warn"
                      ? "warning.main"
                      : "error.main"
                }
              >
                SCORE: {item.score} {item.type === "pass" ? "✓" : item.type === "warn" ? "⚠" : "✗"}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
