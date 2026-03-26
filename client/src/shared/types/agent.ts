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
  userId: string;
  status: AgentStatus;
  createdAt: string;
  updatedAt: string;
}
