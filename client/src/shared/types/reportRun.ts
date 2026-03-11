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
  rating: string;
  calibrationGap?: number;
  outlook?: string;
  deploymentVerdict?: string;
  scenarioResults?: string[];
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
