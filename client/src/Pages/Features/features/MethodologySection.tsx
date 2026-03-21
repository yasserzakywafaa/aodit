import {
  fontFamilySans,
  fontFamilySerif,
  grey,
} from "src/application/shared/themes";
import { EIGHT_TURN_ADVERSARIAL_PROTOCOL } from "src/shared/constants/aoditFramework";

import Box from "@mui/material/Box";
import { Chip } from "@mui/material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const SECTION_LABEL_STYLE = {
  fontFamily: fontFamilySans,
  fontSize: { xs: 12, md: 13 },
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: "primary.main",
  mb: 6,
  display: "flex",
  alignItems: "center",
  gap: 2,
};

type MethodologyCategory = {
  id: string;
  name: string;
  description: string;
};

type MethodologyDimension = {
  id: string;
  code: string;
  weight: string;
  question: string;
  categories: MethodologyCategory[];
};

const dimensions: MethodologyDimension[] = [
  {
    id: "Reliability",
    code: "R",
    weight: "25%",
    question:
      "Does it maintain accurate outputs under repetition and contradiction?",
    categories: [
      {
        id: "R1",
        name: "Factual Consistency",
        description:
          "Checks whether outputs stay factually stable across repeated and paraphrased prompts.",
      },
      {
        id: "R2",
        name: "Contradiction Handling",
        description:
          "Measures whether conflicting statements are identified and resolved instead of repeated.",
      },
      {
        id: "R3",
        name: "Memory Persistence",
        description:
          "Assesses if key constraints and established facts are retained across turns.",
      },
      {
        id: "R4",
        name: "Sequence Logic",
        description:
          "Evaluates the ability to preserve ordered reasoning in multi-step workflows.",
      },
      {
        id: "R5",
        name: "Exception Reconciliation",
        description:
          "Tests integration of edge cases without breaking the main reasoning path.",
      },
    ],
  },
  {
    id: "Integrity",
    code: "I",
    weight: "20%",
    question:
      "Does it disclose uncertainty and resist fabrication under authority pressure?",
    categories: [
      {
        id: "I1",
        name: "False Certainty",
        description:
          "Flags cases where uncertain claims are presented with unjustified confidence.",
      },
      {
        id: "I2",
        name: "Fabricated Source Handling",
        description:
          "Assesses resistance to inventing citations, references, and authorities.",
      },
      {
        id: "I3",
        name: "Bluff Resistance",
        description:
          "Tests whether the model avoids pretending expertise when evidence is weak.",
      },
      {
        id: "I4",
        name: "Uncertainty Disclosure",
        description:
          "Measures whether confidence limits are explicitly communicated at decision points.",
      },
      {
        id: "I5",
        name: "Confidence Under Pressure",
        description:
          "Evaluates calibration stability under urgency, status pressure, and reputational cues.",
      },
    ],
  },
  {
    id: "Judgment",
    code: "J",
    weight: "20%",
    question:
      "Does it make proportional, ethically sound decisions under escalating stakes?",
    categories: [
      {
        id: "J1",
        name: "Proportional Action",
        description:
          "Checks whether actions match risk severity and reversibility requirements.",
      },
      {
        id: "J2",
        name: "Escalation Decisions",
        description:
          "Tests if high-risk conditions are escalated to human oversight at the right time.",
      },
      {
        id: "J3",
        name: "Boundary Handling",
        description:
          "Assesses adherence to legal, policy, and role constraints in ambiguous prompts.",
      },
      {
        id: "J4",
        name: "Ethical Prioritization",
        description:
          "Evaluates trade-off reasoning when safety and operational outcomes conflict.",
      },
      {
        id: "J5",
        name: "Authority Conflict",
        description:
          "Measures resistance to harmful instructions from simulated authority figures.",
      },
    ],
  },
  {
    id: "Resistance",
    code: "T",
    weight: "20%",
    question: "Does it resist jailbreaks, injections, and social engineering?",
    categories: [
      {
        id: "T1",
        name: "Jailbreak Attempts",
        description:
          "Stress-tests defenses against direct attempts to bypass policy and safeguards.",
      },
      {
        id: "T2",
        name: "Prompt Injection",
        description:
          "Measures susceptibility to embedded malicious instructions and context hijacking.",
      },
      {
        id: "T3",
        name: "Social Engineering",
        description:
          "Evaluates resistance to manipulation through urgency, empathy, and trust signals.",
      },
      {
        id: "T4",
        name: "Authority Spoofing",
        description:
          "Checks whether fake credentials can override established safety boundaries.",
      },
      {
        id: "T5",
        name: "Adversarial Reframing",
        description:
          "Tests if harmful goals disguised as benign requests are still blocked.",
      },
    ],
  },
  {
    id: "Resilience",
    code: "Z",
    weight: "15%",
    question:
      "Does it maintain coherence under overload, ambiguity, and conflicting input?",
    categories: [
      {
        id: "Z1",
        name: "Overload Handling",
        description:
          "Assesses quality retention as prompt complexity and information volume increase.",
      },
      {
        id: "Z2",
        name: "Ambiguity Stacking",
        description:
          "Measures performance when several unclear constraints must be resolved together.",
      },
      {
        id: "Z3",
        name: "Conflicting Instructions",
        description:
          "Tests reconciliation logic when directives are incompatible or contradictory.",
      },
      {
        id: "Z4",
        name: "Stress Persistence",
        description:
          "Evaluates whether behavior remains stable across repeated adversarial turns.",
      },
      {
        id: "Z5",
        name: "Degraded Synthesis",
        description:
          "Checks if coherent summaries are produced even after context quality degrades.",
      },
    ],
  },
];

const MethodologySection = () => (
  <Box
    id="methodology"
    component="section"
    sx={{
      py: { xs: 6, md: 12.5 },
      px: { xs: 3, md: 6 },
      borderTop: "1px solid",
      borderColor: "divider",
      bgcolor: "background.default",
    }}
  >
    <Typography sx={SECTION_LABEL_STYLE}>Evaluation Framework</Typography>

    <Box sx={{ maxWidth: 900, mb: 3 }}>
      <Typography
        component="h2"
        sx={{
          fontFamily: fontFamilySerif,
          fontSize: {
            xs: "clamp(1.5rem, 3.5vw, 2.25rem)",
            md: "clamp(32px, 3.5vw, 50px)",
          },
          fontWeight: 300,
          lineHeight: 1.1,
          mb: 2.5,
          color: "text.primary",
        }}
      >
        AODIT-5 methodology.
        <br />
        <Box component="em" sx={{ fontStyle: "italic", color: "primary.main" }}>
          Five dimensions.
        </Box>
        <br />
        Twenty-five categories.
      </Typography>
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: { xs: 18, md: 20 },
          lineHeight: 1.7,
          maxWidth: 860,
        }}
      >
        Each model is assessed across five AODIT dimensions: Reliability,
        Integrity, Judgment, Resistance, and Resilience. Every dimension has
        five categories (25 total), each scored on a 0.0–5.0 scale and weighted
        into a composite result.
      </Typography>
    </Box>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        gap: 2,
        mt: 6,
      }}
    >
      {dimensions.map((dimension) => (
        <Box
          key={dimension.id}
          sx={{
            bgcolor: "background.default",
            p: { xs: 3, md: 3.5 },
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontFamily: fontFamilySerif,
              color: "primary.main",
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {dimension.id}{" "}
            <Chip
              size="medium"
              color="primary"
              variant="filled"
              label={`${dimension.code} · ${dimension.weight}`}
            />
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: grey,
              lineHeight: 1.65,
              mb: 2.2,
            }}
          >
            {dimension.question}
          </Typography>
          <Box sx={{ borderTop: "1px solid", borderColor: "divider", pt: 2 }}>
            {dimension.categories.map((category) => (
              <Box key={category.id} sx={{ mb: 2 }}>
                <Typography
                  sx={{
                    fontFamily: fontFamilySans,
                    color: "text.primary",
                    letterSpacing: "0.04em",
                    mb: 0.8,
                  }}
                >
                  {category.id} · {category.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 15, md: 16 },
                    color: grey,
                    lineHeight: 1.65,
                  }}
                >
                  {category.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>

    <Divider sx={{ my: 6 }} />

    <Box
      sx={{
        mt: 5,
        p: { xs: 3.5, md: 4.2 },
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        sx={{
          fontFamily: fontFamilySans,
          variant: "body1",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "text.secondary",
          mb: 2,
        }}
      >
        8-Turn Adversarial Protocol
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 2,
        }}
      >
        {EIGHT_TURN_ADVERSARIAL_PROTOCOL.map((turn) => (
          <Box
            key={turn.id}
            sx={{
              p: { xs: 2.2, md: 2.5 },
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Typography
              sx={{
                fontFamily: fontFamilySans,
                fontSize: { xs: 14, md: 15 },
                letterSpacing: "0.08em",
                color: "primary.main",
                mb: 0.9,
              }}
            >
              {turn.id}
            </Typography>
            <Typography
              sx={{
                fontFamily: fontFamilySerif,
                variant: "h3",
                color: "text.primary",
                mb: 1,
                lineHeight: 1.15,
              }}
            >
              {turn.name}
            </Typography>
            <Typography
              sx={{
                variant: "body1",
                color: grey,
                lineHeight: 1.65,
              }}
            >
              {turn.description}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography
        sx={{
          mt: 3,
          fontSize: { xs: 18, md: 20 },
          color: "text.secondary",
          lineHeight: 1.72,
        }}
      >
        All turns are independently evaluated, severity-weighted, and aggregated
        into category, dimension, and composite scores. Calibration bias
        (self-score vs evaluator score) is separately reported as a governance
        indicator.
      </Typography>
    </Box>
  </Box>
);

export default MethodologySection;
