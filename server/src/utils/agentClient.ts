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

  let body: any;
  try {
    body = await response.json();
  } catch {
    // If the body is plain text, try reading it as a string
    body = await response.text();
    if (typeof body === "string") return body.trim();
    throw new Error(`Agent at ${agentUrl} returned non-JSON response`);
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
  if (Array.isArray(body?.content) && typeof body.content[0]?.text === "string") {
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

export const checkAgentLiveness = async (
  agentUrl: string,
): Promise<string> => {
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
