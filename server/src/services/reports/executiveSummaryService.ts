/**
 * Executive summary service — generates overall and per-dimension
 * executive summaries via LLM, to be stored on ReportRun and DimensionScore.
 */

import { DimensionScore } from "../../models/types/reportRun";
import { buildExecutiveSummariesPrompt } from "./prompts";
import { handleOpenRouterAIRequest } from "../../utils/openRouterClient";

export interface ExecutiveSummaryResult {
  overallSummary: string;
  dimensionSummaries: Record<string, string>;
}

const DIMENSION_IDS = [
  "Reliability",
  "Integrity",
  "Judgment",
  "Resistance",
  "Resilience",
];

function parseJsonSafe<T>(text: string, fallback: T): T {
  try {
    const cleaned = text
      .replace(/^```json?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    return fallback;
  }
}

/**
 * Generate overall (2–3 line) and per-dimension (2 lines each) executive summaries
 * using the evaluator model. Returns strings suitable for storing in the DB.
 */
export async function generateExecutiveSummaries(params: {
  evaluatorModelId: string;
  modelName: string;
  compositeScore: number;
  rating: string;
  deploymentVerdict: string;
  outlook?: string;
  totalScenarios: number;
  calibrationGap?: number;
  dimensionScores: DimensionScore[];
}): Promise<ExecutiveSummaryResult> {
  const messages = buildExecutiveSummariesPrompt({
    modelName: params.modelName,
    compositeScore: params.compositeScore,
    rating: params.rating,
    deploymentVerdict: params.deploymentVerdict,
    outlook: params.outlook,
    totalScenarios: params.totalScenarios,
    calibrationGap: params.calibrationGap,
    dimensionScores: params.dimensionScores.map((d) => ({
      dimensionId: d.dimensionId,
      score: d.score,
    })),
  });

  const response = await handleOpenRouterAIRequest(
    params.evaluatorModelId,
    messages,
    { max_tokens: 1200, response_format: { type: "json_object" } },
  );

  const raw =
    (response.choices?.[0]?.message?.content as string)?.trim() ?? "{}";
  const parsed = parseJsonSafe<
    { overallSummary?: string; dimensionSummaries?: Record<string, string> }
  >(raw, {});

  const overallSummary =
    typeof parsed.overallSummary === "string"
      ? parsed.overallSummary.trim()
      : "";

  const dimensionSummaries: Record<string, string> = {};
  const dimObj = parsed.dimensionSummaries;
  if (dimObj && typeof dimObj === "object") {
    for (const dim of DIMENSION_IDS) {
      const val = dimObj[dim];
      dimensionSummaries[dim] =
        typeof val === "string" ? val.trim() : "";
    }
  }

  return { overallSummary, dimensionSummaries };
}
