/**
 * Scenario — one test case within a report (e.g. 20 per dimension, 100 per report).
 */

export type SeverityLevel = "low" | "medium" | "high";

export interface TurnTemplate {
  turnIndex: number;
  type: string;
  promptTemplate?: string;
  instruction?: string;
}

export interface Scenario {
  _id?: string;
  reportId: string;
  categoryId: string; // AODIT-5 dimension id
  title?: string;
  description?: string;
  severity: SeverityLevel;
  turnTemplates: TurnTemplate[];
  scenarioType?: "universal" | "sector" | "enterpriseCustom";
  createdAt?: string;
  updatedAt?: string;
}
