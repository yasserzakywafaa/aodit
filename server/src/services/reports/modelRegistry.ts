/**
 * Model registry — maps friendly display names to OpenRouter model IDs.
 */

export interface ModelEntry {
  id: string; // OpenRouter model ID
  displayName: string;
}

/** Models available for testing (the models under evaluation). */
export const MODEL_REGISTRY: Record<string, ModelEntry> = {
  Claude: { id: "anthropic/claude-sonnet-4", displayName: "Claude" },
  GPT: { id: "openai/gpt-4o", displayName: "GPT" },
  Gemini: { id: "google/gemini-2.5-flash", displayName: "Gemini" },
  Grok: { id: "x-ai/grok-3-mini", displayName: "Grok" },
  Deepseek: { id: "deepseek/deepseek-chat-v3-0324", displayName: "Deepseek" },
  Kimi: { id: "moonshotai/kimi-k2", displayName: "Kimi" },
  Llama: { id: "meta-llama/llama-4-maverick", displayName: "Llama" },
  Qwen: { id: "qwen/qwen3-30b-a3b", displayName: "Qwen" },
};

/** Default judge/evaluator model used for prompt generation and scoring. */
export const DEFAULT_EVALUATOR_MODEL = "openai/gpt-5-mini";

/** Available evaluator/judge models — extensible registry. */
export const EVALUATOR_REGISTRY: Record<string, string> = {
  "GPT-5 Mini": "openai/gpt-5-mini",
  Claude: "anthropic/claude-sonnet-4",
  GPT: "openai/gpt-4o",
  Gemini: "google/gemini-2.5-flash",
};

/** Resolve a friendly model name to its OpenRouter model ID for testing. */
export const resolveModelId = (friendlyName: string): string => {
  const entry = MODEL_REGISTRY[friendlyName];
  if (!entry) {
    throw new Error(
      `Unknown model "${friendlyName}". Available: ${Object.keys(MODEL_REGISTRY).join(", ")}`,
    );
  }
  return entry.id;
};

/** Resolve the evaluator model ID from report config, falling back to default. */
export const resolveEvaluatorModelId = (
  modelsToEvaluate?: string[],
): string => {
  if (!modelsToEvaluate || modelsToEvaluate.length === 0) {
    return DEFAULT_EVALUATOR_MODEL;
  }
  const name = modelsToEvaluate[0];
  return EVALUATOR_REGISTRY[name] ?? DEFAULT_EVALUATOR_MODEL;
};
