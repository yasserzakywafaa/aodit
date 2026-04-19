/**
 * Model registry — maps friendly display names to OpenRouter model IDs.
 */

export interface ModelEntry {
  id: string; // OpenRouter model ID
  displayName: string;
}

/** Models available for testing (the models under evaluation). */
export const MODEL_REGISTRY: Record<string, ModelEntry> = {
  Claude: { id: "anthropic/claude-opus-4.7", displayName: "Claude Opus 4.7" },
  GPT: { id: "openai/gpt-5.4-mini", displayName: "GPT-5.4 Mini" },
  Gemini: {
    id: "google/gemini-3-flash-preview",
    displayName: "Gemini 3 Flash",
  },
  Grok: { id: "x-ai/grok-4.1-fast", displayName: "Grok 4.1 Fast" },
  Deepseek: { id: "deepseek/deepseek-v3.2", displayName: "DeepSeek v3.2" },
  Kimi: { id: "moonshotai/kimi-k2.5", displayName: "Kimi K2.5" },
  Llama: { id: "meta-llama/llama-4-maverick", displayName: "Llama 4 Maverick" },
  Gemma: { id: "google/gemma-4-26b-a4b-it", displayName: "Gemma 4.26b A4b" },
  Qwen: { id: "qwen/qwen3.6-plus", displayName: "Qwen 3.6 Plus" },
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
