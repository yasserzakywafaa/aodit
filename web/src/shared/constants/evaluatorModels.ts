/**
 * Friendly evaluator labels — must stay in sync with server
 * `EVALUATOR_REGISTRY` in `server/src/services/reports/modelRegistry.ts`.
 * Users may also enter a direct model id (on-prem / local LLM).
 */
export const EVALUATOR_FRIENDLY_OPTIONS = [
  "Claude",
  "GPT",
  "Gemini",
  "Grok",
  "Deepseek",
  "Kimi",
  "Llama",
  "Gemma",
  "Qwen",
] as const;
