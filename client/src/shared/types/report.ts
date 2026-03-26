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
  reportType?: string;
  userId?: string;
  executionStatus?: "pending" | "running" | "completed" | "failed" | "scheduled";
  startedAt?: string;
  completedAt?: string;
  scenariosPerDimension?: ScenariosPerDimension;
  frameworkVersion?: FrameworkVersion;
  dimensionWeights?: DimensionWeights;
  modelsToTest?: string[];
  modelsToEvaluate?: string[];
  /** Linked agent id (FINMA compliance — required before running) */
  agentId?: string;
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
