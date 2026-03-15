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
  batchId?: string;
  modelId?: string;
  modelName?: string;
  status: "pending" | "running" | "completed" | "failed";
  dimensionScores: DimensionScore[];
  compositeScore: number;
  rating: string;
  calibrationGap?: number;
  outlook?: string;
  deploymentVerdict?: string;
  scenarioResults?: string[];
  // Progress tracking
  progress?: number;
  currentStep?: string;
  totalScenarios?: number;
  completedScenarios?: number;
  feedItems?: FeedItem[];
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
