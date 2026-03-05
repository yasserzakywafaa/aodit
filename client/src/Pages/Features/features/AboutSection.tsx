import {
  fontFamilyMono,
  fontFamilySerif,
  primaryColor,
} from "src/application/shared/themes";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const SECTION_LABEL_STYLE = {
  fontFamily: fontFamilyMono,
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: primaryColor,
  mb: 6,
  display: "flex",
  alignItems: "center",
  gap: 2,
};

const stats = [
  { num: "6", label: "Models Rated" },
  { num: "7", label: "Adversarial Turns" },
  { num: "4", label: "Attack Vectors" },
  { num: "5", label: "Rating Dimensions" },
];

const coverage = [
  { name: "Financial Services Banking", status: "Active", active: true },
  { name: "Insurance & Claims", status: "2026 Q3", active: false },
  { name: "Healthcare Triage Agents", status: "2026 Q4", active: false },
  { name: "Legal & Compliance Agents", status: "2027", active: false },
];

const AboutSection = () => (
  <Box
    id="about"
    component="section"
    sx={{
      py: { xs: 6, md: 12.5 },
      px: { xs: 3, md: 6 },
      borderTop: "1px solid",
      borderColor: "divider",
      bgcolor: "background.paper",
    }}
  >
    <Typography sx={SECTION_LABEL_STYLE}>About Aodit</Typography>

    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: { xs: 6, md: 12.5 },
        alignItems: "start",
      }}
    >
      <Box>
        <Typography
          component="h2"
          sx={{
            fontFamily: fontFamilySerif,
            fontSize: {
              xs: "clamp(1.5rem, 3.5vw, 2.25rem)",
              md: "clamp(32px, 3.5vw, 50px)",
            },
            fontWeight: 300,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            mb: 4,
            color: "text.primary",
          }}
        >
          An{" "}
          <Box component="em" sx={{ fontStyle: "italic", color: primaryColor }}>
            independent
          </Box>
          <br />
          institution for
          <br />
          AI risk clarity
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 15,
            lineHeight: 1.8,
            mb: 2.5,
          }}
        >
          Aodit — the AI-Powered Agent Risk Index — produces independent
          behavioral ratings for AI agents deployed in high-stakes financial and
          enterprise environments.
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 15,
            lineHeight: 1.8,
            mb: 2.5,
          }}
        >
          We exist because the gap between AI capability and AI governance is
          real, growing, and consequential. Risk officers and compliance teams
          need legible, rigorous, independent assessments — not vendor claims.
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 15,
            lineHeight: 1.8,
            mb: 2.5,
          }}
        >
          Our methodology is modelled on established credit-rating frameworks,
          adapted for the specific failure modes of large language models in
          adversarial real-world conditions.
        </Typography>
        <Typography
          sx={{
            fontFamily: fontFamilyMono,
            fontSize: 11,
            color: "text.secondary",
            mt: 4,
            letterSpacing: "0.05em",
          }}
        >
          Zurich, Switzerland · Founded 2026 · Independent · Not affiliated with
          any AI vendor
        </Typography>
      </Box>

      <Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1px",
            bgcolor: "divider",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {stats.map((s) => (
            <Box key={s.label} sx={{ bgcolor: "background.default", p: 3.5 }}>
              <Typography
                sx={{
                  fontFamily: fontFamilySerif,
                  fontSize: 48,
                  fontWeight: 300,
                  color: primaryColor,
                  lineHeight: 1,
                  mb: 1,
                }}
              >
                {s.num}
              </Typography>
              <Typography
                sx={{
                  fontFamily: fontFamilyMono,
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                }}
              >
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 3, p: 3, border: "1px solid", borderColor: "divider" }}>
          <Typography
            sx={{
              fontFamily: fontFamilyMono,
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "text.secondary",
              mb: 2,
            }}
          >
            Evaluation Coverage
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            {coverage.map((c, i) => (
              <Box
                key={c.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pb: 1.25,
                  ...(i < coverage.length - 1
                    ? { borderBottom: "1px solid", borderColor: "divider" }
                    : {}),
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    color: c.active ? "text.primary" : "text.secondary",
                  }}
                >
                  {c.name}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: fontFamilyMono,
                    fontSize: 10,
                    color: c.active ? primaryColor : "text.secondary",
                  }}
                >
                  {c.status}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

export default AboutSection;
