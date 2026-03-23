import APP_CONSTANTS from "src/application/shared/app_constants";

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
  "Published 18 December 2024, FINMA Guidance 08/2024 is the primary Swiss regulatory anchor for AI in financial institutions. AODIT is the independent behavioral control layer used to evidence how AI agents perform under stress.";

export const FINMA_ALIGNMENT_DISCLAIMER =
  "AODIT does not certify compliance and does not replace the institution's governance or compliance program. It provides independent behavioral evidence required to demonstrate that controls work in practice.";

export const FINMA_KEY_PRINCIPLE =
  "Policies define intent. Behavior under stress provides evidence.";

export const FINMA_KILLER_LINE =
  "If you cannot show how your AI behaves under stress, you are not compliant, regardless of your policies.";

export interface LifecycleStage {
  stage: string;
  useCase: string;
}

export const FINMA_LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    stage: "Before deployment",
    useCase:
      "Run independent behavioral validation before production release to verify refusal quality, risk boundaries, and user-safety performance.",
  },
  {
    stage: "After model or prompt updates",
    useCase:
      "Run regression and drift testing after every material change to detect degraded controls before exposure reaches clients or regulators.",
  },
  {
    stage: "Ongoing in production",
    useCase:
      "Execute periodic testing cycles to produce current evidence packs for risk committees, internal audit, and supervisory review.",
  },
  {
    stage: "Post-incident",
    useCase:
      "Use transcript-level forensic behavioral audit to reconstruct failure patterns, quantify impact, and evidence corrective action.",
  },
];

export const FINMA_ALIGNMENT_ROWS: FinmaAlignmentRow[] = [
  {
    principle: "2.1 Governance",
    level: "Partial",
    explanation:
      "AODIT provides independent evidence that governance committees can challenge and act on. It does not design or audit governance operating models, role design, or committee mandates. This is an explicit boundary, not a hidden gap.",
  },
  {
    principle: "2.2 Inventory and risk classification",
    level: "Partial",
    explanation:
      "AODIT tests named agents submitted for assessment and quantifies behavioral risk for each one. It does not discover every AI asset across the institution or own enterprise inventory completeness.",
  },
  {
    principle: "2.3 Data quality",
    level: "Not covered",
    explanation:
      "FINMA expects institutions to control training-data quality, bias, and lineage. AODIT evaluates live behavioral performance and does not inspect training datasets, labeling pipelines, or data engineering controls. This is an explicit boundary, not a hidden gap.",
  },
  {
    principle: "2.4 Tests and ongoing monitoring",
    level: "Strong",
    explanation:
      "This is AODIT's core control surface. The 8-turn adversarial protocol across 30 categories and six dimensions tests the failure modes FINMA expects institutions to control: robustness, correctness, refusal quality, and adversarial resilience.",
  },
  {
    principle: "2.5 Documentation",
    level: "Strong",
    explanation:
      "Each run produces a structured evidence pack: methodology, transcripts, category scores, calibration gap, and decision-ready findings. This creates documentation that can be tabled in risk governance, internal audit, and supervisory review.",
  },
  {
    principle: "2.6 Explainability",
    level: "Strong",
    explanation:
      "FINMA requires outcomes that can be challenged by management, audit, and supervisors. AODIT reports are built for that challenge process, with plain-language findings and calibration evidence showing whether confidence tracks actual accuracy under stress.",
  },
  {
    principle: "2.7 Independent verification",
    level: "Strong",
    explanation:
      "AODIT is designed as an independent behavioral evaluation framework. It separates test evidence from model ownership, reducing self-attestation risk in high-stakes control decisions.",
  },
];

export const OTHER_STANDARDS_INTRO =
  "AODIT covers the behavioral risk surface expected by major frameworks. It does not certify compliance with those frameworks and does not replace statutory obligations.";

export const OTHER_STANDARD_ROWS: StandardAlignmentRow[] = [
  {
    standard: "NIST AI RMF AI 100-1 (2023)",
    level: "Strong",
    explanation:
      "AODIT operationalizes NIST's Measure and Manage expectations at the behavioral layer, with repeatable stress testing and quantified outcomes. Governance and policy ownership remains with the institution.",
  },
  {
    standard: "NIST AI 100-2 (March 2025)",
    level: "Strong",
    explanation:
      "AODIT tests the operational failure modes regulators care about in deployed agent behavior, using a multi-turn adversarial protocol rather than static checklists. It does not cover backdoor, training-time, or infrastructure-level attack classes that require direct system access.",
  },
  {
    standard: "ISO 42001 (2023)",
    level: "Partial",
    explanation:
      "ISO 42001 governs management systems. AODIT provides independent behavioral test evidence that supports those systems. It does not deliver ISO management-system controls such as policy governance, organization design, or supplier oversight.",
  },
  {
    standard: "Swiss DSG (in force 2023)",
    level: "Partial",
    explanation:
      "AODIT directly tests whether agents respect PII boundaries during live interactions. It does not assess legal bases, retention obligations, consent operations, or data-subject rights workflows.",
  },
  {
    standard: "EU AI Act Articles 9-15",
    level: "Partial",
    explanation:
      "Articles 9-15 require documented risk management, testing, and monitoring discipline for high-risk systems. AODIT provides independent behavioral evidence for those requirements, but it is not an EU AI Act conformity assessment and does not satisfy legal obligations on its own.",
  },
];

export const AODIT_ADDED_VALUE_POINTS: string[] = [
  "Calibration Gap is a governance signal: it shows whether model confidence tracks actual performance under stress, which is critical for challenge and escalation decisions.",
  "The 8-turn adversarial protocol operationalizes regulatory expectations into repeatable control testing, rather than one-off point checks.",
  "Blast Radius Limitation measures containment quality after failure, which determines operational impact, remediation urgency, and supervisory exposure.",
];

export const FINMA_RISK_IF_NOT_USED: string[] = [
  "Mis-selling exposure increases when hallucinated recommendations are not stress-tested before client interaction.",
  "Regulatory breaches become more likely when refusal behavior fails under pressure and prohibited outputs are still produced.",
  "Overconfident outputs without calibration evidence undermine internal challenge, external audit, and model approval decisions.",
  "Without independent behavioral evidence, governance degrades into policy assertion, increasing liability, fines, and reputational damage.",
];

export const FINMA_OFFICIAL_NOTICE = {
  title: "FINMA Guidance 08/2024 (Official PDF)",
  authority: "Swiss Financial Market Supervisory Authority (FINMA)",
  publishedDate: "18 December 2024",
  downloadUrl: APP_CONSTANTS.FINMA_OFFICIAL_NOTICE_PDF_URL,
};
