export enum AgentStatus {
  active = "active",
  inactive = "inactive",
}

export interface Agent {
  _id: string;
  /** Agent display name */
  name: string;
  /** What the agent does */
  description?: string;
  /** What the agent will be used for (business intent) */
  intent?: string;
  /** Human responsible for this agent (FINMA compliance) */
  ownerName?: string;
  /**
   * Public HTTP(S) endpoint of the live agent.
   * Required for Agent-to-Agent evaluation mode; optional for Benchmark mode.
   */
  agentUrl?: string;
  /**
   * Optional OpenAI-compatible chat-completions endpoint for the judge model
   * used to evaluate this agent. If unset, falls back to the global
   * OPENROUTER_BASE_URL. Enables on-prem / air-gapped deployments to point
   * the evaluator at an internal LLM.
   */
  evaluatorUrl?: string;
  /** Optional API key for the evaluator endpoint. */
  evaluatorApiKey?: string;
  /** Optional default model id for this agent's judge (e.g. "google/gemma-3-4b"). */
  evaluatorModel?: string;
  /** Creator user id */
  userId: string;
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
}
