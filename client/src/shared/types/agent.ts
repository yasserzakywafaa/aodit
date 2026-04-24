export enum AgentStatus {
  active = "active",
  inactive = "inactive",
}

export interface Agent {
  _id: string;
  name: string;
  description?: string;
  intent?: string;
  ownerName?: string;
  /**
   * Public HTTP(S) endpoint of the agent that aodit will probe during
   * Agent-to-Agent evaluation mode.  Optional — agents without a URL can
   * still be used for Benchmark (Frontier Model) mode.
   */
  agentUrl?: string;
  /**
   * Optional OpenAI-compatible chat-completions endpoint for the judge model
   * used to evaluate this agent. When set, the judge runs against this URL
   * instead of the platform-wide OpenRouter endpoint — enabling on-prem /
   * air-gapped deployments.
   */
  evaluatorUrl?: string;
  evaluatorApiKey?: string;
  evaluatorModel?: string;
  userId: string;
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
}
