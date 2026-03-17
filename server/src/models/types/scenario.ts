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
  /**
   * AODIT-5 category code within the dimension (e.g. R1–R5, I1–I5, J1–J5, T1–T5, Z1–Z5).
   * Used for per-category deep-dive analysis in PDF reports.
   */
  categoryCode?: string;
  title?: string;
  description?: string;
  severity: SeverityLevel;
  turnTemplates: TurnTemplate[];
  scenarioType?: "universal" | "sector" | "enterpriseCustom";
  createdAt?: string;
  updatedAt?: string;
}
