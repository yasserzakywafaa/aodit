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
import Hero, { HeroContent } from "./features/Hero";
import {
  createBreadcrumbSchema,
  createOrganizationSchemaForSite,
  createWebPageSchema,
  useSchemaOrg,
} from "src/shared/utils/schemaOrg";
import {
  primaryColor,
  primaryColorOpaqueEight,
} from "src/application/shared/themes";

import AoditDemoPlayground from "src/components/shared/AoditDemoPlayground";
import { ArrowForward } from "@mui/icons-material";
import ComplianceLogosSection from "./features/ComplianceLogosSection";
import DownloadReportSection from "./features/DownloadReportSection";
import {
  DEFAULT_TRUST_BLOCK_COPY,
  type LandingPageContent,
} from "src/application/shared/landingPages";
import Page from "src/components/shared/Page/Page";
import { alpha } from "@mui/material/styles";
import euHostedImg from "src/assets/images/eu_hosted.webp";
import { routes } from "src/application/routes";
import swissMadeImg from "src/assets/images/swiss_made.webp";
import { useApplicationContext } from "src/application/store/Provider";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_PAGE_TITLE =
  "AI Agent Evaluation for Fintech & Insurers (FINMA & EU AI Act Ready) | aodit";
const DEFAULT_SCHEMA_NAME = "AI Agent Evaluation for Fintech & Insurers";
const DEFAULT_SCHEMA_DESCRIPTION =
  "Independent AI agent evaluation for fintechs and insurance companies with on-premise deployment and no client data access by default.";
const DEFAULT_CTA_TITLE = "We break your AI before regulators do.";
const DEFAULT_CTA_SUBTITLE =
  "Independent evaluation delivered in 2–3 weeks. Fully on-premise.";

interface FeaturesPageProps {
  /**
   * Optional landing-page content overrides. When provided, the page renders as
   * an industry-specific SEO landing variant. When omitted, the page behaves
   * exactly like the original home/features page.
   */
  landingContent?: LandingPageContent;
}

const FeaturesPage = ({ landingContent }: FeaturesPageProps = {}) => {
  const navigate = useNavigate();
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();

  const pageTitle = landingContent?.pageTitle ?? DEFAULT_PAGE_TITLE;
  const schemaName = landingContent?.schemaName ?? DEFAULT_SCHEMA_NAME;
  const schemaDescription =
    landingContent?.schemaDescription ?? DEFAULT_SCHEMA_DESCRIPTION;
  const canonicalPath = landingContent?.slug ?? routes.features;
  const ctaTitle = landingContent?.cta.title ?? DEFAULT_CTA_TITLE;
  const ctaSubtitle = landingContent?.cta.subtitle ?? DEFAULT_CTA_SUBTITLE;
  const heroContent: HeroContent | undefined = landingContent?.hero;
  const trustBlockCopy = landingContent?.trustBlock ?? DEFAULT_TRUST_BLOCK_COPY;

  const demoDefaultSystemPrompt = landingContent?.defaultSystemPrompt;
  const demoStorageKey = landingContent
    ? `aodit.publicDemo.landing.${landingContent.key}.v1`
    : undefined;

  const schemaKeySuffix = landingContent?.key ?? "home";

  const organizationSchema = useMemo(
    () => createOrganizationSchemaForSite(),
    [],
  );
  const webPageSchema = useMemo(
    () => createWebPageSchema(schemaName, schemaDescription, canonicalPath),
    [schemaName, schemaDescription, canonicalPath],
  );
  const breadcrumbSchema = useMemo(() => {
    const crumbs = [{ name: "Home", url: routes.features }];
    if (landingContent) {
      crumbs.push({
        name: landingContent.breadcrumbLabel,
        url: landingContent.slug,
      });
    }
    return createBreadcrumbSchema(crumbs);
  }, [landingContent]);

  useSchemaOrg(organizationSchema, "organization-schema");
  useSchemaOrg(webPageSchema, `webpage-schema-${schemaKeySuffix}`);
  useSchemaOrg(breadcrumbSchema, `breadcrumb-schema-${schemaKeySuffix}`);

  return (
    <Page title={pageTitle} className="features-page" isLoading={isFetching}>
      {/* ===== SECTION 1 — HERO ===== */}
      <Hero content={heroContent} />

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
              fontSize: { xs: "1.5rem", md: "1.85rem" },
              mb: 2.5,
              color: "text.primary",
            }}
          >
            {trustBlockCopy.title}
          </Typography>
          <Stack spacing={1.5}>
            <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
              <Typography
                component="span"
                fontSize="inherit"
                color="primary.main"
              >
                aodit
              </Typography>{" "}
              {trustBlockCopy.line1}
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
              {trustBlockCopy.line2}
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
              {trustBlockCopy.line3}
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
              src={euHostedImg}
              alt="EU Hosted (EU AI Act Ready)"
              sx={{ maxWidth: "200px" }}
            />
            <Box
              component="img"
              src={swissMadeImg}
              alt="Swiss Made Software"
              sx={{ maxWidth: "200px" }}
            />
          </Stack>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
        <AoditDemoPlayground
          defaultSystemPrompt={demoDefaultSystemPrompt}
          storageKey={demoStorageKey}
        />
      </Box>

      {/* ===== SECTION 3 — FEATURED REPORT ===== */}
      <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <DownloadReportSection />
        </Container>
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
              <Typography
                component="span"
                fontSize="inherit"
                color="primary.main"
              >
                aodit
              </Typography>{" "}
              evaluates how AI agents behave under pressure, contradiction, and
              adversarial input.
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
              fontSize: { xs: "1.5rem", md: "1.85rem" },
              mb: 2,
              color: "text.primary",
            }}
          >
            Scope and boundaries
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.75 }}>
            <Typography
              component="span"
              fontSize="inherit"
              color="primary.main"
            >
              aodit
            </Typography>{" "}
            currently focuses on independent behavioral evaluation of AI agents.
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
      <Box component="section" sx={{ pb: { xs: 6, md: 8 } }}>
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
              fontSize: { xs: "1.75rem", md: "2.5rem" },
              mb: 2,
              color: "text.primary",
              lineHeight: 1.2,
            }}
          >
            {ctaTitle}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mb: 4, fontSize: { xs: 16, md: 18 }, lineHeight: 1.75 }}
          >
            {ctaSubtitle}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate(routes.contact)}
              sx={{ px: 5, py: 1.5 }}
            >
              Request Evaluation
            </Button>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              onClick={() => navigate(routes.demo)}
              sx={{ px: 5, py: 1.5 }}
            >
              Try Live Demo
            </Button>
          </Stack>
        </Container>
      </Box>
    </Page>
  );
};

export default FeaturesPage;
