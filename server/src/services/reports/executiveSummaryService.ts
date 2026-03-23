/**
 * Executive summary service — generates overall and per-dimension
 * executive summaries via LLM, to be stored on ReportRun and DimensionScore.
 */

import { DimensionScore } from "../../models/types/reportRun";
import {
  buildDimensionDeepDivePrompt,
  buildExecutiveSummariesPrompt,
} from "./prompts";
import { handleOpenRouterAIRequest } from "../../utils/openRouterClient";
import {
  FrameworkVersion,
  getFrameworkDefinition,
  resolveFrameworkVersion,
} from "./frameworkRegistry";

export interface ExecutiveSummaryResult {
  overallSummary: string;
  dimensionSummaries: Record<string, string>;
}

export interface DimensionDeepDiveResult {
  dimensions: Record<
    string,
    {
      categories: Array<{ id: string; commentary?: string }>;
      executiveSummary?: string;
      insights: Array<{ priority: "HIGH" | "MEDIUM" | "LOW"; text: string }>;
    }
  >;
}

const ALLOWED_PRIORITIES = new Set(["HIGH", "MEDIUM", "LOW"]);

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
  frameworkVersion?: FrameworkVersion;
  modelName: string;
  compositeScore: number;
  rating: string;
  deploymentVerdict: string;
  outlook?: string;
  totalScenarios: number;
  calibrationGap?: number;
  dimensionScores: DimensionScore[];
}): Promise<ExecutiveSummaryResult> {
  const frameworkVersion = resolveFrameworkVersion(params.frameworkVersion);
  const framework = getFrameworkDefinition(frameworkVersion);
  const messages = buildExecutiveSummariesPrompt({
    frameworkVersion,
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
    for (const dim of framework.dimensions) {
      const val = dimObj[dim];
      dimensionSummaries[dim] =
        typeof val === "string" ? val.trim() : "";
    }
  }

  return { overallSummary, dimensionSummaries };
}

export async function generateDimensionDeepDive(params: {
  evaluatorModelId: string;
  frameworkVersion?: FrameworkVersion;
  modelName: string;
  reportType?: string;
  dimensions: Array<{
    dimensionId: string;
    score: number;
    categories: Array<{ id: string; name: string; score: number | null }>;
    evidence: string[];
  }>;
}): Promise<DimensionDeepDiveResult> {
  const frameworkVersion = resolveFrameworkVersion(params.frameworkVersion);
  const framework = getFrameworkDefinition(frameworkVersion);
  const messages = buildDimensionDeepDivePrompt({
    frameworkVersion,
    modelName: params.modelName,
    reportType: params.reportType,
    dimensions: params.dimensions,
  });

  const response = await handleOpenRouterAIRequest(
    params.evaluatorModelId,
    messages,
    { max_tokens: 2200, response_format: { type: "json_object" } },
  );

  const raw =
    (response.choices?.[0]?.message?.content as string)?.trim() ?? "{}";
  const parsed = parseJsonSafe<{ dimensions?: Record<string, any> }>(raw, {});
  const result: DimensionDeepDiveResult = { dimensions: {} };

  const dims = parsed.dimensions;
  if (!dims || typeof dims !== "object") return result;

  for (const dimId of framework.dimensions) {
    const dim = dims[dimId];
    if (!dim || typeof dim !== "object") continue;

    const categories = Array.isArray(dim.categories)
      ? dim.categories
          .map((c: any) => ({
            id: typeof c?.id === "string" ? c.id.trim() : "",
            commentary:
              typeof c?.commentary === "string" ? c.commentary.trim() : "",
          }))
          .filter((c: { id: string }) => c.id.length > 0)
      : [];

    const executiveSummary =
      typeof dim.executiveSummary === "string"
        ? dim.executiveSummary.trim()
        : "";

    const insights = Array.isArray(dim.insights)
      ? dim.insights
          .map((i: any) => ({
            priority:
              typeof i?.priority === "string" ? i.priority.toUpperCase() : "",
            text: typeof i?.text === "string" ? i.text.trim() : "",
          }))
          .filter(
            (i: { priority: string; text: string }) =>
              ALLOWED_PRIORITIES.has(i.priority) && i.text.length > 0,
          )
          .map((i: { priority: string; text: string }) => ({
            priority: i.priority as "HIGH" | "MEDIUM" | "LOW",
            text: i.text,
          }))
      : [];

    result.dimensions[dimId] = {
      categories,
      executiveSummary: executiveSummary || undefined,
      insights,
    };
  }

  return result;
}
