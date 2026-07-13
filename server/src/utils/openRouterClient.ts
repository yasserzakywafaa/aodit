import CONFIG from "../config";
import {
  createOpenRouterClient as createCoreOpenRouterClient,
  OpenRouterHttpOptions,
  OpenRouterRequestOptions,
} from "@yasserzakywafaa/server-core";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { getEvaluatorOverride } from "./evaluatorContext";
import OpenAI from "openai";

const openRouter = createCoreOpenRouterClient({
  apiKey: CONFIG.OPENROUTER_API_KEY,
  appUrl: CONFIG.APP_URL || "https://www.aodit.ai",
  appTitle: "Aodit",
  defaultMaxTokens: CONFIG.AI_MAX_TOKENS.DEFAULT,
  logger: {
    debug: (message, details) => console.log(`🔍 ${message}:`, details),
    error: (message, details) => console.error(`❌ ${message}:`, details),
  },
});

export const createOpenRouterClient = (externalOpenAiApiKey?: string) =>
  openRouter.createClient(externalOpenAiApiKey);

export const normalizeModelName = (
  modelName: string,
  isDirectOpenAI: boolean,
): string => openRouter.normalizeModelName(modelName, isDirectOpenAI);

export const handleOpenRouterAIRequest = async (
  modelName: string,
  messages: ChatCompletionMessageParam[],
  options: OpenRouterRequestOptions = {},
) => {
  // Evaluator override (per-agent on-prem endpoint) — takes precedence over
  // OpenRouter / direct OpenAI paths.
  const override = getEvaluatorOverride();

  // On-prem air-gap guard: if no override is active and the caller did not
  // supply a direct OpenAI key, refuse to let the request leak.
  if (CONFIG.ON_PREM && !override && !options.externalOpenAiApiKey) {
    throw new Error(
      `On-prem: refusing to call without an evaluator override. ` +
        "Configure the agent's Evaluator URL on the Agent page.",
    );
  }

  if (override) {
    const client = new OpenAI({
      apiKey: override.apiKey || "no-key",
      baseURL: override.baseURL,
    });
    // Local/on-prem servers often can't honor json_object response_format.
    const response_format =
      options.response_format?.type === "json_object"
        ? undefined
        : options.response_format;
    return await client.chat.completions.create({
      model: modelName,
      messages: messages as any,
      ...(response_format && { response_format: response_format as any }),
      max_tokens: options.max_tokens || CONFIG.AI_MAX_TOKENS.DEFAULT,
    });
  }

  return openRouter.handleOpenRouterAIRequest(modelName, messages, options);
};

export const handleOpenRouterHttpRequest = async (
  modelName: string,
  messages: ChatCompletionMessageParam[],
  options: OpenRouterHttpOptions = {},
) => {
  // On-prem air-gap guard.
  if (CONFIG.ON_PREM) {
    throw new Error(
      `On-prem: refusing to call. Direct OpenRouter HTTP requests are disabled in air-gapped deployments.`,
    );
  }

  return openRouter.handleOpenRouterHttpRequest(modelName, messages, options);
};
