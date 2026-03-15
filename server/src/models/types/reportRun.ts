/**
 * ReportRun — result of executing all scenarios for a report (one run per model/report).
 */

export interface DimensionScore {
  dimensionId: string;
  score: number;
  weight: number;
}

export interface FeedItem {
  id: string;
  dim: string;
  model: string;
  turn: number;
  text: string;
  score: string;
  type: "pass" | "warn" | "fail";
}

export interface ReportRun {
  _id?: string;
  reportId: string;
  batchId?: string; // All runs from the same launch share a batchId
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
  // Progress tracking
  progress?: number; // 0-100
  currentStep?: string; // "Generating scenarios" | "Running conversations" | etc.
  totalScenarios?: number;
  completedScenarios?: number;
  feedItems?: FeedItem[]; // Last N live feed items for the progress page
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
