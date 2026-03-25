import {
  DEFAULT_FRAMEWORK_VERSION,
  getFrameworkDefinition,
} from "src/shared/constants/aoditFramework";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { fontFamilyPlayfairDisplay } from "src/application/shared/themes";

const framework = getFrameworkDefinition(DEFAULT_FRAMEWORK_VERSION);
const dimensionCodeByName: Record<string, string> = {
  Reliability: "R",
  Integrity: "I",
  Confidentiality: "C",
  Judgment: "J",
  Resistance: "T",
  Resilience: "Z",
};

const SECTION_LABEL_STYLE = {
  textTransform: "uppercase" as const,
  color: "primary.main",
  mb: 6,
  display: "flex",
  alignItems: "center",
  gap: 2,
};

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

    {/*  Overview Section */}
    <Box sx={{ maxWidth: 960, mb: 3 }}>
      <Typography
        component="h2"
        sx={{
          fontFamily: fontFamilyPlayfairDisplay,
          fontSize: {
            xs: "clamp(2rem, 5.2vw, 2.8rem)",
            md: "clamp(42px, 5.2vw, 64px)",
          },
          fontWeight: 300,
          lineHeight: 1.1,
          mb: 2.5,
          color: "text.primary",
        }}
      >
        AODIT-6 methodology.
        <br />
        <Box component="em" sx={{ fontStyle: "italic", color: "primary.main" }}>
          Six dimensions.
        </Box>
        <br />
        Thirty categories.
      </Typography>
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: { xs: 18, md: 20 },
          lineHeight: 1.7,
          maxWidth: 900,
        }}
      >
        AODIT-6 evaluates AI behavior across six dimensions and five categories
        per dimension. Results are independently scored on a 0.0–5.0 scale and
        combined using weighted aggregation to produce a composite rating.
      </Typography>
    </Box>

    {/* Six Dimensions Section */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        gap: 2,
        mt: 6,
      }}
    >
      {framework.dimensions.map((dimension) => {
        const categories = framework.categories[dimension] ?? [];
        const code =
          dimensionCodeByName[dimension] ?? dimension[0]?.toUpperCase();
        const weightPct = Math.round((framework.weights[dimension] ?? 0) * 100);
        return (
          <Box
            key={dimension}
            sx={{
              bgcolor: "background.paper",
              p: { xs: 2, md: 3.5 },
              border: "1px solid",
              borderColor: "primary.main",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
              flexWrap="wrap-reverse"
            >
              <Typography variant="h4" color="primary.main">
                {dimension}
              </Typography>

              <Chip
                color="primary"
                variant="filled"
                label={`${code} · ${weightPct}%`}
              />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: 16, md: 17 },
                lineHeight: 1.65,
                mb: 2.2,
              }}
            >
              {framework.dimensionQuestions[dimension] ?? ""}
            </Typography>
            <Box sx={{ borderTop: "1px solid", borderColor: "divider", pt: 2 }}>
              {categories.map((category) => (
                <Box key={category.id} sx={{ mb: 2 }}>
                  <Typography
                    sx={{
                      color: "text.primary",
                      mb: 1,
                    }}
                  >
                    {category.id} · {category.name}
                  </Typography>

                  <Typography color="text.secondary">
                    {category.methodologyExplanation}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        );
      })}
    </Box>

    {/*  8-Turn Adversarial Protocol Section */}
    <Box mt={6} p={1}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        mb={2}
        flexWrap="wrap-reverse"
      >
        <Typography color="primary.main" variant="h4">
          8-Round Adversarial Protocol
        </Typography>
      </Box>
      <Typography
        sx={{
          mb: 2,
          maxWidth: 980,
        }}
      >
        The evaluation process runs eight structured adversarial turns under
        adversarial pressure to evaluate stability, boundary handling,
        manipulation resistance, and post-stress recovery.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          gap: 2,
        }}
      >
        {framework.turnProtocol.map((turn) => (
          <Box
            key={turn.id}
            sx={{
              p: { xs: 2.2, md: 2.5 },
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap={1}
              mb={2}
            >
              <Typography variant="h5">{turn.name}</Typography>

              <Chip color="primary" variant="outlined" label={`${turn.id}`} />
            </Box>

            <Typography variant="body2" color="text.secondary">
              {turn.description}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  </Box>
);

export default MethodologySection;
