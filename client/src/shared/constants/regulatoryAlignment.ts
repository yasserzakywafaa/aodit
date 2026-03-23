export type AlignmentLevel = "Strong" | "Partial" | "Not covered";

export interface FinmaAlignmentRow {
  principle: string;
  level: AlignmentLevel;
  explanation: string;
}

export interface StandardAlignmentRow {
  standard: string;
  level: Exclude<AlignmentLevel, "Not covered">;
  explanation: string;
}

export const FINMA_ALIGNMENT_INTRO =
  "Published 18 December 2024. FINMA Guidance 08/2024 is the primary Swiss regulatory anchor for AI in financial institutions.";

export const FINMA_ALIGNMENT_DISCLAIMER =
  "AODIT does not claim compliance with FINMA 08/2024. It supports the institutions that must comply with it.";

export const FINMA_ALIGNMENT_ROWS: FinmaAlignmentRow[] = [
  {
    principle: "2.1 Governance",
    level: "Partial",
    explanation:
      "AODIT supports governance by providing independent test evidence and structured reporting that governance committees can act on. It does not build or assess the governance structure itself, including roles, responsibilities, and oversight committees.",
  },
  {
    principle: "2.2 Inventory and risk classification",
    level: "Partial",
    explanation:
      "AODIT evaluates individual agents once submitted for testing. It does not automatically discover, inventory, or classify all AI assets across an institution. Manual asset inventory is a V2 roadmap item. For now, AODIT rates what it is given, not what it finds itself.",
  },
  {
    principle: "2.3 Data quality",
    level: "Not covered",
    explanation:
      "FINMA requires institutions to ensure training data is complete, accurate, and unbiased. AODIT tests deployed agent behaviour and does not inspect training datasets, data pipelines, or data labelling processes. This is an explicit scope boundary, not a gap to be hidden.",
  },
  {
    principle: "2.4 Tests and ongoing monitoring",
    level: "Strong",
    explanation:
      "This is AODIT's core product. The 8-turn adversarial protocol with 30 categories across six dimensions directly delivers what FINMA requires: structured testing of AI performance, robustness, correctness, and resistance to adversarial inputs. The output report supports ongoing monitoring decisions.",
  },
  {
    principle: "2.5 Documentation",
    level: "Strong",
    explanation:
      "Every AODIT evaluation produces a structured report: methodology, scenario transcripts, per-category scores, calibration gap, and actionable insights. This is exactly the documentation FINMA expects institutions to hold as evidence of their AI testing and monitoring activities.",
  },
  {
    principle: "2.6 Explainability",
    level: "Strong",
    explanation:
      "FINMA explicitly requires that AI outputs can be understood and critically assessed by staff, auditors, and FINMA itself. The AODIT report is designed for non-technical executives with colour-coded ratings, plain-language summaries, and calibration gap scores. The Integrity dimension directly tests whether the agent communicates its own reasoning and uncertainty clearly.",
  },
  {
    principle: "2.7 Independent verification",
    level: "Strong",
    explanation:
      "AODIT is designed as an independent third-party evaluation framework for Swiss regulated institutions and is purpose-built for independent reviews.",
  },
];

export const OTHER_STANDARDS_INTRO =
  '"Conceptually aligned" means AODIT addresses the same risk categories. It does not mean AODIT certifies compliance with these standards.';

export const OTHER_STANDARD_ROWS: StandardAlignmentRow[] = [
  {
    standard: "NIST AI RMF AI 100-1 (2023)",
    level: "Strong",
    explanation:
      "AODIT addresses the four RMF functions at the agent-behaviour layer, not at the governance or policy level. The 30 categories map to NIST's risk measurement requirements for AI systems. Strongest alignment is at the Measure and Manage functions.",
  },
  {
    standard: "NIST AI 100-2 (March 2025)",
    level: "Strong",
    explanation:
      "AODIT covers 7 of 15 NIST attack classes fully and 3 partially at the behavioural layer. The 8-turn adversarial protocol operationalises what NIST describes in taxonomy form. Honest gaps include backdoor and training-time attacks, and membership inference, which require infrastructure access beyond behavioural evaluation.",
  },
  {
    standard: "ISO 42001 (2023)",
    level: "Partial",
    explanation:
      "ISO 42001 is a management system certification standard. AODIT is a testing tool. AODIT addresses risk-assessment and performance-testing principles within ISO 42001, but does not cover broader management system requirements such as policy, organisational structure, and supplier management.",
  },
  {
    standard: "Swiss DSG (in force 2023)",
    level: "Partial",
    explanation:
      "C2 PII boundary enforcement directly addresses Swiss data protection obligations for AI agents handling personal data. AODIT does not assess data retention, consent management, or subject access rights, only whether the agent protects PII during live interactions.",
  },
  {
    standard: "EU AI Act Articles 9-15",
    level: "Partial",
    explanation:
      "All measures in FINMA 08/2024 are also found in EU AI Act Articles 9-15 for high-risk systems. Since AODIT aligns with FINMA 08/2024, it implicitly addresses the same territory. Extraterritorial obligations apply to Swiss institutions with EU market exposure.",
  },
];

export const AODIT_ADDED_VALUE_POINTS: string[] = [
  "Calibration Gap: a governance metric measuring whether the agent knows when it has failed.",
  "8-turn adversarial protocol: a structured multi-turn methodology that operationalizes risk expectations that standards often describe at a higher level.",
  "Blast Radius Limitation: measures containment quality after a failure, not only whether a failure occurred.",
];

export const FINMA_OFFICIAL_NOTICE = {
  title: "FINMA Guidance 08/2024 (Official PDF)",
  authority: "Swiss Financial Market Supervisory Authority (FINMA)",
  publishedDate: "18 December 2024",
  downloadUrl:
    "https://aodit.s3.eu-west-2.amazonaws.com/files/FINMA_guidance_08_2024.pdf",
};
