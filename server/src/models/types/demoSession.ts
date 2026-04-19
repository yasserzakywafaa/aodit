import { TurnResult } from "./scenarioResult";

export interface DemoSession {
  _id?: string;
  systemPrompt: string;
  modelId: string;
  status: "pending" | "running" | "completed" | "failed" | "cancelled";
  currentTurnIndex: number;
  turns: TurnResult[];
  rawScore?: number;
  error?: string;
  createdAt: string;
  expiresAt: string;
}
