import {
  ArrowForward,
  CheckCircleOutlined,
  GppGoodOutlined,
  SecurityOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Grid,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { createWebPageSchema, useSchemaOrg } from "src/shared/utils/schemaOrg";
import {
  primaryColor,
  primaryColorOpaqueEight,
  secondaryColor,
} from "src/application/shared/themes";

import Page from "src/components/shared/Page/Page";
import { routes } from "src/application/routes";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const documentationItems = [
  "Security Policy",
  "Data Processing Agreement",
  "Technical & Organisational Measures",
  "Business Continuity Plan",
  "Terms & Conditions",
];

const SecurityPage = () => {
  const navigate = useNavigate();

  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      "On-Premise AI Evaluation Security",
      "Security architecture and data handling model for aodit on-premise deployment in regulated fintechs and insurance companies.",
      routes.security,
    );
  }, []);

  useSchemaOrg(webPageSchema, "security-webpage-schema");

  return (
    <Page
      title="On-Premise AI Evaluation for Fintechs and Insurance companies | aodit"
      className="security-page"
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
            variant="h2"
            sx={{
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              mb: 2,
              color: "text.primary",
            }}
          >
            On-Premise by Design
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mb: 4, maxWidth: 750, lineHeight: 1.7, fontSize: 17 }}
          >
            <Typography
              component="span"
              fontSize="inherit"
              color="primary.main"
            >
              aodit
            </Typography>{" "}
            is deployed fully within client infrastructure. No data leaves your
            environment. SwissLI AG has no access to AI agent inputs, outputs,
            or logs by default.
          </Typography>

          {/* Deployment flow */}
          <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 3 }}>
                <Box
                  sx={{
                    p: 2.5,
                    border: `2px solid ${secondaryColor}`,
                    textAlign: "center",
                  }}
                >
                  <SecurityOutlined
                    sx={{ fontSize: 28, color: secondaryColor, mb: 1 }}
                  />
                  <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
                    Your Infrastructure
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    On-premise / airgapped
                  </Typography>
                </Box>
              </Grid>
              <Grid
                size={{ xs: 12, md: 1 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ArrowForward
                  sx={{
                    color: primaryColor,
                    fontSize: 28,
                    transform: { xs: "rotate(90deg)", md: "none" },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box
                  sx={{
                    p: 2.5,
                    border: `2px solid ${primaryColor}`,
                    bgcolor: primaryColorOpaqueEight,
                    textAlign: "center",
                  }}
                >
                  <VerifiedUserOutlined
                    sx={{ fontSize: 28, color: primaryColor, mb: 1 }}
                  />
                  <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
                    <Typography
                      component="span"
                      fontSize="inherit"
                      color="primary.main"
                    >
                      aodit
                    </Typography>{" "}
                    Evaluation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Runs inside your environment
                  </Typography>
                </Box>
              </Grid>
              <Grid
                size={{ xs: 12, md: 1 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <ArrowForward
                  sx={{
                    color: primaryColor,
                    fontSize: 28,
                    transform: { xs: "rotate(90deg)", md: "none" },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <Box
                  sx={{
                    p: 2.5,
                    border: `2px solid ${secondaryColor}`,
                    textAlign: "center",
                  }}
                >
                  <GppGoodOutlined
                    sx={{ fontSize: 28, color: secondaryColor, mb: 1 }}
                  />
                  <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
                    Results Stay In-House
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No external data transfer
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* ===== ARCHITECTURE & DATA PROTECTION (2 columns) ===== */}
      <Box component="section" sx={{ py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {/* Left column: Architecture */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h5"
                  sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                >
                  Deployment architecture
                </Typography>
                <List sx={{ listStyleType: "disc", pl: 3 }}>
                  {[
                    "On-premise deployment inside client infrastructure",
                    "Airgapped operation supported",
                    "No external data transfer",
                    "No persistent storage outside client environment",
                  ].map((item) => (
                    <ListItem
                      key={item}
                      sx={{ display: "list-item", py: 0.25 }}
                    >
                      {item}
                    </ListItem>
                  ))}
                </List>

                <Typography
                  variant="h6"
                  sx={{
                    mt: 3,
                    mb: 1.5,
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  Development and testing environments
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  <Typography
                    component="span"
                    fontSize="inherit"
                    color="primary.main"
                  >
                    aodit
                  </Typography>{" "}
                  evaluation frameworks and adversarial scenarios are developed
                  in controlled environments. No client data is ever used in
                  development or testing. All client-specific evaluations are
                  executed exclusively within client on-premise infrastructure.
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    mt: 3,
                    mb: 1.5,
                    fontWeight: 600,
                    color: "text.primary",
                  }}
                >
                  Client-controlled access
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ mb: 1, lineHeight: 1.7 }}
                >
                  Where required, SwissLI AG may access systems via temporary
                  API endpoints or secure tunneled connections.
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  All access is explicitly approved by the client, time-limited,
                  logged, and auditable.
                </Typography>
              </Paper>
            </Grid>

            {/* Right column: Data Protection */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                variant="outlined"
                sx={{ p: 3, mb: 3, bgcolor: "background.default" }}
              >
                <Typography
                  variant="h5"
                  sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                >
                  Data handling principles
                </Typography>
                {[
                  "SwissLI AG does not collect end-user data",
                  "SwissLI AG does not store AI agent transcripts",
                  "SwissLI AG does not train models on client data",
                  "SwissLI AG does not access production outputs by default",
                ].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      mb: 1.5,
                    }}
                  >
                    <CheckCircleOutlined
                      sx={{ fontSize: 18, color: primaryColor, mt: 0.3 }}
                    />
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Paper>

              <Paper
                variant="outlined"
                sx={{ p: 3, bgcolor: "background.default" }}
              >
                <Typography
                  variant="h5"
                  sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                >
                  Security controls
                </Typography>
                {[
                  "TLS 1.2+ encrypted communication",
                  "Zero-trust architecture",
                  "Role-based access control",
                  "Audit logging of administrative actions",
                  "Encrypted storage for internal systems",
                ].map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1.5,
                      mb: 1.5,
                    }}
                  >
                    <CheckCircleOutlined
                      sx={{ fontSize: 18, color: primaryColor, mt: 0.3 }}
                    />
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ===== SWISS GOVERNANCE ===== */}
      <Box component="section" sx={{ py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  borderLeft: `4px solid ${primaryColor}`,
                  height: "100%",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ mb: 1.5, fontWeight: 600, color: "text.primary" }}
                >
                  Swiss governance
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  SwissLI AG is a Swiss company headquartered in Luzern and
                  governed by Swiss law.{" "}
                  <Typography
                    component="span"
                    fontSize="inherit"
                    color="primary.main"
                  >
                    aodit
                  </Typography>{" "}
                  is designed for Swiss banking secrecy and FINMA-regulated
                  deployment expectations.
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h5"
                  sx={{ mb: 1.5, fontWeight: 600, color: "text.primary" }}
                >
                  Documentation
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Available under NDA during vendor onboarding:
                </Typography>
                {documentationItems.map((item) => (
                  <Box
                    key={item}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mb: 1,
                    }}
                  >
                    <CheckCircleOutlined
                      sx={{ fontSize: 16, color: primaryColor }}
                    />
                    <Typography color="text.secondary">{item}</Typography>
                  </Box>
                ))}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{ mt: 2.5 }}
                >
                  <Button
                    variant="contained"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate(routes.contact)}
                  >
                    Request Security Package
                  </Button>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate(routes.demo)}
                  >
                    Try Live Demo
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Page>
  );
};

export default SecurityPage;
