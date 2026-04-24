import CONFIG from "../config";
import { OpenAI } from "openai";
import { getEvaluatorOverride } from "./evaluatorContext";

export const createOpenRouterClient = (externalApiKey?: string): OpenAI => {
  // Scenario 1: User provided their own OpenAI key - use OpenAI directly
  if (externalApiKey) {
    return new OpenAI({
      apiKey: externalApiKey,
      // This bypasses OpenRouter and uses user's OpenAI credits directly
    });
  }

  // Scenario 2: No user key provided - use OpenRouter
  // OpenRouter will use provider keys configured in dashboard (BYOK)
  const openRouterApiKey = CONFIG.OPENROUTER_API_KEY;
  if (!openRouterApiKey) {
    throw new Error(
      "❌ OpenRouter API key is required. Please set OPENROUTER_API_KEY in your environment variables.",
    );
  }

  return new OpenAI({
    apiKey: openRouterApiKey,
    baseURL: CONFIG.OPENROUTER_BASE_URL,
    defaultHeaders: {
      "HTTP-Referer": CONFIG.APP_URL || "https://www.aodit.ai",
      "X-Title": "Aodit",
    },
  });
};

export const normalizeModelName = (
  modelName: string,
  isDirectOpenAI: boolean,
): string => {
  if (!isDirectOpenAI) {
    // Using OpenRouter - return as-is (supports "openai/gpt-5-mini" format)
    return modelName;
  }

  // Using direct OpenAI - strip "openai/" prefix if present
  if (modelName.startsWith("openai/")) {
    return modelName.replace("openai/", "");
  }

  // Remove any suffixes like ":online" for direct OpenAI
  return modelName.split(":")[0];
};

export const handleOpenRouterAIRequest = async (
  modelName: string,
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options: {
    max_tokens?: number;
    response_format?: { type: string };
    externalOpenAiApiKey?: string;
  } = {},
): Promise<any> => {
  // Evaluator override (per-agent on-prem endpoint) — takes precedence over
  // OpenRouter / direct OpenAI paths. Set by runWithEvaluatorOverride().
  const override = getEvaluatorOverride();

  // On-prem air-gap guard: if no override is active and the caller did not
  // supply a direct OpenAI key, refuse to let the request leak to the
  // configured OPENROUTER_BASE_URL. This is the belt-and-braces safety net
  // protecting any code path that bypasses runWithEvaluatorOverride().
  if (CONFIG.ON_PREM && !override && !options.externalOpenAiApiKey) {
    throw new Error(
      `On-prem: refusing to call ${CONFIG.OPENROUTER_BASE_URL} without an evaluator override. ` +
        "Configure the agent's Evaluator URL on the Agent page.",
    );
  }

  if (override) {
    const client = new OpenAI({
      apiKey: override.apiKey || "no-key",
      baseURL: override.baseURL,
    });
    // Local/on-prem servers (LM Studio, Ollama, vLLM) often can't honor
    // json_object response_format. Drop it here — callers parse JSON defensively.
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

  // Use direct OpenAI if external key is provided
  if (options.externalOpenAiApiKey) {
    const openai = createOpenRouterClient(options.externalOpenAiApiKey);
    return await openai.chat.completions.create({
      model: normalizeModelName(modelName, true),
      messages: messages as any,
      ...(options.response_format && {
        response_format: options.response_format as any,
      }),
      max_tokens: options.max_tokens || CONFIG.AI_MAX_TOKENS.DEFAULT,
    });
  }

  // Use OpenRouter
  const isOpenAIModel = modelName.startsWith("openai/");
  if (isOpenAIModel) {
    // Use OpenRouter with provider.only for OpenAI models to prevent fallback
    const response = await handleOpenRouterHttpRequest(modelName, messages, {
      max_tokens: options.max_tokens || CONFIG.AI_MAX_TOKENS.DEFAULT,
      response_format: options.response_format,
      provider: { only: ["openai"] },
    });
    return { choices: response.choices || [] };
  }

  // Use OpenRouter SDK for non-OpenAI models
  const openai = createOpenRouterClient();
  return await openai.chat.completions.create({
    model: modelName,
    messages: messages as any,
    ...(options.response_format && {
      response_format: options.response_format as any,
    }),
    max_tokens: options.max_tokens || CONFIG.AI_MAX_TOKENS.DEFAULT,
  });
};

export const handleOpenRouterHttpRequest = async (
  model: string,
  messages: Array<{ role: string; content: string }>,
  options: {
    max_tokens?: number;
    response_format?: { type: string };
    provider?: { only: string[] };
  } = {},
): Promise<any> => {
  // On-prem air-gap guard: this helper posts directly to
  // CONFIG.OPENROUTER_BASE_URL (not the evaluator override). In on-prem mode
  // we refuse to make the call at all.
  if (CONFIG.ON_PREM) {
    throw new Error(
      `On-prem: refusing to call ${CONFIG.OPENROUTER_BASE_URL}. ` +
        "Direct OpenRouter HTTP requests are disabled in air-gapped deployments.",
    );
  }

  console.log("🔍 Making OpenRouter request to fetch URL data:", {
    model,
    hasProvider: !!options.provider,
  });

  const openRouterApiKey = CONFIG.OPENROUTER_API_KEY;

  if (!openRouterApiKey) {
    throw new Error(
      "OpenRouter API key is required. Please set OPENROUTER_API_KEY in your environment variables.",
    );
  }

  const requestBody: any = {
    model,
    messages,
    ...options,
  };

  const response = await fetch(
    `${CONFIG.OPENROUTER_BASE_URL}/chat/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openRouterApiKey}`,
        "HTTP-Referer": CONFIG.APP_URL || "https://www.aodit.ai",
        "X-Title": "Aodit",
      },
      body: JSON.stringify(requestBody),
    },
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.error?.message ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  const responseData = await response.json();
  console.log("🔗 Fetched URL Data from OpenRouter:", {
    dataLength: responseData.choices?.[0]?.message?.content?.length ?? 0,
  });
  console.log("--------------------------------");

  return responseData;
};
