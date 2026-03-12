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
  reportType?: string;
  userId?: string;
  executionStatus?: "pending" | "running" | "completed" | "failed" | "scheduled";
  startedAt?: string;
  completedAt?: string;
  sectorContext?: string;
  scenariosPerDimension?: ScenariosPerDimension;
  dimensionWeights?: DimensionWeights;
  modelsToTest?: string[];
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
