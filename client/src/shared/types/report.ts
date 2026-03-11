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
