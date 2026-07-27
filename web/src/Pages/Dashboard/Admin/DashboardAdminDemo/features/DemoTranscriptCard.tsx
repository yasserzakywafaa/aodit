import {
  Bolt,
  Close,
  ExpandLess,
  ExpandMore,
  Forum as ForumIcon,
  InfoOutlined,
  SmartToy,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";

import { DemoTurnResult } from "src/shared/types/demoSession";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const scoreColor = (
  score: number,
): "success" | "warning" | "error" | "default" => {
  if (score >= 4) return "success";
  if (score === 3) return "warning";
  return "error";
};

const scoreLabel = (
  score: number,
  t: (key: string) => string,
): string => {
  const labels: Record<number, string> = {
    1: t("admin.demos.scoreLabels.critical"),
    2: t("admin.demos.scoreLabels.weak"),
    3: t("admin.demos.scoreLabels.acceptable"),
    4: t("admin.demos.scoreLabels.strong"),
    5: t("admin.demos.scoreLabels.excellent"),
  };
  return labels[score] ?? String(score);
};

// Markdown renderer — styles react-markdown output to match MUI body2
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

interface ReasoningDialogState {
  open: boolean;
  reasoning: string;
  score: number;
  turnIndex: number;
}

const DemoTranscriptCard = ({ turns }: { turns: DemoTurnResult[] }) => {
  const { t } = useTranslation("dashboard");
  const [expandedTurns, setExpandedTurns] = useState<Set<number>>(
    () => new Set((turns ?? []).map((t) => t.turnIndex)),
  );
  const [reasoningDialog, setReasoningDialog] = useState<ReasoningDialogState>({
    open: false,
    reasoning: "",
    score: 0,
    turnIndex: 0,
  });

  const toggleTurn = (turnIndex: number) => {
    setExpandedTurns((prev) => {
      const next = new Set(prev);
      if (next.has(turnIndex)) {
        next.delete(turnIndex);
      } else {
        next.add(turnIndex);
      }
      return next;
    });
  };

  const openReasoning = (turn: DemoTurnResult) => {
    setReasoningDialog({
      open: true,
      reasoning: turn.evaluatorReasoning,
      score: turn.score,
      turnIndex: turn.turnIndex,
    });
  };

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2
          }}>
          <ForumIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">{t("admin.demos.transcript")}</Typography>
        </Box>

        {!turns || turns.length === 0 ? (
          <Typography variant="body2" sx={{
            color: "text.secondary"
          }}>
            {t("admin.demos.noTurns")}
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2
            }}>
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
                    onClick={() => toggleTurn(turn.turnIndex)}
                    sx={{
                      px: { xs: 1.5, sm: 2 },
                      py: { xs: 1.25, sm: 1 },
                      display: "flex",
                      alignItems: "center",
                      gap: { xs: 0.75, sm: 1 },
                      flexWrap: "wrap",
                      bgcolor: "action.hover",
                      cursor: "pointer",
                      userSelect: "none",
                      "&:hover": { bgcolor: "action.selected" }
                    }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 0.75, sm: 1 },
                        minWidth: 0,
                        flex: "1 1 auto"
                      }}>
                      {expanded ? (
                        <ExpandLess sx={{ fontSize: 18, opacity: 0.6 }} />
                      ) : (
                        <ExpandMore sx={{ fontSize: 18, opacity: 0.6 }} />
                      )}
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          flexShrink: 0
                        }}>
                        {t("admin.demos.turn", { index: turn.turnIndex })}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          display: { xs: "none", sm: "block" }
                        }}>
                        ·
                      </Typography>
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{
                          color: "text.secondary",
                          minWidth: 0,
                          maxWidth: { xs: "100%", sm: 220 },
                          textOverflow: "ellipsis",
                          overflow: "hidden"
                        }}>
                        {turn.turnType}
                      </Typography>
                    </Box>

                    {/* Score chip + reasoning button */}
                    <Box
                      sx={{
                        ml: { xs: 0, sm: "auto" },
                        width: { xs: "100%", sm: "auto" },
                        display: "flex",
                        alignItems: "center",

                        justifyContent: {
                          xs: "space-between",
                          sm: "flex-end",
                        },

                        gap: 0.75
                      }}>
                      <Chip
                        label={`${turn.score}/5 · ${scoreLabel(turn.score, t)}`}
                        color={scoreColor(turn.score)}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          maxWidth: { xs: "70%", sm: "none" },
                        }}
                      />
                      <Button
                        size="small"
                        variant="text"
                        startIcon={<InfoOutlined />}
                        aria-label={t("admin.demos.viewEvaluationDetails")}
                        onClick={(e) => {
                          e.stopPropagation();
                          openReasoning(turn);
                        }}
                        sx={{
                          minWidth: 0,
                          px: { xs: 0.75, sm: 1 },
                          fontSize: { xs: 11, sm: 12 },
                          "& .MuiButton-startIcon": {
                            mr: { xs: 0, sm: 0.5 },
                            ml: 0,
                          },
                        }}
                      >
                        <Box
                          component="span"
                          sx={{ display: { xs: "none", sm: "inline" } }}
                        >
                          {t("admin.demos.evaluation")}
                        </Box>
                      </Button>
                    </Box>
                  </Box>
                  {expanded && (
                    <>
                      {/* Adversary prompt */}
                      <Box
                        sx={{
                          px: 2,
                          py: 1.5
                        }}>
                        <Chip
                          icon={<Bolt sx={{ fontSize: 16 }} />}
                          label={t("admin.demos.adversary")}
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
                      <Box
                        sx={{
                          px: 2,
                          py: 1.5
                        }}>
                        <Chip
                          icon={<SmartToy sx={{ fontSize: 16 }} />}
                          label={t("admin.demos.agent")}
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
        )}
      </CardContent>
      {/* Reasoning dialog */}
      <Dialog
        open={reasoningDialog.open}
        onClose={() => setReasoningDialog((s) => ({ ...s, open: false }))}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "flex-start" },
            justifyContent: "space-between",
            gap: { xs: 1.25, sm: 1 },
            pb: 1.5,
            pr: { xs: 1, sm: 2 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 0.25,
              flex: 1,
              minWidth: 0,
              pr: { sm: 1 },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                lineHeight: 1.25,
                width: "100%"
              }}>
              {t("admin.demos.judgesReasoning")}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                whiteSpace: "nowrap"
              }}>
              {t("admin.demos.turn", { index: reasoningDialog.turnIndex })}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexShrink: 0,
              justifyContent: { xs: "space-between", sm: "flex-end" },
              alignSelf: { xs: "stretch", sm: "auto" },
            }}
          >
            <Chip
              label={`${reasoningDialog.score}/5 · ${scoreLabel(reasoningDialog.score, t)}`}
              color={scoreColor(reasoningDialog.score)}
              size="small"
              sx={{
                fontWeight: 700,
                maxWidth: { xs: "calc(100% - 48px)", sm: "none" },
              }}
            />
            <IconButton
              size="small"
              onClick={() =>
                setReasoningDialog((s) => ({ ...s, open: false }))
              }
              edge="end"
              aria-label={t("common:close")}
              sx={{ flexShrink: 0 }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              lineHeight: 1.7
            }}>
            {reasoningDialog.reasoning}
          </Typography>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DemoTranscriptCard;
