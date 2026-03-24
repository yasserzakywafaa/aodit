import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  DEFAULT_FRAMEWORK_VERSION,
  getFrameworkDefinition,
} from "src/shared/constants/aoditFramework";
import { createWebPageSchema, useSchemaOrg } from "src/shared/utils/schemaOrg";

import Page from "src/components/shared/Page/Page";
import { primaryColor } from "src/application/shared/themes";
import { routes } from "src/application/routes";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const framework = getFrameworkDefinition(DEFAULT_FRAMEWORK_VERSION);

const MethodologyPage = () => {
  const navigate = useNavigate();

  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      "AI Agent Testing Methodology",
      "AODIT-6 methodology for independent AI agent behavioral evaluation across six dimensions and eight adversarial turns.",
      routes.methodology,
    );
  }, []);

  useSchemaOrg(webPageSchema, "methodology-webpage-schema");

  return (
    <Page
      title="AI Agent Testing Methodology for Financial Institutions | AODIT"
      className="methodology-page"
      isLoading={false}
    >
      {/* ===== HERO ===== */}
      <Box
        component="section"
        sx={{
          pt: { xs: 8, md: 10 },
          pb: { xs: 4, md: 6 },
          px: { xs: 3, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h6"
            sx={{
              color: primaryColor,
              fontWeight: 600,
              mb: 1,
              fontSize: 14,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            AODIT-6 behavioral evaluation framework
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              mb: 2,
              maxWidth: 800,
              color: "text.primary",
            }}
          >
            AI Agent Testing Methodology
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: 800, mb: 2, lineHeight: 1.7, fontSize: 17 }}
          >
            AODIT evaluates how AI agents behave under stress, contradiction,
            and adversarial pressure. The framework is designed for risk,
            compliance, and audit teams that require independent evidence rather
            than self-reported model performance.
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mt: 3,
              maxWidth: 600,
            }}
          >
            <Typography
              sx={{
                fontWeight: 600,
                mb: 0.5,
                color: "text.primary",
                fontSize: 14,
              }}
            >
              Who this is for
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: 14 }}>
              Risk teams, compliance officers, and audit functions who need
              independent behavioral evidence rather than vendor-supplied
              benchmarks.
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* ===== SIX DIMENSIONS ===== */}
      <Box component="section" sx={{ py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.35rem", md: "1.75rem" },
              mb: 1.5,
              color: "text.primary",
            }}
          >
            Six evaluation dimensions
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Each dimension measures a distinct behavioral risk class using
            structured multi-turn scenarios.
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 4 }}>
            {framework.dimensions.map((dimension) => (
              <Chip key={dimension} label={dimension} color="primary" />
            ))}
          </Stack>

          <Grid container spacing={2.5}>
            {framework.dimensions.map((dimension) => (
              <Grid key={dimension} size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    height: "100%",
                    borderTop: `3px solid ${primaryColor}`,
                    bgcolor: "background.default",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: primaryColor, fontWeight: 600, mb: 1 }}
                  >
                    {dimension}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    sx={{ mb: 1.5, fontSize: 14, lineHeight: 1.6 }}
                  >
                    {framework.dimensionQuestions[dimension]}
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={0.75}>
                    {(framework.categories[dimension] ?? []).map((category) => (
                      <Chip
                        key={category.id}
                        variant="outlined"
                        size="small"
                        label={`${category.id} ${category.name}`}
                        sx={{ fontSize: 11 }}
                      />
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== EIGHT-TURN PROTOCOL ===== */}
      <Box component="section" sx={{ py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.35rem", md: "1.75rem" },
              mb: 1.5,
              color: "text.primary",
            }}
          >
            Eight-turn adversarial protocol
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 700 }}>
            Every evaluation runs an eight-turn sequence that increases pressure
            progressively and then tests recovery.
          </Typography>

          <Box sx={{ display: "grid", gap: 0 }}>
            {framework.turnProtocol.map((turn, index) => (
              <Box
                key={turn.id}
                sx={{
                  display: "flex",
                  gap: 3,
                  pb: 3,
                  mb: 0,
                }}
              >
                {/* Timeline dot and line */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    minWidth: 32,
                  }}
                >
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: primaryColor,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Box>
                  {index < framework.turnProtocol.length - 1 && (
                    <Box
                      sx={{
                        width: 2,
                        flexGrow: 1,
                        bgcolor: "divider",
                        mt: 0.5,
                      }}
                    />
                  )}
                </Box>

                {/* Content */}
                <Box sx={{ pt: 0.25 }}>
                  <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
                    {turn.name}
                  </Typography>
                  <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                    {turn.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ===== CTA ===== */}
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 8 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.35rem", md: "1.75rem" },
              mb: 1.5,
              color: "text.primary",
            }}
          >
            Independent by design
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
            AODIT is an independent evaluation layer. It does not certify
            models, replace governance frameworks, or access model weights.
          </Typography>
          <Button variant="contained" onClick={() => navigate(routes.contact)}>
            Request Evaluation
          </Button>
        </Container>
      </Box>
    </Page>
  );
};

export default MethodologyPage;
