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

const PIPELINE_STEPS = [
  "Generating scenarios",
  "Running conversations",
  "Evaluating responses",
  "Calculating scores",
  "Generating report",
] as const;

const FEED_SAMPLES: Array<{
  dim: string;
  model: string;
  turn: number;
  text: string;
  score: string;
  type: "pass" | "warn" | "fail";
}> = [
  {
    dim: "RELIABILITY",
    model: "CLAUDE",
    turn: 3,
    text: "Contradiction introduced — model held position correctly",
    score: "4.8",
    type: "pass",
  },
  {
    dim: "INTEGRITY",
    model: "GPT-40",
    turn: 4,
    text: "Authority pressure applied — minor capitulation observed",
    score: "3.2",
    type: "warn",
  },
  {
    dim: "RESISTANCE",
    model: "GEMINI",
    turn: 5,
    text: "Adversarial prompt — policy erosion detected",
    score: "2.1",
    type: "fail",
  },
  {
    dim: "JUDGMENT",
    model: "GROK",
    turn: 6,
    text: "Escalation scenario — proportionate response maintained",
    score: "4.1",
    type: "pass",
  },
  {
    dim: "RESILIENCE",
    model: "DEEPSEEK",
    turn: 7,
    text: "Self-assessment — mild calibration inflation noted",
    score: "3.8",
    type: "warn",
  },
];

export default function DashboardReportRun() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [progress, setProgress] = useState(0);
  const [feedItems, setFeedItems] = useState<
    Array<{
      id: string;
      dim: string;
      model: string;
      turn: number;
      text: string;
      score: string;
      type: "pass" | "warn" | "fail";
    }>
  >([]);
  const totalScenarios = (report?.scenariosPerDimension ?? 20) * 5;
  const launchedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!reportId) return;
    axios
      .get(END_POINTS.DASHBOARD.REPORTS.GET_REPORT_BY_ID, {
        params: { reportId },
      })
      .then((res) => setReport(res.data))
      .catch(() => setReport(null));
  }, [reportId]);

  useEffect(() => {
    if (!reportId || launchedRef.current || !report) return;
    launchedRef.current = true;
    axios
      .post(END_POINTS.DASHBOARD.REPORTS.LAUNCH_REPORT(reportId))
      .catch(() => {});
  }, [reportId, report]);

  useEffect(() => {
    if (!reportId || totalScenarios <= 0) return;
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.floor(Math.random() * 4) + 1, 100);
        if (next >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setTimeout(() => {
            navigate(routes.dashboard.reports.reportById(reportId));
          }, 1200);
        }
        return next;
      });
      setFeedItems((prev) => {
        const sample =
          FEED_SAMPLES[Math.floor(Math.random() * FEED_SAMPLES.length)];
        const newItem = {
          id: `#${String(Math.floor(Math.random() * 100) + 1).padStart(3, "0")}`,
          ...sample,
        };
        const next = [newItem, ...prev].slice(0, 8);
        return next;
      });
    }, 400);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [reportId, totalScenarios, navigate]);

  const currentStep =
    progress >= 100 ? 5 : progress >= 90 ? 4 : progress >= 70 ? 3 : progress >= 40 ? 2 : progress >= 20 ? 1 : 0;

  return (
    <Box sx={{ maxWidth: 740, mx: "auto", p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        AODIT RUNNING
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {report?.name ?? "Report"}
      </Typography>

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
                  i < currentStep
                    ? "success.main"
                    : i === currentStep
                      ? "primary.main"
                      : "divider",
                bgcolor:
                  i < currentStep
                    ? "success.main"
                    : i === currentStep
                      ? "action.selected"
                      : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
              }}
            >
              {i < currentStep ? "✓" : i === currentStep ? "▶" : "○"}
            </Box>
            <Typography variant="body2" sx={{ flex: 1 }}>
              {name.toUpperCase()}
            </Typography>
            <Typography
              variant="caption"
              color={
                i < currentStep
                  ? "success.main"
                  : i === currentStep
                    ? "primary.main"
                    : "text.secondary"
              }
            >
              {i < currentStep ? "DONE" : i === currentStep ? "LIVE" : "QUEUE"}
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
            {Math.round((progress / 100) * totalScenarios)} / {totalScenarios}
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
          {feedItems.map((item, idx) => (
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
