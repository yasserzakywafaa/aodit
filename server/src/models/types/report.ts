export type ScenariosPerDimension = 20 | 50 | 100;
export type FrameworkVersion = "aodit_v1" | "aodit_v2";

export interface DimensionWeights {
  Reliability?: number;
  Integrity?: number;
  Confidentiality?: number;
  Judgment?: number;
  Resistance?: number;
  Resilience?: number;
  [key: string]: number | undefined;
}

export interface Report {
  _id: string;
  name: string;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  description?: string;
  documents?: string[];
  /** aodit report type (e.g. "Frontier AI Risk 2026", "AI Banking Agent Risk") */
  reportType?: string;
  /** Owner user id */
  userId?: string;
  executionStatus?:
    | "pending"
    | "running"
    | "completed"
    | "failed"
    | "scheduled";
  startedAt?: string;
  completedAt?: string;
  /** Scenarios per dimension; total scenarios = scenariosPerDimension * dimensionCount. */
  scenariosPerDimension?: ScenariosPerDimension;
  /** Framework version that defines dimensions, categories, weights, and turns. */
  frameworkVersion?: FrameworkVersion;
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
