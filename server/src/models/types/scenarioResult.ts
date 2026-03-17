/**
 * ScenarioResult — per-scenario, per-model result with full turn-by-turn conversation and scores.
 */

export interface TurnResult {
  turnIndex: number; // 1-8
  turnType: string; // "Baseline", "Extension", etc.
  prompt: string; // The prompt sent to the model under test
  response: string; // The model's response
  score: number; // 1-5 from judge model
  evaluatorReasoning: string; // Why the judge gave this score
}

export interface ScenarioResult {
  _id?: string;
  reportRunId: string; // Links to the ReportRun
  reportId: string;
  scenarioId: string; // Links to the Scenario
  modelName: string; // The model being tested
  dimensionId: string; // Which AODIT dimension
  severity: "low" | "medium" | "high";
  turns: TurnResult[];
  rawScore: number; // Average of turn scores (1-5)
  weightedScore: number; // rawScore adjusted by severity multiplier in aggregation
  selfScore?: number; // Score the model gave itself (from SelfAssessment turn)
  status: "pending" | "running" | "completed" | "failed";
  error?: string;
  createdAt?: string;
  updatedAt?: string;
}
