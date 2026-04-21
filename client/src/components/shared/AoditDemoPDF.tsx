/**
 * AoditDemoPDF — lightweight demo report PDF.
 * Mirrors the visual style of AoditReportPDF (logo, header bar, brand colors)
 * but only renders the data available from a public DemoSession.
 * Intentionally omits dimensional deep-dive / executive summary — paid-tier signals.
 */

import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

import React from "react";
import aoditLogo from "src/assets/images/aodit_logo.png";

// ─── Brand tokens (mirrored from AoditReportPDF) ────────────────────────────
const GREEN = "#00c278";
const DARK = "#0A0A0A";
const CREAM = "#F7F5F0";
const PASS_GREEN = "#15803D";
const NOTE_AMBER = "#B45309";
const FAIL_RED = "#B91C1C";
const PASS_BG = "#DCFCE7";
const NOTE_BG = "#FEF3C7";
const FAIL_BG = "#FEE2E2";
const MID_GRAY = "#6B7280";
const LIGHT_GRAY = "#F3F4F6";
const TEXT = "#111827";

// Header height = paddingVertical(12)*2 + logo(40) = 64pt.
// Page paddingTop must equal this so content on every page starts below the header.
const HEADER_HEIGHT = 64;
const FOOTER_BOTTOM = 50;

// ─── Types ──────────────────────────────────────────────────────────────────
export interface DemoPDFTurn {
  turnIndex: number;
  turnType: string;
  prompt: string;
  response: string;
  score: number;
  evaluatorReasoning: string;
}

export interface AoditDemoPDFProps {
  systemPrompt: string;
  modelLabel: string;
  turns: DemoPDFTurn[];
  rawScore: number | null;
  status: "completed" | "cancelled" | "failed" | "running" | "pending";
  createdAt: string;
  totalTurns?: number;
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: TEXT,
    backgroundColor: "#FFFFFF",
    // paddingTop reserves space for the absolutely-positioned fixed header on every page
    paddingTop: HEADER_HEIGHT,
    paddingBottom: FOOTER_BOTTOM,
  },
  // Header is absolutely positioned so it sits on top of paddingTop space on every page
  headerBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: DARK,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 12,
    height: HEADER_HEIGHT,
  },
  headerBarRight: { color: "#FFFFFF", fontSize: 8, letterSpacing: 1.5 },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 7, color: MID_GRAY },
  footerCta: { fontSize: 7, color: GREEN, fontFamily: "Helvetica-Bold" },
  body: { paddingHorizontal: 32, paddingTop: 20 },

  // Cover
  coverEyebrow: {
    color: GREEN,
    fontSize: 9,
    letterSpacing: 2,
    fontFamily: "Helvetica-Bold",
    marginBottom: 14,
    marginTop: 8,
  },
  coverTitle: {
    color: DARK,
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  coverSubtitle: { color: MID_GRAY, fontSize: 11, marginBottom: 28 },

  metaCard: {
    backgroundColor: CREAM,
    borderLeftWidth: 4,
    borderLeftColor: GREEN,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  metaRow: { flexDirection: "row", marginBottom: 5 },
  metaLabel: {
    width: 110,
    fontSize: 8,
    color: MID_GRAY,
    letterSpacing: 1,
    fontFamily: "Helvetica-Bold",
  },
  metaValue: { fontSize: 10, color: TEXT, flex: 1 },

  scoreBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 12,
    marginBottom: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: DARK,
  },
  scoreNum: { color: GREEN, fontSize: 44, fontFamily: "Helvetica-Bold" },
  scoreLabelStack: { flexDirection: "column" },
  scoreLabelTop: {
    color: "#FFFFFF",
    fontSize: 9,
    letterSpacing: 2,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  scoreLabelBottom: { color: "#FFFFFF", fontSize: 11 },

  // Section headings
  sectionRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    marginBottom: 10,
    marginTop: 6,
  },
  sectionNum: { color: GREEN, fontSize: 15, fontFamily: "Helvetica-Bold" },
  sectionTitle: { color: DARK, fontSize: 12, fontFamily: "Helvetica-Bold" },

  // Summary
  summaryText: {
    fontSize: 9.5,
    color: TEXT,
    lineHeight: 1.6,
    marginBottom: 12,
  },

  // Score bar row
  barRow: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  barLabel: { width: 100, fontSize: 8, color: MID_GRAY },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: LIGHT_GRAY,
    borderRadius: 2,
    marginRight: 8,
  },
  barFill: { height: 8, borderRadius: 2 },
  barValue: {
    width: 28,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },

  // Turn card
  turnCard: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 14,
  },
  turnHeader: {
    backgroundColor: LIGHT_GRAY,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  turnNum: { fontSize: 10, fontFamily: "Helvetica-Bold", color: DARK },
  turnType: { fontSize: 9, color: MID_GRAY, marginLeft: 8 },
  scoreBadge: {
    marginLeft: "auto",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  speakerChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    marginBottom: 6,
  },
  turnSection: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 10 },
  turnDivider: { height: 1, backgroundColor: "#E5E7EB" },
  turnText: { fontSize: 9, color: TEXT, lineHeight: 1.55 },
  reasoningBox: {
    backgroundColor: NOTE_BG,
    borderLeftWidth: 3,
    borderLeftColor: NOTE_AMBER,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  reasoningLabel: {
    fontSize: 8,
    color: NOTE_AMBER,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    marginBottom: 4,
  },

  // Full-report upsell (mirrors DemoCompletionUpsell in AoditDemoPlayground)
  upsellCard: {
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderLeftWidth: 4,
    borderLeftColor: GREEN,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
    paddingBottom: 4,
  },
  upsellHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  upsellAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PASS_BG,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  upsellAvatarGlyph: {
    fontSize: 14,
    color: GREEN,
    fontFamily: "Helvetica-Bold",
  },
  upsellTitle: {
    flex: 1,
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    lineHeight: 1.35,
  },
  upsellBody: {
    fontSize: 9.5,
    color: MID_GRAY,
    lineHeight: 1.65,
    paddingHorizontal: 14,
    marginTop: 10,
  },
  upsellEmphasis: {
    fontFamily: "Helvetica-Bold",
    color: TEXT,
  },
  upsellBrand: {
    fontFamily: "Helvetica-Bold",
    color: GREEN,
  },
  upsellActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
  },
  upsellCtaWrap: {
    backgroundColor: GREEN,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 3,
    alignItems: "center",
  },
  upsellCtaText: {
    color: DARK,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  upsellCtaUrl: {
    marginTop: 5,
    fontSize: 7,
    color: GREEN,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
});

// ─── Markdown renderer ───────────────────────────────────────────────────────
// react-pdf doesn't support HTML/markdown natively, so we parse it manually.

interface InlineToken {
  kind: "text" | "bold" | "italic" | "code";
  text: string;
}

const parseInline = (text: string): InlineToken[] => {
  const tokens: InlineToken[] = [];
  // Match **bold**, *italic*, `code` (in that priority order)
  const re = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last)
      tokens.push({ kind: "text", text: text.slice(last, m.index) });
    if (m[0].startsWith("**")) tokens.push({ kind: "bold", text: m[2] });
    else if (m[0].startsWith("*")) tokens.push({ kind: "italic", text: m[3] });
    else tokens.push({ kind: "code", text: m[4] });
    last = re.lastIndex;
  }
  if (last < text.length) tokens.push({ kind: "text", text: text.slice(last) });
  return tokens;
};

const INLINE_STYLES: Record<Exclude<InlineToken["kind"], "text">, Style> = {
  bold: { fontFamily: "Helvetica-Bold" },
  italic: { fontFamily: "Helvetica-Oblique" },
  code: { fontFamily: "Courier", fontSize: 8 },
};

const InlineText = ({
  text,
  baseStyle,
}: {
  text: string;
  baseStyle: Style;
}): React.ReactElement => {
  const tokens = parseInline(text);
  if (tokens.length === 1 && tokens[0].kind === "text") {
    return <Text style={baseStyle}>{text}</Text>;
  }
  return (
    <Text style={baseStyle}>
      {tokens.map((t, i) =>
        t.kind === "text" ? (
          <Text key={i}>{t.text}</Text>
        ) : (
          <Text key={i} style={INLINE_STYLES[t.kind]}>
            {t.text}
          </Text>
        ),
      )}
    </Text>
  );
};

const renderList = (
  items: string[],
  baseStyle: Style,
  marker: (index: number) => string,
  markerWidth: number,
  keyPrefix: string,
): React.ReactElement => (
  <View key={keyPrefix} style={{ marginBottom: 4 }}>
    {items.map((item, j) => (
      <View
        key={j}
        style={{ flexDirection: "row", marginBottom: 2, paddingLeft: 4 }}
      >
        <Text style={{ ...baseStyle, width: markerWidth }}>{marker(j)}</Text>
        <InlineText text={item} baseStyle={{ ...baseStyle, flex: 1 }} />
      </View>
    ))}
  </View>
);

const MarkdownBlocks = ({
  raw,
  baseStyle,
}: {
  raw: string;
  baseStyle: Style;
}): React.ReactElement => {
  const lines = raw.split("\n");
  const blocks: React.ReactElement[] = [];
  let i = 0;

  const collectListItems = (re: RegExp): string[] => {
    const items: string[] = [];
    while (i < lines.length && re.test(lines[i].trim())) {
      items.push(lines[i].trim().replace(re, ""));
      i++;
    }
    return items;
  };

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // ── Heading: # / ## / ###
    const hMatch = trimmed.match(/^(#{1,3})\s+(.*)/);
    if (hMatch) {
      const level = hMatch[1].length;
      const fontSize = level === 1 ? 12 : level === 2 ? 11 : 10;
      blocks.push(
        <Text
          key={`h-${i}`}
          style={{
            ...baseStyle,
            fontSize,
            fontFamily: "Helvetica-Bold",
            marginTop: 8,
            marginBottom: 3,
          }}
        >
          {hMatch[2]}
        </Text>,
      );
      i++;
      continue;
    }

    // ── Bullet list
    if (/^[-*+]\s/.test(trimmed)) {
      const items = collectListItems(/^[-*+]\s+/);
      blocks.push(renderList(items, baseStyle, () => "•", 10, `ul-${i}`));
      continue;
    }

    // ── Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      const items = collectListItems(/^\d+\.\s+/);
      blocks.push(
        renderList(items, baseStyle, (j) => `${j + 1}.`, 16, `ol-${i}`),
      );
      continue;
    }

    // ── Fenced code block
    if (trimmed.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push(
        <View
          key={`code-${i}`}
          style={{
            backgroundColor: LIGHT_GRAY,
            paddingHorizontal: 8,
            paddingVertical: 6,
            marginBottom: 6,
          }}
        >
          <Text
            style={{ ...baseStyle, fontFamily: "Courier", fontSize: 8 }}
          >
            {codeLines.join("\n")}
          </Text>
        </View>,
      );
      continue;
    }

    // ── Horizontal rule
    if (/^(-{3,}|\*{3,})$/.test(trimmed)) {
      blocks.push(
        <View
          key={`hr-${i}`}
          style={{ height: 1, backgroundColor: "#E5E7EB", marginVertical: 6 }}
        />,
      );
      i++;
      continue;
    }

    // ── Paragraph: collect consecutive non-special lines
    const paragraphLines: string[] = [];
    while (i < lines.length) {
      const l = lines[i].trim();
      if (!l || /^(#{1,3}\s|[-*+]\s|\d+\.\s|```|-{3,}|\*{3,})/.test(l)) break;
      paragraphLines.push(l);
      i++;
    }
    const paraText = paragraphLines.join(" ");
    if (paraText) {
      blocks.push(
        <View key={`p-${i}`} style={{ marginBottom: 5 }}>
          <InlineText text={paraText} baseStyle={baseStyle} />
        </View>,
      );
    }
  }

  return <View>{blocks}</View>;
};

// ─── Helpers ────────────────────────────────────────────────────────────────
const scoreTone = (score: number) => {
  if (score >= 4) return { fg: PASS_GREEN, bg: PASS_BG };
  if (score === 3) return { fg: NOTE_AMBER, bg: NOTE_BG };
  return { fg: FAIL_RED, bg: FAIL_BG };
};

const scoreLabelText = (score: number): string => {
  const map: Record<number, string> = {
    1: "Critical",
    2: "Weak",
    3: "Acceptable",
    4: "Strong",
    5: "Excellent",
  };
  return map[score] ?? String(score);
};

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const statusLabel = (status: AoditDemoPDFProps["status"]): string => {
  switch (status) {
    case "completed":
      return "Completed";
    case "cancelled":
      return "Stopped manually";
    case "failed":
      return "Failed";
    default:
      return "In progress";
  }
};

// ─── Subcomponents ──────────────────────────────────────────────────────────
const PageHeader = () => (
  <View style={s.headerBar} fixed>
    <Image src={aoditLogo} style={{ width: 40, height: 40 }} />
    <Text style={s.headerBarRight}>aodit.ai · Demo Audit</Text>
  </View>
);

const PageFooter = () => (
  <View style={s.footer} fixed>
    <Text style={s.footerText}>
      Swiss Lab of Intelligence (SwissLII AG) · aodit.ai
    </Text>
    <Text style={s.footerCta}>Want the full audit? Visit aodit.ai</Text>
    <Text
      style={s.footerText}
      render={({ pageNumber, totalPages }) =>
        `Page ${pageNumber} / ${totalPages}`
      }
    />
  </View>
);

/** Matches the in-app DemoCompletionUpsell card (completed demos only). */
const DemoCompletionUpsellPDF = () => (
  <View style={s.upsellCard}>
    <View style={s.upsellHeaderRow} wrap={false}>
      <View style={s.upsellAvatar}>
        <Text style={s.upsellAvatarGlyph}>↗</Text>
      </View>
      <Text style={s.upsellTitle}>You got a taste — not the full meal.</Text>
    </View>

    <Text style={s.upsellBody}>
      <Text>Eight turns, </Text>
      <Text style={s.upsellEmphasis}>one</Text>
      <Text>
        {" "}
        adversarial storyline: enough to feel how we probe your agent, not
        enough to call the job done. That is the point of the sandbox — quick
        signal, low commitment.
      </Text>
    </Text>

    <Text style={{ ...s.upsellBody, marginTop: 8 }}>
      <Text>A production </Text>
      <Text style={s.upsellBrand}>aodit</Text>
      <Text>
        {" "}
        deep report stacks more scenarios, tougher corners, and evidence that
        holds up under scrutiny. Ballpark{" "}
      </Text>
      <Text style={s.upsellEmphasis}>~1%</Text>
      <Text> of that depth is what you just saw here. Hungry for the rest? </Text>
      <Text style={s.upsellEmphasis}>Talk to us</Text>
      <Text>
        {" "}
        — we will show you what a full engagement actually looks like.
      </Text>
    </Text>

    <View style={s.upsellActions} wrap={false}>
      <View>
        <View style={s.upsellCtaWrap}>
          <Text style={s.upsellCtaText}>Request full report</Text>
        </View>
        <Text style={s.upsellCtaUrl}>aodit.ai/contact</Text>
      </View>
    </View>
  </View>
);

const SpeakerChip = ({ kind }: { kind: "adversary" | "agent" | "judge" }) => {
  const cfg =
    kind === "adversary"
      ? { label: "ADVERSARY", color: FAIL_RED, bg: FAIL_BG }
      : kind === "agent"
        ? { label: "AGENT", color: DARK, bg: LIGHT_GRAY }
        : { label: "JUDGE", color: NOTE_AMBER, bg: NOTE_BG };
  return (
    <Text
      style={{ ...s.speakerChip, color: cfg.color, backgroundColor: cfg.bg }}
    >
      {cfg.label}
    </Text>
  );
};

// ─── Main component ─────────────────────────────────────────────────────────
const AoditDemoPDF: React.FC<AoditDemoPDFProps> = ({
  systemPrompt,
  modelLabel,
  turns,
  rawScore,
  status,
  createdAt,
  totalTurns = 8,
}) => {
  const completedCount = turns.length;
  const scoreDisplay = rawScore != null ? rawScore.toFixed(1) : "—";

  return (
    <Document>
      {/* ─── Page 1: Cover + Summary ─────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <PageHeader />
        <View style={s.body}>
          <Text style={s.coverEyebrow}>AODIT DEMO REPORT</Text>
          <Text style={s.coverTitle}>Demo Audit Report</Text>
          <Text style={s.coverSubtitle}>
            8-turn adversarial reliability test
          </Text>

          <View style={s.metaCard}>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>MODEL</Text>
              <Text style={s.metaValue}>{modelLabel}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>RUN DATE</Text>
              <Text style={s.metaValue}>{formatDate(createdAt)}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>STATUS</Text>
              <Text style={s.metaValue}>{statusLabel(status)}</Text>
            </View>
            <View style={s.metaRow}>
              <Text style={s.metaLabel}>TURNS COMPLETED</Text>
              <Text style={s.metaValue}>
                {completedCount} of {totalTurns}
              </Text>
            </View>
          </View>

          <View style={s.scoreBlock}>
            <Text style={s.scoreNum}>{scoreDisplay}</Text>
            <View style={s.scoreLabelStack}>
              <Text style={s.scoreLabelTop}>AVERAGE TURN SCORE</Text>
              <Text style={s.scoreLabelBottom}>out of 5.0</Text>
            </View>
          </View>

          {/* Section 1: Summary */}
          <View style={s.sectionRow}>
            <Text style={s.sectionNum}>1 —</Text>
            <Text style={s.sectionTitle}>Summary</Text>
          </View>
          <Text style={s.summaryText}>
            This demo ran an 8-turn adversarial test against your agent's
            reliability under pressure. Each turn escalates — from a baseline
            question, through reworded and complicated variants, into grey-zone
            asks, hard pushes, manipulation attempts, recovery, and a final
            judgment turn. {completedCount} of {totalTurns} turns completed.
            {"\n\n"}
            The full aodit framework evaluates six dimensions across hundreds of
            scenarios per audit. This demo shows a single scenario from the
            Reliability dimension to give you a feel for the methodology.
          </Text>

          {/* Section 2: Per-turn scores */}
          <View style={s.sectionRow}>
            <Text style={s.sectionNum}>2 —</Text>
            <Text style={s.sectionTitle}>Per-Turn Scores</Text>
          </View>
          {turns.length === 0 ? (
            <Text style={{ ...s.turnText, color: MID_GRAY, marginBottom: 8 }}>
              No turns completed.
            </Text>
          ) : (
            turns.map((t) => {
              const tone = scoreTone(t.score);
              return (
                <View key={t.turnIndex} style={s.barRow}>
                  <Text style={s.barLabel}>
                    Turn {t.turnIndex} · {t.turnType}
                  </Text>
                  <View style={s.barTrack}>
                    <View
                      style={{
                        ...s.barFill,
                        width: `${(t.score / 5) * 100}%`,
                        backgroundColor: tone.fg,
                      }}
                    />
                  </View>
                  <Text style={{ ...s.barValue, color: tone.fg }}>
                    {t.score}/5
                  </Text>
                </View>
              );
            })
          )}
        </View>
        <PageFooter />
      </Page>

      {/* ─── Transcript pages (one turn card per section, wrapping naturally) ── */}
      {turns.length > 0 && (
        <Page size="A4" style={s.page}>
          <PageHeader />
          <View style={s.body}>
            <View style={s.sectionRow}>
              <Text style={s.sectionNum}>3 —</Text>
              <Text style={s.sectionTitle}>Turn-by-Turn Transcript</Text>
            </View>

            {turns.map((t) => {
              const tone = scoreTone(t.score);
              return (
                // No wrap={false} — let react-pdf split cards across pages if needed
                <View key={t.turnIndex} style={s.turnCard}>
                  {/* Turn header */}
                  <View style={s.turnHeader} wrap={false}>
                    <Text style={s.turnNum}>Turn {t.turnIndex}</Text>
                    <Text style={s.turnType}>· {t.turnType}</Text>
                    <Text
                      style={{
                        ...s.scoreBadge,
                        color: tone.fg,
                        backgroundColor: tone.bg,
                      }}
                    >
                      {t.score}/5 · {scoreLabelText(t.score)}
                    </Text>
                  </View>

                  {/* Adversary */}
                  <View style={s.turnSection}>
                    <SpeakerChip kind="adversary" />
                    <MarkdownBlocks raw={t.prompt} baseStyle={s.turnText} />
                  </View>

                  <View style={s.turnDivider} />

                  {/* Agent */}
                  <View style={s.turnSection}>
                    <SpeakerChip kind="agent" />
                    <MarkdownBlocks raw={t.response} baseStyle={s.turnText} />
                  </View>

                  {/* Judge */}
                  {t.evaluatorReasoning ? (
                    <>
                      <View style={s.turnDivider} />
                      <View style={s.turnSection}>
                        <View style={s.reasoningBox}>
                          <Text style={s.reasoningLabel}>
                            JUDGE'S REASONING
                          </Text>
                          <MarkdownBlocks
                            raw={t.evaluatorReasoning}
                            baseStyle={s.turnText}
                          />
                        </View>
                      </View>
                    </>
                  ) : null}
                </View>
              );
            })}

            {status === "completed" && turns.length > 0 ? (
              <DemoCompletionUpsellPDF />
            ) : null}

            {/* System prompt appendix */}
            <View style={{ marginTop: 16 }}>
              <Text
                style={{
                  ...s.summaryText,
                  fontSize: 8,
                  color: MID_GRAY,
                  fontFamily: "Helvetica-Oblique",
                  marginBottom: 4,
                }}
              >
                System prompt under test:
              </Text>
              <View
                style={{
                  backgroundColor: CREAM,
                  borderLeftWidth: 3,
                  borderLeftColor: GREEN,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                }}
              >
                <Text style={{ ...s.turnText, fontSize: 8 }}>
                  {systemPrompt}
                </Text>
              </View>
            </View>
          </View>
          <PageFooter />
        </Page>
      )}
    </Document>
  );
};

export default AoditDemoPDF;
