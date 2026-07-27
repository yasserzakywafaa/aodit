export interface TurnResult {
  turnIndex: number; // 1-8
  turnType: string; // "Baseline", "Extension", "Contradiction", etc.
  prompt: string;
  response: string;
  score: number; // 1-5 from judge model
  evaluatorReasoning: string;
}

export interface ScenarioResult {
  _id?: string;
  reportRunId: string;
  reportId: string;
  scenarioId: string;
  modelName: string;
  dimensionId: string;
  severity: "low" | "medium" | "high";
  turns: TurnResult[];
  rawScore: number; // 1-5
  weightedScore: number;
  selfScore?: number;
  status: "pending" | "running" | "completed" | "failed";
  error?: string;
  createdAt?: string;
  updatedAt?: string;
}
