export interface DemoTurnResult {
  turnIndex: number;
  turnType: string;
  prompt: string;
  response: string;
  score: number;
  evaluatorReasoning: string;
}

export type DemoStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export interface DemoSession {
  _id: string;
  systemPrompt: string;
  modelId: string;
  status: DemoStatus;
  currentTurnIndex: number;
  turns: DemoTurnResult[];
  rawScore?: number;
  error?: string;
  sourcePath?: string;
  sourceLabel?: string;
  createdAt: string;
}
