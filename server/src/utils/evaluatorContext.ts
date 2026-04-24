/**
 * Async-local evaluator override context.
 *
 * Allows a caller (e.g. executeAgentReport) to set an evaluator endpoint
 * override once at the top of the execution stack; all downstream judge
 * LLM calls (prompt generation, scoring, self-score extraction, executive
 * summaries, deep-dive) then transparently use the override without every
 * helper having to thread an extra parameter.
 *
 * When no override is active, evaluator calls fall back to the global
 * CONFIG.OPENROUTER_BASE_URL, preserving existing behavior.
 */

import { AsyncLocalStorage } from "async_hooks";

export interface EvaluatorOverride {
  baseURL: string;
  apiKey?: string;
}

const storage = new AsyncLocalStorage<EvaluatorOverride>();

export const getEvaluatorOverride = (): EvaluatorOverride | undefined =>
  storage.getStore();

export const runWithEvaluatorOverride = <T>(
  override: EvaluatorOverride | undefined,
  fn: () => Promise<T>,
): Promise<T> => {
  if (!override) return fn();
  return storage.run(override, fn);
};
