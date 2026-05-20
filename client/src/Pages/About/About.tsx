import {
  ArrowForward,
  BalanceOutlined,
  LocationOnOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { createWebPageSchema, useSchemaOrg } from "src/shared/utils/schemaOrg";

import Page from "src/components/shared/Page/Page";
import { primaryColor } from "src/application/shared/themes";
import { routes } from "src/application/routes";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const DIFFERENTIATORS = [
  {
    icon: <BalanceOutlined sx={{ fontSize: 28, color: primaryColor }} />,
    title: "Independent",
    description:
      "aodit is not a vendor tool. It evaluates AI agents independently, without access to model weights, training data, or production systems.",
  },
  {
    icon: <LocationOnOutlined sx={{ fontSize: 28, color: primaryColor }} />,
    title: "Swiss",
    description:
      "Headquartered in Luzern, governed by Swiss law. Designed for Swiss banking secrecy and FINMA-regulated deployment expectations.",
  },
  {
    icon: <SecurityOutlined sx={{ fontSize: 28, color: primaryColor }} />,
    title: "Specialized",
    description:
      "Built exclusively for regulated financial services — banking, fintech, and insurance. Not a general-purpose AI testing tool.",
  },
];

const AboutPage = () => {
  const navigate = useNavigate();

  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      "About SwissLI AG",
      "Swiss Lab of Intelligence (SwissLI AG) is a Swiss-based applied AI lab focused on safe AI system evaluation for regulated environments.",
      routes.about,
    );
  }, []);

  useSchemaOrg(webPageSchema, "about-webpage-schema");

  return (
    <Page
      title="About SwissLI AG | Independent AI Evaluation"
      className="about-page"
      isLoading={false}
      noIndex
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
            variant="h2"
            sx={{
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              mb: 2,
              color: "text.primary",
            }}
          >
            About SwissLI AG
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: 750, lineHeight: 1.7, fontSize: 17, mb: 2 }}
          >
            Swiss Lab of Intelligence (SwissLI AG) is a Swiss-based applied AI
            lab founded in 2021 and headquartered in Luzern. The lab focuses on
            building and evaluating AI systems with a strong focus on real-world
            behavior, safety, and system performance.
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ maxWidth: 750, lineHeight: 1.7, fontSize: 17 }}
          >
            <Typography
              component="span"
              fontSize="inherit"
              color="primary.main"
            >
              aodit
            </Typography>{" "}
            is SwissLI&apos;s platform for independent evaluation of AI agents
            in regulated environments, including banking, fintech, and
            insurance.
          </Typography>
        </Container>
      </Box>

      {/* ===== MISSION ===== */}
      <Box component="section" sx={{ py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, md: 4 },
              borderLeft: `4px solid ${primaryColor}`,
              bgcolor: "background.default",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, mb: 1.5, color: "text.primary" }}
            >
              Our mission
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 16, md: 18 },
                color: "text.secondary",
                lineHeight: 1.7,
              }}
            >
              Providing independent behavioral evidence for AI systems deployed
              in regulated financial environments. We believe institutions
              should not have to rely on self-reported model performance when
              making risk, compliance, and governance decisions about their AI
              systems.
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* ===== WHAT MAKES US DIFFERENT ===== */}
      <Box component="section" sx={{ py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.35rem", md: "1.75rem" },
              mb: 4,
              color: "text.primary",
            }}
          >
            What makes us different
          </Typography>
          <Grid container spacing={3}>
            {DIFFERENTIATORS.map(({ icon, title, description }) => (
              <Grid key={title} size={{ xs: 12, md: 4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    height: "100%",
                    borderTop: `3px solid ${primaryColor}`,
                  }}
                >
                  <Box sx={{ mb: 2 }}>{icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
                  >
                    {title}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== EXPERTISE ===== */}
      <Box component="section" sx={{ py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: "1.35rem", md: "1.75rem" },
                  mb: 2,
                  color: "text.primary",
                }}
              >
                Built with security expertise
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ lineHeight: 1.7, mb: 2 }}
              >
                SwissLI AG works with experienced security specialists in
                cybersecurity, infrastructure protection, and adversarial
                testing to support robust evaluation methodologies.
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Our evaluation framework is informed by real-world failure
                patterns observed in production AI deployments across financial
                services.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                variant="outlined"
                sx={{ p: 3, bgcolor: "background.default" }}
              >
                <Typography
                  sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
                >
                  Areas of expertise
                </Typography>
                {[
                  "Adversarial testing and red-teaming",
                  "Behavioral evaluation under stress",
                  "On-premise deployment and airgapped operation",
                  "Regulatory alignment (FINMA, EU AI Act)",
                  "Multi-turn conversation analysis",
                ].map((item) => (
                  <Typography
                    key={item}
                    color="text.secondary"
                    sx={{
                      py: 0.75,
                      pl: 2,
                      borderLeft: `2px solid ${primaryColor}`,
                      mb: 1,
                      fontSize: 14,
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ===== CTA ===== */}
      <Box
        component="section"
        sx={{ py: { xs: 6, md: 8 }, textAlign: "center" }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            sx={{
              fontSize: { xs: "1.35rem", md: "1.75rem" },
              mb: 2,
              color: "text.primary",
            }}
          >
            Start a conversation
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
            We work with banks, fintechs, and insurers operating in
            FINMA-regulated environments. Let us know how we can help.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="center"
          >
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => navigate(routes.contact)}
            >
              Contact Us
            </Button>
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              onClick={() => navigate(routes.demo)}
            >
              Try Live Demo
            </Button>
          </Stack>
        </Container>
      </Box>
    </Page>
  );
};

export default AboutPage;
