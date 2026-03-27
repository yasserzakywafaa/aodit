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
  userId: string;
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
}
