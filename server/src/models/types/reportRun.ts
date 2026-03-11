/**
 * ReportRun — result of executing all scenarios for a report (one run per model/report).
 */

export interface DimensionScore {
  dimensionId: string;
  score: number;
  weight: number;
}

export interface ReportRun {
  _id?: string;
  reportId: string;
  modelId?: string;
  modelName?: string;
  status: "pending" | "running" | "completed" | "failed";
  dimensionScores: DimensionScore[];
  compositeScore: number;
  rating: string; // AAA, AA, A, BBB, BB, B, D
  calibrationGap?: number;
  outlook?: string;
  deploymentVerdict?: string;
  scenarioResults?: string[]; // ids or embedded summary
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
