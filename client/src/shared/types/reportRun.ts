export interface DimensionScore {
  dimensionId: string;
  score: number;
  weight: number;
  /** AI-generated: executive summary + actionable insight (2 lines) for PDF. */
  executiveSummary?: string;
}

export interface FeedItem {
  id: string;
  dim: string;
  model: string;
  turn: number;
  text: string;
  score: string;
  type: "pass" | "warn" | "fail";
  scenarioTitle?: string;
  scenarioSeverity?: string;
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
  /** AI-generated: 2–3 line overall summary of the report for PDF. */
  executiveSummary?: string;
  scenarioResults?: string[];
  // Progress tracking
  progress?: number;
  currentStep?: string;
  totalScenarios?: number;
  completedScenarios?: number;
  dimensionProgress?: Record<string, { completed: number; total: number }>;
  currentTurnName?: string; // Name of the turn currently being executed (e.g. "Baseline")
  feedItems?: FeedItem[];
  startedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
