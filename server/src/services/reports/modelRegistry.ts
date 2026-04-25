/**
 * Model registry — maps friendly display names to OpenRouter model IDs.
 */

import CONFIG from "../../config";

export interface ModelEntry {
  id: string; // OpenRouter model ID
  displayName: string;
}

/** Models available for testing (the models under evaluation). */
export const MODEL_REGISTRY: Record<string, ModelEntry> = {
  Claude: { id: "anthropic/claude-opus-4.7", displayName: "Claude Opus 4.7" },
  GPT: { id: "openai/gpt-5.5", displayName: "GPT-5.5" },
  Gemini: {
    id: "google/gemini-3-flash-preview",
    displayName: "Gemini 3 Flash",
  },
  Grok: { id: "x-ai/grok-4.1-fast", displayName: "Grok 4.1 Fast" },
  Deepseek: {
    id: "deepseek/deepseek-v4-flash",
    displayName: "DeepSeek v4 Flash",
  },
  Kimi: { id: "moonshotai/kimi-k2.5", displayName: "Kimi K2.5" },
  Llama: { id: "meta-llama/llama-4-maverick", displayName: "Llama 4 Maverick" },
  Gemma: { id: "google/gemma-4-26b-a4b-it", displayName: "Gemma 4.26b A4b" },
  Qwen: { id: "qwen/qwen3.6-plus", displayName: "Qwen 3.6 Plus" },
};

/** Default judge/evaluator model used for prompt generation and scoring. */
export const DEFAULT_EVALUATOR_MODEL = "openai/gpt-5-mini";

/** Available evaluator/judge models — extensible registry. */
export const EVALUATOR_REGISTRY: Record<string, string> = {
  Claude: "anthropic/claude-sonnet-4",
  GPT: "openai/gpt-5.5",
  Gemini: "google/gemini-3.1-flash-lite-preview",
  Grok: "x-ai/grok-4.1-fast",
  Deepseek: "deepseek/deepseek-v4-flash",
  Kimi: "moonshotai/kimi-k2.5",
  Llama: "meta-llama/llama-4-maverick",
  Gemma: "google/gemma-4-26b-a4b-it",
  Qwen: "qwen/qwen3.6-plus",
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
  const name = modelsToEvaluate[0]?.trim() ?? "";
  if (!name) {
    return DEFAULT_EVALUATOR_MODEL;
  }
  // On-prem: never remap via EVALUATOR_REGISTRY — those ids are
  // OpenRouter-namespaced (e.g. "x-ai/grok-4.1-fast") and won't exist on the
  // tenant's local LLM server. Treat whatever the user typed as a literal
  // model id loaded on their evaluator endpoint.
  if (CONFIG.ON_PREM) {
    return name;
  }
  // Friendly label from EVALUATOR_REGISTRY (e.g. "Claude", "GPT-5 Mini")
  const mapped = EVALUATOR_REGISTRY[name];
  if (mapped !== undefined) {
    return mapped;
  }
  // Direct model id for on-prem / LM Studio / custom OpenAI-compatible servers
  return name;
};
