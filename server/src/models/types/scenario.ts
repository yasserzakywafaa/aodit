/**
 * Scenario — one test case within a report (e.g. 20 per dimension).
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
  categoryId: string; // aodit dimension id
  /**
   * aodit category code within the dimension (e.g. R1–R5, I1–I5, C1–C5).
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
