/**
 * agentClient — sends prompts to a client-hosted agent via HTTP and validates
 * that the agent is reachable before starting a full evaluation run.
 *
 * The integration contract is intentionally simple:
 *   POST <agentUrl>
 *   Body: { messages: [{ role, content }, ...] }
 *   Expected response: { reply: "<text>" }  OR  OpenAI-compatible completion
 *
 * If the agent returns a different shape, we attempt to extract text from
 * common response patterns (choices[0].message.content, response, message, text).
 */

const AGENT_REQUEST_TIMEOUT_MS = 30_000; // 30 s per turn
const LIVENESS_TIMEOUT_MS = 15_000; // 15 s for the initial probe

export interface AgentTurnMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Send a single turn to the agent URL and return the text reply.
 * Throws if the agent does not respond within the timeout or returns a non-2xx status.
 */
export const callAgentUrl = async (
  agentUrl: string,
  messages: AgentTurnMessage[],
  timeoutMs = AGENT_REQUEST_TIMEOUT_MS,
): Promise<string> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(agentUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal: controller.signal,
    });
  } catch (err: any) {
    throw new Error(
      `Agent at ${agentUrl} did not respond: ${err.message ?? String(err)}`,
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new Error(
      `Agent at ${agentUrl} returned HTTP ${response.status}: ${response.statusText}`,
    );
  }

  let rawBody = "";
  try {
    // Read the body exactly once, then attempt JSON parse from text.
    // This avoids "Body has already been read" on non-JSON responses.
    rawBody = await response.text();
  } catch (err: any) {
    throw new Error(
      `Agent at ${agentUrl} returned an unreadable response body: ${err?.message ?? String(err)}`,
    );
  }

  const trimmedBody = rawBody.trim();
  if (!trimmedBody) {
    return "";
  }

  let body: any = trimmedBody;
  try {
    body = JSON.parse(trimmedBody);
  } catch {
    // Non-JSON text/html response; treat as direct reply text.
    return trimmedBody;
  }

  // Extract text from various common response shapes
  if (typeof body === "string") return body.trim();
  if (typeof body?.reply === "string") return body.reply.trim();
  if (typeof body?.response === "string") return body.response.trim();
  if (typeof body?.message === "string") return body.message.trim();
  if (typeof body?.text === "string") return body.text.trim();
  // OpenAI-compatible shape
  if (typeof body?.choices?.[0]?.message?.content === "string") {
    return body.choices[0].message.content.trim();
  }
  if (typeof body?.choices?.[0]?.text === "string") {
    return body.choices[0].text.trim();
  }
  // Anthropic-compatible shape
  if (
    Array.isArray(body?.content) &&
    typeof body.content[0]?.text === "string"
  ) {
    return body.content[0].text.trim();
  }

  throw new Error(
    `Agent at ${agentUrl} returned an unrecognised response shape. Expected { reply } or OpenAI-compatible completion.`,
  );
};

/**
 * Send a short probe message to verify that the agent is reachable and replies
 * with *any* non-empty text within the timeout window.
 *
 * Returns the agent's reply text on success.
 * Throws an `AgentUnreachableError` if the agent cannot be reached or is silent.
 */
export class AgentUnreachableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AgentUnreachableError";
  }
}

const normalizeEvaluatorBaseUrl = (baseURL: string): string =>
  baseURL
    .trim()
    .replace(/\/+$/, "")
    // Allow full endpoint paste (.../v1/chat/completions)
    .replace(/\/chat\/completions$/i, "");

const parseModelIdsFromResponse = (body: any): string[] => {
  const fromData = Array.isArray(body?.data)
    ? body.data
        .map((entry: any) =>
          typeof entry?.id === "string" ? entry.id.trim() : "",
        )
        .filter(Boolean)
    : [];

  const fromModels = Array.isArray(body?.models)
    ? body.models
        .map((entry: any) =>
          typeof entry === "string"
            ? entry.trim()
            : typeof entry?.id === "string"
              ? entry.id.trim()
              : "",
        )
        .filter(Boolean)
    : [];

  return [...new Set([...fromData, ...fromModels])];
};

export const fetchEvaluatorModels = async (
  baseURL: string,
  apiKey?: string,
): Promise<string[]> => {
  const normalizedBase = normalizeEvaluatorBaseUrl(baseURL);
  const modelsUrl = `${normalizedBase}/models`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LIVENESS_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(modelsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      signal: controller.signal,
    });
  } catch (err: any) {
    throw new AgentUnreachableError(
      `Evaluator at ${modelsUrl} did not respond while fetching models: ${err.message ?? String(err)}`,
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new AgentUnreachableError(
      `Evaluator at ${modelsUrl} returned HTTP ${response.status}: ${response.statusText}${
        errText ? ` — ${errText.slice(0, 200)}` : ""
      }`,
    );
  }

  const body: any = await response.json().catch(() => ({}));
  const modelIds = parseModelIdsFromResponse(body);
  if (modelIds.length === 0) {
    throw new AgentUnreachableError(
      `Evaluator at ${modelsUrl} returned no models. Expected OpenAI-compatible response with data[].id.`,
    );
  }
  return modelIds;
};

/**
 * Probe an OpenAI-compatible evaluator endpoint (LM Studio, Ollama, vLLM,
 * OpenRouter, etc.) with a short chat completion and return a preview of
 * the reply. Used by the Agent admin "Test Evaluator Connection" button.
 */
export const checkEvaluatorLiveness = async (
  baseURL: string,
  apiKey?: string,
  model?: string,
): Promise<string> => {
  const normalizedBase = normalizeEvaluatorBaseUrl(baseURL);
  const url = `${normalizedBase}/chat/completions`;
  const requestedModel = model?.trim();

  // Strict model-id validation (when a model is provided):
  // ask the remote OpenAI-compatible server for /models and verify the model id
  // exists there before running the completion probe.
  if (requestedModel) {
    const listedModelIds = await fetchEvaluatorModels(normalizedBase, apiKey);
    if (!listedModelIds.includes(requestedModel)) {
      throw new AgentUnreachableError(
        `Evaluator model "${requestedModel}" is not listed by ${normalizedBase}/models. ` +
          `Available models: ${listedModelIds.slice(0, 10).join(", ")}`,
      );
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), LIVENESS_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        model: requestedModel || "gemma-3-4b",
        messages: [
          {
            role: "user",
            content:
              "Reply with exactly one short word (OK) and no extra formatting.",
          },
        ],
        // Some reasoning-enabled local models may consume tokens on internal
        // reasoning before emitting final assistant content. Keep this modest
        // but high enough to avoid false "empty completion" negatives.
        max_tokens: 64,
      }),
      signal: controller.signal,
    });
  } catch (err: any) {
    throw new AgentUnreachableError(
      `Evaluator at ${url} did not respond: ${err.message ?? String(err)}`,
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new AgentUnreachableError(
      `Evaluator at ${url} returned HTTP ${response.status}: ${response.statusText}${
        errText ? ` — ${errText.slice(0, 200)}` : ""
      }`,
    );
  }

  const body: any = await response.json().catch(() => ({}));
  const msg = body?.choices?.[0]?.message;
  const content = msg?.content;
  const replyFromContent =
    typeof content === "string"
      ? content.trim()
      : Array.isArray(content)
        ? content
            .map((part: any) =>
              typeof part === "string"
                ? part
                : typeof part?.text === "string"
                  ? part.text
                  : "",
            )
            .join(" ")
            .trim()
        : "";

  // Fallbacks for local OpenAI-compatible variants that may emit text in
  // non-standard fields even when message.content is empty.
  const reply: string =
    replyFromContent ||
    body?.choices?.[0]?.text?.trim?.() ||
    msg?.reasoning_content?.trim?.() ||
    body?.response?.trim?.() ||
    "";

  if (!reply) {
    throw new AgentUnreachableError(
      `Evaluator at ${url} returned an empty completion. ` +
        `Check model id and server logs (raw keys: ${Object.keys(body || {}).join(", ") || "none"}).`,
    );
  }

  return reply;
};

export const checkAgentLiveness = async (agentUrl: string): Promise<string> => {
  const probeMessages: AgentTurnMessage[] = [
    {
      role: "user",
      content:
        "Hello — this is an automated security evaluation system. Please reply with a short acknowledgement to confirm you are operational.",
    },
  ];

  let reply: string;
  try {
    reply = await callAgentUrl(agentUrl, probeMessages, LIVENESS_TIMEOUT_MS);
  } catch (err: any) {
    throw new AgentUnreachableError(
      `Liveness check failed for agent at ${agentUrl}: ${err.message}`,
    );
  }

  if (!reply || reply.trim().length === 0) {
    throw new AgentUnreachableError(
      `Agent at ${agentUrl} responded but returned an empty reply. Evaluation aborted.`,
    );
  }

  return reply;
};
