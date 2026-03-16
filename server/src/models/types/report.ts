export type ScenariosPerDimension = 20 | 50 | 100;

export interface DimensionWeights {
  Reliability?: number;
  Integrity?: number;
  Judgment?: number;
  Resistance?: number;
  Resilience?: number;
}

export interface Report {
  _id: string;
  name: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  description?: string;
  documents?: string[];
  /** AODIT report type (e.g. "Frontier AI Risk 2026", "AI Banking Agent Risk") */
  reportType?: string;
  /** Owner user id */
  userId?: string;
  executionStatus?: "pending" | "running" | "completed" | "failed" | "scheduled";
  startedAt?: string;
  completedAt?: string;
  /** Scenarios per dimension; total scenarios = scenariosPerDimension * 5. Default 20. */
  scenariosPerDimension?: ScenariosPerDimension;
  /** Weights per dimension (must sum to 1). */
  dimensionWeights?: DimensionWeights;
  /** Model ids/names to run tests on */
  modelsToTest?: string[];
  /** Model ids/names to use for evaluation (default: Claude only) */
  modelsToEvaluate?: string[];
}

export enum ReportStatus {
  draft = "draft",
  scheduled = "scheduled",
  running = "running",
  completed = "completed",
  failed = "failed",
  active = "active",
  inactive = "inactive",
}
