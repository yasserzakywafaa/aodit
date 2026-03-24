import "./FeaturesPage.scss";

import {
  Box,
  Button,
  Chip,
  Container,
  List,
  ListItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  createBreadcrumbSchema,
  createOrganizationSchemaForSite,
  createWebPageSchema,
  useSchemaOrg,
} from "src/shared/utils/schemaOrg";
import {
  fontFamilySerif,
  primaryColor,
  primaryColorOpaqueEight,
} from "src/application/shared/themes";

import { ArrowForward } from "@mui/icons-material";
import ComplianceLogosSection from "./features/ComplianceLogosSection";
import DownloadReportSection from "./features/DownloadReportSection";
import Hero from "./features/Hero";
import Page from "src/components/shared/Page/Page";
import { alpha } from "@mui/material/styles";
import euHostedImgDark from "src/assets/images/eu_hosted_black_text.webp";
import euHostedImgLight from "src/assets/images/eu_hosted_white_text.webp";
import { routes } from "src/application/routes";
import swissMadeImg from "src/assets/images/swiss_made.webp";
import { useApplicationContext } from "src/application/store/Provider";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const FeaturesPage = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { isFetching, themeMode },
    },
  } = useApplicationContext();

  const organizationSchema = useMemo(
    () => createOrganizationSchemaForSite(),
    [],
  );
  const webPageSchema = useMemo(
    () =>
      createWebPageSchema(
        "AI Agent Evaluation for Banks",
        "Independent AI agent evaluation for fintechs and insurance companies with on-premise deployment and no client data access by default.",
        routes.features,
      ),
    [],
  );
  const breadcrumbSchema = useMemo(
    () => createBreadcrumbSchema([{ name: "Home", url: routes.features }]),
    [],
  );

  useSchemaOrg(organizationSchema, "organization-schema");
  useSchemaOrg(webPageSchema, "homepage-webpage-schema");
  useSchemaOrg(breadcrumbSchema, "homepage-breadcrumb-schema");

  return (
    <Page
      title="AI Agent Evaluation for Banks (FINMA & EU AI Act Ready) | AODIT"
      className="features-page"
      isLoading={isFetching}
    >
      {/* ===== SECTION 1 — HERO ===== */}
      <Hero />

      {/* ===== SECTION 2 — TRUST BLOCK ===== */}
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: primaryColorOpaqueEight,
          borderTop: `2px solid ${primaryColor}`,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              fontFamily: fontFamilySerif,
              fontSize: { xs: "1.5rem", md: "1.85rem" },
              mb: 2.5,
              color: "text.primary",
            }}
          >
            Data never leaves your infrastructure
          </Typography>
          <Stack spacing={1.5}>
            <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
              AODIT is deployed fully on-premise within your environment.
              SwissLI AG does not access, store, or process client data by
              default.
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
              All AI agent inputs, outputs, and transcripts remain exclusively
              within your infrastructure.
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
              Designed for Swiss banking secrecy and on-premise deployment
              requirements.
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
            mt={4}
          >
            <Box
              component="img"
              src={themeMode === "dark" ? euHostedImgLight : euHostedImgDark}
              alt="EU Hosted (EU AI Act Ready)"
            />
            <Box component="img" src={swissMadeImg} alt="Swiss Made Software" />
          </Stack>
        </Container>
      </Box>

      {/* ===== SECTION 3 — FEATURED REPORT ===== */}
      <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
        <DownloadReportSection />
      </Box>

      {/* ===== SECTION 4 — WHERE AODIT FITS ===== */}
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: (t) =>
            t.palette.mode === "dark"
              ? alpha(t.palette.primary.main, 0.04)
              : alpha(t.palette.primary.main, 0.02),
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              fontFamily: fontFamilySerif,
              fontSize: { xs: "1.5rem", md: "1.85rem" },
              mb: 3,
              color: "text.primary",
            }}
          >
            Where{" "}
            <Typography
              component="span"
              color="primary.main"
              sx={{
                fontSize: { xs: "1.5rem", md: "1.85rem" },
              }}
            >
              aodit
            </Typography>{" "}
            fits in your AI lifecycle
          </Typography>
          <Paper variant="outlined" sx={{ overflow: "hidden" }}>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: primaryColorOpaqueEight,
                  }}
                >
                  <TableCell
                    sx={{ fontWeight: 700, fontSize: 14, width: "30%" }}
                  >
                    Phase
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>
                    Role
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  {
                    phase: "Before deployment",
                    role: "Independent validation",
                  },
                  {
                    phase: "After updates",
                    role: "Test again to ensure behavior has not degraded",
                  },
                  {
                    phase: "Ongoing",
                    role: "Provide audit-ready evidence for risk and compliance",
                  },
                  {
                    phase: "Post-incident",
                    role: "Analyse what went wrong and why the AI behaved incorrectly",
                  },
                ].map(({ phase, role }, i) => (
                  <TableRow
                    key={phase}
                    sx={{
                      "&:last-child td": { borderBottom: 0 },
                      bgcolor:
                        i % 2 === 1
                          ? (t) =>
                              t.palette.mode === "dark"
                                ? "rgba(255,255,255,0.02)"
                                : "rgba(0,0,0,0.015)"
                          : "transparent",
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>
                      {phase}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary", py: 2 }}>
                      {role}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Container>
      </Box>

      {/* ===== SECTION 5 — WHAT AODIT DOES ===== */}
      <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Box sx={{ borderLeft: `3px solid ${primaryColor}`, pl: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: fontFamilySerif,
                fontSize: { xs: "1.5rem", md: "1.85rem" },
                mb: 2,
                color: "text.primary",
              }}
            >
              Independent behavioral testing under stress
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 1.5, lineHeight: 1.75 }}
            >
              AODIT evaluates how AI agents behave under pressure,
              contradiction, and adversarial input.
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
              Each evaluation uses a structured multi-turn protocol to simulate
              real-world failure scenarios and produce decision-ready evidence
              for risk, audit, and compliance functions.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ===== SECTION 6 — SCOPE BOUNDARIES ===== */}
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: (t) =>
            t.palette.mode === "dark"
              ? "rgba(255,255,255,0.02)"
              : "rgba(0,0,0,0.015)",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              fontFamily: fontFamilySerif,
              fontSize: { xs: "1.5rem", md: "1.85rem" },
              mb: 2,
              color: "text.primary",
            }}
          >
            Scope and boundaries
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.75 }}>
            AODIT currently focuses on independent behavioral evaluation of AI
            agents.
          </Typography>

          <Paper variant="outlined" sx={{ p: 3, mb: 2.5 }}>
            <Typography
              sx={{ fontWeight: 600, mb: 1.5, color: "text.primary" }}
            >
              <Typography component="span" color="primary.main">
                aodit
              </Typography>{" "}
              does not:
            </Typography>
            <List sx={{ listStyleType: "none", p: 0 }}>
              {[
                "Provide regulatory certification",
                "Replace internal governance frameworks",
                "Access training data or model weights",
                "Require access to live production systems",
              ].map((item) => (
                <ListItem key={item} sx={{ py: 0.5, px: 0 }}>
                  <Chip
                    label={item}
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: "divider",
                      fontSize: 13,
                      height: "auto",
                      py: 0.5,
                      "& .MuiChip-label": { whiteSpace: "normal" },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          <Typography
            color="text.secondary"
            sx={{ fontStyle: "italic", fontSize: 14 }}
          >
            Monitoring and real-time control capabilities may be introduced as
            part of future product extensions.
          </Typography>
        </Container>
      </Box>

      {/* ===== SECTION 7 — REGULATORY CONTEXT ===== */}
      <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 3, md: 4 },
              borderLeft: `4px solid ${primaryColor}`,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: fontFamilySerif,
                fontSize: { xs: "1.5rem", md: "1.85rem" },
                mb: 2.5,
                color: "text.primary",
              }}
            >
              Built for FINMA-regulated environments
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 1.5, lineHeight: 1.75 }}
            >
              FINMA Guidance 08/2024 and the EU AI Act require institutions to
              demonstrate effective governance, testing, and monitoring of AI
              systems.
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 1.5, lineHeight: 1.75 }}
            >
              Most institutions lack independent validation of how their AI
              behaves under stress.
            </Typography>
            <Typography
              sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.75 }}
            >
              <Typography component="span" color="primary.main">
                aodit
              </Typography>{" "}
              provides that independent evidence layer.
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* ===== SECTION 8 — COMPLIANCE LOGOS ===== */}
      <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
        <ComplianceLogosSection />
      </Box>

      {/* ===== SECTION 9 — CTA ===== */}
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          textAlign: "center",
          bgcolor: primaryColorOpaqueEight,
          borderTop: `2px solid ${primaryColor}`,
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h3"
            sx={{
              fontFamily: fontFamilySerif,
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              mb: 2,
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            We break your AI before regulators do.
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mb: 4, fontSize: { xs: 16, md: 18 }, lineHeight: 1.75 }}
          >
            Independent evaluation delivered in 2–3 weeks. Fully on-premise.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate(routes.contact)}
            sx={{ px: 5, py: 1.5 }}
          >
            Request Evaluation
          </Button>
        </Container>
      </Box>
    </Page>
  );
};

export default FeaturesPage;
