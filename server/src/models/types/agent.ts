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
  /** Creator user id */
  userId: string;
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
}
