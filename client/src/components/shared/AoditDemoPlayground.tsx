import {
  Box,
  Button,
  Chip,
  CircularProgress,
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

import { Close, InfoOutlined } from "@mui/icons-material";
import END_POINTS from "../../application/shared/endpoints";
import ReactMarkdown from "react-markdown";
import axios from "axios";

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
  status: "pending" | "running" | "completed" | "failed";
  currentTurnIndex: number;
  turns: TurnResult[];
  rawScore: number | null;
  error: string | null;
}

// ---------------------------------------------------------------------------
// Constants — mirrors server/src/services/reports/modelRegistry.ts
// ---------------------------------------------------------------------------

const MODEL_OPTIONS: { label: string; id: string }[] = [
  { label: "GPT-4o", id: "openai/gpt-4o" },
  { label: "Claude Sonnet", id: "anthropic/claude-sonnet-4" },
  { label: "Gemini 2.5 Flash", id: "google/gemini-2.5-flash" },
  { label: "Grok 3 Mini", id: "x-ai/grok-3-mini" },
  { label: "Deepseek Chat", id: "deepseek/deepseek-chat-v3-0324" },
  { label: "Kimi K2", id: "moonshotai/kimi-k2" },
  { label: "Llama 4 Maverick", id: "meta-llama/llama-4-maverick" },
  { label: "Qwen3 30B", id: "qwen/qwen3-30b-a3b" },
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
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
        {reasoning}
      </Typography>
    </DialogContent>
  </Dialog>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const AoditDemoPlayground: React.FC = () => {
  const [systemPrompt, setSystemPrompt] = useState("");
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

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const poll = async () => {
      try {
        const res = await axios.get<DemoStatus>(
          END_POINTS.PUBLIC_DEMO.STATUS(sessionId),
        );
        setDemoStatus(res.data);
        if (res.data.status === "completed" || res.data.status === "failed") {
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

  const handleStart = async () => {
    if (!systemPrompt.trim()) return;
    setIsStarting(true);
    setStartError(null);
    setDemoStatus(null);
    setSessionId(null);

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

  const handleReset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setSessionId(null);
    setDemoStatus(null);
    setStartError(null);
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
            startIcon={isStarting ? <CircularProgress size={16} /> : undefined}
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
          <Box display="flex" alignItems="center" gap={1} mb={3} flexWrap="wrap">
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
                  <CircularProgress size={14} />
                  <Typography variant="caption" color="text.secondary">
                    Turn {activeTurnIndex}/{TOTAL_TURNS}
                  </Typography>
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
              <CircularProgress size={18} />
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
            {turns.map((turn) => (
              <Box
                key={turn.turnIndex}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                {/* Turn header */}
                <Box
                  px={2}
                  py={1}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  sx={{ bgcolor: "action.hover" }}
                >
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
                    <Tooltip title="Judge's reasoning" placement="top">
                      <IconButton
                        size="small"
                        onClick={() => openReasoning(turn)}
                        sx={{ opacity: 0.65, "&:hover": { opacity: 1 } }}
                      >
                        <InfoOutlined sx={{ fontSize: 15 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {/* Adversary prompt */}
                <Box px={2} py={1.5}>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.secondary"
                    display="block"
                    mb={0.5}
                  >
                    ADVERSARY
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {turn.prompt}
                  </Typography>
                </Box>

                <Divider />

                {/* Agent response — rendered as markdown */}
                <Box px={2} py={1.5}>
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="text.secondary"
                    display="block"
                    mb={0.5}
                  >
                    AGENT
                  </Typography>
                  <Box sx={mdSx}>
                    <ReactMarkdown>{turn.response}</ReactMarkdown>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Run another demo */}
          {(isCompleted || isFailed) && (
            <Box mt={3}>
              <Button variant="outlined" size="small" onClick={handleReset}>
                Run Another Demo
              </Button>
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
        onClose={() =>
          setReasoningDialog((s) => ({ ...s, open: false }))
        }
      />
    </Box>
  );
};

export default AoditDemoPlayground;
