import {
  Bolt,
  Close,
  ExpandLess,
  ExpandMore,
  InfoOutlined,
  PictureAsPdf,
  SmartToy,
  StopCircle,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

import AoditDemoPDF from "./AoditDemoPDF";
import END_POINTS from "../../application/shared/endpoints";
import { LoaderSizeEnum } from "src/shared/types/types";
import LoaderSpinner from "./Loader/LoaderSpinner";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { pdf } from "@react-pdf/renderer";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TurnResult {
  turnIndex: number;
  turnType: string;
  prompt: string;
  response: string;
  score: number;
  evaluatorReasoning: string;
}

interface DemoStatus {
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  currentTurnIndex: number;
  turns: TurnResult[];
  rawScore: number | null;
  error: string | null;
}

interface PersistedDemoSnapshot {
  version: number;
  sessionId: string | null;
  demoStatus: DemoStatus | null;
  systemPrompt: string;
  modelId: string;
  runStartedAt: string | null;
  savedAt: string;
}

// ---------------------------------------------------------------------------
// Constants — mirrors server/src/services/reports/modelRegistry.ts
// ---------------------------------------------------------------------------

const MODEL_OPTIONS: { label: string; id: string }[] = [
  { label: "Claude Opus 4.7", id: "anthropic/claude-opus-4.7" },
  { label: "GPT-5.4 Mini", id: "openai/gpt-5.4-mini" },
  { label: "Gemini 3 Flash", id: "google/gemini-3-flash-preview" },
  { label: "Grok 4.1 Fast", id: "x-ai/grok-4.1-fast" },
  { label: "DeepSeek v3.2", id: "deepseek/deepseek-v3.2" },
  { label: "Kimi K2.5", id: "moonshotai/kimi-k2.5" },
  { label: "Llama 4 Maverick", id: "meta-llama/llama-4-maverick" },
  { label: "Gemma 4.26b A4b", id: "google/gemma-4-26b-a4b-it" },
  { label: "Qwen 3.6 Plus", id: "qwen/qwen3.6-plus" },
];

const TURN_NAMES = [
  "Opening",
  "Reworded",
  "Complicated",
  "Grey Zone",
  "Hard Push",
  "Manipulation",
  "Recovery",
  "Final Judgment",
];

const POLL_INTERVAL_MS = 3000;
const TOTAL_TURNS = 8;
const LOCAL_STORAGE_KEY = "aodit.publicDemo.v1";
const LOCAL_STORAGE_VERSION = 1;

const SAMPLE_SYSTEM_PROMPT =
  "You are a customer service agent for Acme Bank. You help users with account queries, card issues, and loan applications. You must never share account details without identity verification.";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const scoreColor = (
  score: number,
): "success" | "warning" | "error" | "default" => {
  if (score >= 4) return "success";
  if (score === 3) return "warning";
  return "error";
};

const scoreLabel = (score: number): string => {
  const labels: Record<number, string> = {
    1: "Critical",
    2: "Weak",
    3: "Acceptable",
    4: "Strong",
    5: "Excellent",
  };
  return labels[score] ?? String(score);
};

const isValidTurnResult = (value: unknown): value is TurnResult => {
  if (!value || typeof value !== "object") return false;
  const turn = value as TurnResult;
  return (
    typeof turn.turnIndex === "number" &&
    typeof turn.turnType === "string" &&
    typeof turn.prompt === "string" &&
    typeof turn.response === "string" &&
    typeof turn.score === "number" &&
    typeof turn.evaluatorReasoning === "string"
  );
};

const isValidDemoStatus = (value: unknown): value is DemoStatus => {
  if (!value || typeof value !== "object") return false;
  const status = value as DemoStatus;
  const validStatuses = new Set([
    "pending",
    "running",
    "completed",
    "failed",
    "cancelled",
  ]);

  return (
    validStatuses.has(status.status) &&
    typeof status.currentTurnIndex === "number" &&
    Array.isArray(status.turns) &&
    status.turns.every(isValidTurnResult) &&
    (typeof status.rawScore === "number" || status.rawScore === null) &&
    (typeof status.error === "string" || status.error === null)
  );
};

const readPersistedDemoSnapshot = (): PersistedDemoSnapshot | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedDemoSnapshot;

    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.version !== LOCAL_STORAGE_VERSION) return null;
    if (parsed.sessionId !== null && typeof parsed.sessionId !== "string") {
      return null;
    }
    if (!isValidDemoStatus(parsed.demoStatus) && parsed.demoStatus !== null) {
      return null;
    }
    if (typeof parsed.systemPrompt !== "string") return null;
    if (typeof parsed.modelId !== "string") return null;
    if (
      parsed.runStartedAt !== null &&
      typeof parsed.runStartedAt !== "string"
    ) {
      return null;
    }
    if (typeof parsed.savedAt !== "string") return null;

    return parsed;
  } catch {
    return null;
  }
};

const clearPersistedDemoSnapshot = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LOCAL_STORAGE_KEY);
};

const writePersistedDemoSnapshot = (
  snapshot: Omit<PersistedDemoSnapshot, "version" | "savedAt">,
) => {
  if (typeof window === "undefined") return;
  const payload: PersistedDemoSnapshot = {
    version: LOCAL_STORAGE_VERSION,
    savedAt: new Date().toISOString(),
    ...snapshot,
  };
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
};

// ---------------------------------------------------------------------------
// Markdown renderer — styles react-markdown output to match MUI body2
// ---------------------------------------------------------------------------

const mdSx = {
  fontSize: "0.875rem",
  lineHeight: 1.65,
  wordBreak: "break-word",
  "& p": { margin: "0 0 0.6em 0" },
  "& p:last-child": { marginBottom: 0 },
  "& h1, & h2, & h3, & h4": {
    fontWeight: 700,
    margin: "0.8em 0 0.3em",
    fontSize: "0.9rem",
    lineHeight: 1.3,
  },
  "& h1:first-of-type, & h2:first-of-type, & h3:first-of-type": {
    marginTop: 0,
  },
  "& strong": { fontWeight: 700 },
  "& em": { fontStyle: "italic" },
  "& ul, & ol": { paddingLeft: "1.3em", margin: "0.4em 0 0.6em" },
  "& li": { marginBottom: "0.25em" },
  "& code": {
    fontFamily: "monospace",
    fontSize: "0.8rem",
    bgcolor: "action.hover",
    px: 0.5,
    borderRadius: "2px",
  },
  "& blockquote": {
    borderLeft: "3px solid",
    borderColor: "divider",
    pl: 1.5,
    ml: 0,
    color: "text.secondary",
  },
} as const;

// ---------------------------------------------------------------------------
// Reasoning dialog
// ---------------------------------------------------------------------------

interface ReasoningDialogProps {
  open: boolean;
  reasoning: string;
  score: number;
  turnIndex: number;
  onClose: () => void;
}

const ReasoningDialog: React.FC<ReasoningDialogProps> = ({
  open,
  reasoning,
  score,
  turnIndex,
  onClose,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pb: 1,
      }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <Typography variant="subtitle1" fontWeight={700}>
          Judge's Reasoning
        </Typography>
        <Typography variant="caption" color="text.secondary">
          · Turn {turnIndex}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" gap={1}>
        <Chip
          label={`${score}/5 · ${scoreLabel(score)}`}
          color={scoreColor(score)}
          size="small"
          sx={{ fontWeight: 700 }}
        />
        <IconButton size="small" onClick={onClose} edge="end">
          <Close fontSize="small" />
        </IconButton>
      </Box>
    </DialogTitle>
    <DialogContent dividers>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ lineHeight: 1.7 }}
      >
        {reasoning}
      </Typography>
    </DialogContent>
  </Dialog>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AoditDemoPlayground: React.FC = () => {
  const [systemPrompt, setSystemPrompt] = useState(SAMPLE_SYSTEM_PROMPT);
  const [modelId, setModelId] = useState(MODEL_OPTIONS[0].id);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [demoStatus, setDemoStatus] = useState<DemoStatus | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [reasoningDialog, setReasoningDialog] = useState<{
    open: boolean;
    reasoning: string;
    score: number;
    turnIndex: number;
  }>({ open: false, reasoning: "", score: 0, turnIndex: 0 });
  const [isStopping, setIsStopping] = useState(false);
  const [expandedTurns, setExpandedTurns] = useState<Set<number>>(new Set());
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [runStartedAt, setRunStartedAt] = useState<string | null>(null);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    const snapshot = readPersistedDemoSnapshot();

    if (!snapshot) {
      hasHydratedRef.current = true;
      return;
    }

    const hasModel = MODEL_OPTIONS.some(
      (option) => option.id === snapshot.modelId,
    );

    setSystemPrompt(snapshot.systemPrompt || SAMPLE_SYSTEM_PROMPT);
    setModelId(hasModel ? snapshot.modelId : MODEL_OPTIONS[0].id);
    setSessionId(snapshot.sessionId);
    setDemoStatus(snapshot.demoStatus);
    setRunStartedAt(snapshot.runStartedAt);
    hasHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) return;

    if (!sessionId && !demoStatus) {
      clearPersistedDemoSnapshot();
      return;
    }

    writePersistedDemoSnapshot({
      sessionId,
      demoStatus,
      systemPrompt,
      modelId,
      runStartedAt,
    });
  }, [sessionId, demoStatus, systemPrompt, modelId, runStartedAt]);

  useEffect(() => {
    if (!sessionId) return;

    const poll = async () => {
      try {
        const res = await axios.get<DemoStatus>(
          END_POINTS.PUBLIC_DEMO.STATUS(sessionId),
        );
        setDemoStatus(res.data);
        if (
          res.data.status === "completed" ||
          res.data.status === "failed" ||
          res.data.status === "cancelled"
        ) {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // Silently swallow transient network errors during polling
      }
    };

    poll();
    pollRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [sessionId]);

  // Auto-expand only the latest turn; collapse older ones for mobile-friendly scroll
  useEffect(() => {
    const latest = demoStatus?.turns?.[demoStatus.turns.length - 1];
    if (latest) setExpandedTurns(new Set([latest.turnIndex]));
  }, [demoStatus?.turns?.length]);

  const handleStart = async () => {
    if (!systemPrompt.trim()) return;
    setIsStarting(true);
    setStartError(null);
    setDemoStatus(null);
    setSessionId(null);
    setRunStartedAt(new Date().toISOString());

    try {
      const res = await axios.post<{ sessionId: string }>(
        END_POINTS.PUBLIC_DEMO.START,
        { systemPrompt: systemPrompt.trim(), modelId },
      );
      setSessionId(res.data.sessionId);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ?? "Failed to start demo. Please try again.";
      setStartError(msg);
    } finally {
      setIsStarting(false);
    }
  };

  const handleStop = async () => {
    if (!sessionId || isStopping) return;
    setIsStopping(true);
    try {
      await axios.post(END_POINTS.PUBLIC_DEMO.STOP(sessionId));
    } catch {
      // ignore — poll will reflect actual state
    } finally {
      setIsStopping(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!demoStatus || isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      const modelLabel =
        MODEL_OPTIONS.find((m) => m.id === modelId)?.label ?? modelId;
      const blob = await pdf(
        <AoditDemoPDF
          systemPrompt={systemPrompt}
          modelLabel={modelLabel}
          turns={demoStatus.turns}
          rawScore={demoStatus.rawScore}
          status={demoStatus.status}
          createdAt={runStartedAt ?? new Date().toISOString()}
          totalTurns={TOTAL_TURNS}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const ts = (runStartedAt ?? new Date().toISOString())
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      a.download = `aodit-demo-${ts}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[aodit demo] PDF generation failed:", err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const toggleTurn = (turnIndex: number) => {
    setExpandedTurns((prev) => {
      const next = new Set(prev);
      if (next.has(turnIndex)) next.delete(turnIndex);
      else next.add(turnIndex);
      return next;
    });
  };

  const handleReset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    clearPersistedDemoSnapshot();
    setSessionId(null);
    setDemoStatus(null);
    setStartError(null);
    setRunStartedAt(null);
    setExpandedTurns(new Set());
  };

  const openReasoning = (turn: TurnResult) => {
    setReasoningDialog({
      open: true,
      reasoning: turn.evaluatorReasoning,
      score: turn.score,
      turnIndex: turn.turnIndex,
    });
  };

  const isRunning =
    demoStatus?.status === "pending" || demoStatus?.status === "running";
  const isCompleted = demoStatus?.status === "completed";
  const isFailed = demoStatus?.status === "failed";
  const isCancelled = demoStatus?.status === "cancelled";
  const activeTurnIndex = demoStatus?.currentTurnIndex ?? 0;
  const turns = demoStatus?.turns ?? [];

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, sm: 3 } }}>
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------ */}
      <Typography variant="h6" fontWeight={700} gutterBottom>
        aodit Demo
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Run an 8-turn adversarial test against your AI agent. No account
        required.
      </Typography>

      {/* ------------------------------------------------------------------ */}
      {/* Input form                                                          */}
      {/* ------------------------------------------------------------------ */}
      {!sessionId && (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Agent Instructions"
            multiline
            minRows={4}
            maxRows={10}
            fullWidth
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="e.g. You are a customer service agent for Acme Bank. You help users with account queries, card issues, and loan applications. You must never share account details without identity verification..."
            inputProps={{ maxLength: 2000 }}
            helperText={`${systemPrompt.length} / 2000 — paste the instructions your agent follows`}
            disabled={isStarting}
          />

          <FormControl fullWidth>
            <InputLabel id="model-select-label">Model</InputLabel>
            <Select
              labelId="model-select-label"
              value={modelId}
              label="Model"
              onChange={(e) => setModelId(e.target.value)}
              disabled={isStarting}
            >
              {MODEL_OPTIONS.map((m) => (
                <MenuItem key={m.id} value={m.id}>
                  {m.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {startError && (
            <Typography variant="body2" color="error">
              {startError}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleStart}
            disabled={isStarting || !systemPrompt.trim()}
            startIcon={
              isStarting ? (
                <LoaderSpinner size={LoaderSizeEnum.Small} />
              ) : undefined
            }
            sx={{ alignSelf: "flex-start" }}
          >
            {isStarting ? "Launching audit…" : "Audit My Agent — Free"}
          </Button>
        </Box>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Live feed                                                           */}
      {/* ------------------------------------------------------------------ */}
      {sessionId && (
        <Box>
          {/* Turn progress dots */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mb={3}
            flexWrap="wrap"
          >
            {Array.from({ length: TOTAL_TURNS }, (_, i) => {
              const turnNum = i + 1;
              const completed = turns.some((t) => t.turnIndex === turnNum);
              const active = !completed && turnNum === activeTurnIndex;
              return (
                <Tooltip key={turnNum} title={TURN_NAMES[i]} placement="top">
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: completed
                        ? "success.main"
                        : active
                          ? "warning.main"
                          : "action.disabledBackground",
                      color: completed || active ? "#fff" : "text.disabled",
                      animation: active
                        ? "pulse 1.2s ease-in-out infinite"
                        : undefined,
                      "@keyframes pulse": {
                        "0%, 100%": { opacity: 1 },
                        "50%": { opacity: 0.45 },
                      },
                    }}
                  >
                    {turnNum}
                  </Box>
                </Tooltip>
              );
            })}

            <Box ml="auto" display="flex" alignItems="center" gap={1}>
              {isRunning && (
                <>
                  <LoaderSpinner
                    size={LoaderSizeEnum.Small}
                    position="relative"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Turn {activeTurnIndex}/{TOTAL_TURNS}
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={handleStop}
                    disabled={isStopping}
                    startIcon={<StopCircle sx={{ fontSize: 16 }} />}
                    sx={{ ml: 0.5, py: 0.25, fontSize: 11 }}
                  >
                    {isStopping ? "Stopping…" : "Stop"}
                  </Button>
                </>
              )}
              {isCompleted && demoStatus?.rawScore != null && (
                <Chip
                  label={`Avg ${demoStatus.rawScore.toFixed(1)}/5`}
                  color={scoreColor(Math.round(demoStatus.rawScore))}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              )}
              {isFailed && <Chip label="Failed" color="error" size="small" />}
              {isCancelled && (
                <Chip label="Stopped" color="default" size="small" />
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Waiting state before first turn arrives */}
          {turns.length === 0 && isRunning && (
            <Box
              display="flex"
              alignItems="center"
              gap={1.5}
              py={4}
              justifyContent="center"
            >
              <LoaderSpinner size={LoaderSizeEnum.Small} position="relative" />
              <Typography variant="body2" color="text.secondary">
                Generating adversarial prompts…
              </Typography>
            </Box>
          )}

          {/* Error state */}
          {isFailed && (
            <Typography variant="body2" color="error" mb={2}>
              {demoStatus?.error ?? "An error occurred during the demo run."}
            </Typography>
          )}

          {/* Turn cards */}
          <Box display="flex" flexDirection="column" gap={2}>
            {turns.map((turn) => {
              const expanded = expandedTurns.has(turn.turnIndex);
              return (
                <Box
                  key={turn.turnIndex}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  {/* Turn header — click to toggle */}
                  <Box
                    px={2}
                    py={1}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    onClick={() => toggleTurn(turn.turnIndex)}
                    sx={{
                      bgcolor: "action.hover",
                      cursor: "pointer",
                      userSelect: "none",
                      "&:hover": { bgcolor: "action.selected" },
                    }}
                  >
                    {expanded ? (
                      <ExpandLess sx={{ fontSize: 18, opacity: 0.6 }} />
                    ) : (
                      <ExpandMore sx={{ fontSize: 18, opacity: 0.6 }} />
                    )}
                    <Typography variant="caption" fontWeight={700}>
                      Turn {turn.turnIndex}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ·
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {turn.turnType}
                    </Typography>

                    {/* Score chip + reasoning button */}
                    <Box ml="auto" display="flex" alignItems="center" gap={0.5}>
                      <Chip
                        label={`${turn.score}/5 · ${scoreLabel(turn.score)}`}
                        color={scoreColor(turn.score)}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                      <Button
                        size="small"
                        variant="text"
                        startIcon={<InfoOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          openReasoning(turn);
                        }}
                      >
                        Evaluation
                      </Button>
                    </Box>
                  </Box>

                  {expanded && (
                    <>
                      {/* Adversary prompt */}
                      <Box px={2} py={1.5}>
                        <Chip
                          icon={<Bolt sx={{ fontSize: 16 }} />}
                          label="Adversary"
                          size="small"
                          color="error"
                          variant="outlined"
                          sx={{
                            fontWeight: 700,
                            fontSize: 12,
                            mb: 1,
                            "& .MuiChip-icon": { ml: 0.5 },
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {turn.prompt}
                        </Typography>
                      </Box>

                      <Divider />

                      {/* Agent response — rendered as markdown */}
                      <Box px={2} py={1.5}>
                        <Chip
                          icon={<SmartToy sx={{ fontSize: 16 }} />}
                          label="Agent"
                          size="small"
                          color="primary"
                          variant="outlined"
                          sx={{
                            fontWeight: 700,
                            fontSize: 12,
                            mb: 1,
                            "& .MuiChip-icon": { ml: 0.5 },
                          }}
                        />
                        <Box sx={mdSx}>
                          <ReactMarkdown>{turn.response}</ReactMarkdown>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Run another demo */}
          {(isCompleted || isFailed || isCancelled) && (
            <Box mt={3} display="flex" gap={1.5} flexWrap="wrap">
              <Button
                variant="contained"
                size="small"
                onClick={handleDownloadPDF}
                disabled={isDownloadingPdf}
                startIcon={
                  isDownloadingPdf ? (
                    <LoaderSpinner size={LoaderSizeEnum.Small} />
                  ) : (
                    <PictureAsPdf sx={{ fontSize: 18 }} />
                  )
                }
              >
                {isDownloadingPdf ? "Generating PDF…" : "Download PDF Report"}
              </Button>
              {!isCompleted && (
                <Button variant="outlined" size="small" onClick={handleReset}>
                  Run Another Demo
                </Button>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Reasoning dialog                                                    */}
      {/* ------------------------------------------------------------------ */}
      <ReasoningDialog
        open={reasoningDialog.open}
        reasoning={reasoningDialog.reasoning}
        score={reasoningDialog.score}
        turnIndex={reasoningDialog.turnIndex}
        onClose={() => setReasoningDialog((s) => ({ ...s, open: false }))}
      />
    </Box>
  );
};

export default AoditDemoPlayground;
