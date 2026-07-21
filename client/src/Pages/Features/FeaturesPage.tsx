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
import type { LandingPageContent } from "src/application/shared/landingPages";
import Page from "src/components/shared/Page/Page";
import { alpha } from "@mui/material/styles";
import APP_CONSTANTS from "src/application/shared/app_constants";
import euHostedImg from "src/assets/images/eu_hosted.webp";
import { routes } from "src/application/routes";
import { trackEvent } from "src/shared/utils/ga4";
import swissMadeImg from "src/assets/images/swiss_made.webp";
import { useApplicationContext } from "src/application/store/Provider";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  type Region,
  createWebsiteSchema,
  getHreflangAlternates,
} from "src/application/shared/regionContent";
import { useRegionHomeContent } from "src/i18n/useRegionHomeContent";

interface FeaturesPageProps {
  /**
   * Home page region variant. "global" is the default for `/`; "swiss" for `/ch`.
   */
  region?: Region;
  /**
   * Optional landing-page content overrides. When provided, the page renders as
   * an industry-specific SEO landing variant. When omitted, copy comes from
   * HOME_CONTENT for the given region.
   */
  landingContent?: LandingPageContent;
}

const FeaturesPage = ({
  region = "global",
  landingContent,
}: FeaturesPageProps = {}) => {
  const { t } = useTranslation(["page", "common"]);
  const navigate = useNavigate();
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();

  const homeContent = useRegionHomeContent(region);

  const pageTitle = landingContent?.pageTitle ?? homeContent.pageTitle;
  const metaDescription =
    landingContent?.metaDescription ?? homeContent.metaDescription;
  const ogTitle = landingContent?.pageTitle ?? homeContent.ogTitle;
  const ogDescription =
    landingContent?.metaDescription ?? homeContent.ogDescription;
  const schemaName = landingContent?.schemaName ?? homeContent.schemaName;
  const schemaDescription =
    landingContent?.schemaDescription ?? homeContent.schemaDescription;
  const canonicalPath =
    landingContent?.slug ??
    (region === "swiss" ? routes.featuresCh : routes.features);
  const ctaTitle = landingContent?.cta.title ?? homeContent.cta.title;
  const ctaSubtitle = landingContent?.cta.subtitle ?? homeContent.cta.subtitle;
  const heroContent: HeroContent | undefined =
    landingContent?.hero ?? homeContent.hero;
  const trustBlockCopy =
    landingContent?.trustBlock ?? homeContent.trustBlock;

  const demoDefaultSystemPrompt = landingContent?.defaultSystemPrompt;
  const demoStorageKey = landingContent
    ? `aodit.publicDemo.landing.${landingContent.key}.v1`
    : undefined;

  const schemaKeySuffix = landingContent?.key ?? `home-${region}`;

  const baseUrl = APP_CONSTANTS.APP_URL || "https://www.aodit.ai";
  const hreflangAlternates = landingContent
    ? undefined
    : getHreflangAlternates(baseUrl);

  const organizationSchema = useMemo(
    () => createOrganizationSchemaForSite(undefined, region),
    [region],
  );
  const websiteSchema = useMemo(
    () => createWebsiteSchema(region),
    [region],
  );
  const webPageSchema = useMemo(
    () => createWebPageSchema(schemaName, schemaDescription, canonicalPath),
    [schemaName, schemaDescription, canonicalPath],
  );
  const breadcrumbSchema = useMemo(() => {
    const crumbs = [{ name: t("breadcrumb.home"), url: routes.features }];
    if (landingContent) {
      crumbs.push({
        name: landingContent.breadcrumbLabel,
        url: landingContent.slug,
      });
    }
    return createBreadcrumbSchema(crumbs);
  }, [landingContent, t]);

  useSchemaOrg(organizationSchema, `organization-schema-${schemaKeySuffix}`);
  useSchemaOrg(websiteSchema, `website-schema-${schemaKeySuffix}`);
  useSchemaOrg(webPageSchema, `webpage-schema-${schemaKeySuffix}`);
  useSchemaOrg(breadcrumbSchema, `breadcrumb-schema-${schemaKeySuffix}`);

  const showSwissBadges = region === "swiss" && !landingContent;
  const showFinmaRegulatory = region === "swiss" && !landingContent;
  const ctaLocation = landingContent ? "industry_page" : "features_page";

  const handleRequestEvaluationClick = () => {
    trackEvent("cta_click", {
      cta: "request_evaluation",
      location: ctaLocation,
    });
    navigate(routes.contact);
  };

  const handleTryLiveDemoClick = () => {
    trackEvent("cta_click", {
      cta: "try_live_demo",
      location: ctaLocation,
    });
    navigate(routes.demo);
  };

  return (
    <Page
      title={pageTitle}
      description={metaDescription}
      ogTitle={ogTitle}
      ogDescription={ogDescription}
      hreflangAlternates={hreflangAlternates}
      className="features-page"
      isLoading={isFetching}
    >
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
            <Typography
              sx={{
                color: "text.secondary",
                lineHeight: 1.75
              }}>
              <Typography
                component="span"
                sx={{
                  fontSize: "inherit",
                  color: "primary.main"
                }}>
                aodit
              </Typography>{" "}
              {trustBlockCopy.line1}
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                lineHeight: 1.75
              }}>
              {trustBlockCopy.line2}
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                lineHeight: 1.75
              }}>
              {trustBlockCopy.line3}
            </Typography>
          </Stack>

          {showSwissBadges && (
            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
                mt: 4
              }}>
              <Box
                component="img"
                src={euHostedImg}
                alt={t("features.euHostedAlt")}
                sx={{ maxWidth: "200px" }}
              />
              <Box
                component="img"
                src={swissMadeImg}
                alt={t("features.swissMadeAlt")}
                sx={{ maxWidth: "200px" }}
              />
            </Stack>
          )}
        </Container>
      </Box>
      <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
        <AoditDemoPlayground
          defaultSystemPrompt={demoDefaultSystemPrompt}
          storageKey={demoStorageKey}
          sourceLabel={
            landingContent?.breadcrumbLabel ??
            landingContent?.schemaName ??
            t("cta.home")
          }
        />
      </Box>
      {/* ===== SECTION 3 — FEATURED REPORT ===== */}
      <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <DownloadReportSection region={landingContent ? "global" : region} />
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
              sx={{
                color: "primary.main",
                fontSize: { xs: "1.5rem", md: "1.85rem" }
              }}>
              aodit
            </Typography>{" "}
            {t("features.lifecycleTitle")}
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
                    {t("features.lifecyclePhase")}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: 14 }}>
                    {t("features.lifecycleRole")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(
                  t("features.lifecycleRows", {
                    returnObjects: true,
                  }) as { phase: string; role: string }[]
                ).map(({ phase, role }, i) => (
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
              {t("features.behavioralTitle")}
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                mb: 1.5,
                lineHeight: 1.75
              }}>
              <Typography
                component="span"
                sx={{
                  fontSize: "inherit",
                  color: "primary.main"
                }}>
                aodit
              </Typography>{" "}
              {t("features.behavioralBody1")}
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                lineHeight: 1.75
              }}>
              {t("features.behavioralBody2")}
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
            {t("features.scopeTitle")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              mb: 2,
              lineHeight: 1.75
            }}>
            <Typography
              component="span"
              sx={{
                fontSize: "inherit",
                color: "primary.main"
              }}>
              aodit
            </Typography>{" "}
            {t("features.scopeIntro")}
          </Typography>

          <Paper variant="outlined" sx={{ p: 3, mb: 2.5 }}>
            <Typography
              sx={{ fontWeight: 600, mb: 1.5, color: "text.primary" }}
            >
              <Typography component="span" sx={{
                color: "primary.main"
              }}>
                aodit
              </Typography>{" "}
              {t("features.scopeDoesNot")}
            </Typography>
            <List sx={{ listStyleType: "none", p: 0 }}>
              {(t("features.scopeItems", { returnObjects: true }) as string[]).map((item) => (
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
            sx={{
              color: "text.secondary",
              fontStyle: "italic",
              fontSize: 14
            }}>
            {t("features.scopeNote")}
          </Typography>
        </Container>
      </Box>
      {/* ===== SECTION 7 — REGULATORY CONTEXT ===== */}
      {!landingContent && (
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
                {homeContent.regulatorySectionTitle}
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  mb: 1.5,
                  lineHeight: 1.75
                }}>
                {homeContent.regulatorySectionBody1}
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  mb: 1.5,
                  lineHeight: 1.75
                }}>
                {homeContent.regulatorySectionBody2}
              </Typography>
              <Typography
                sx={{ fontWeight: 600, color: "text.primary", lineHeight: 1.75 }}
              >
                <Typography component="span" sx={{
                  color: "primary.main"
                }}>
                  aodit
                </Typography>{" "}
                {homeContent.regulatorySectionBody3}
              </Typography>
            </Paper>
          </Container>
        </Box>
      )}
      {/* ===== SECTION 8 — COMPLIANCE LOGOS (Swiss only) ===== */}
      {showFinmaRegulatory && (
        <Box component="section" sx={{ pb: { xs: 6, md: 8 } }}>
          <ComplianceLogosSection />
        </Box>
      )}
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
            sx={{
              color: "text.secondary",
              mb: 4,
              fontSize: { xs: 16, md: 18 },
              lineHeight: 1.75
            }}>
            {ctaSubtitle}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{
              justifyContent: "center"
            }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={handleRequestEvaluationClick}
              sx={{ px: 5, py: 1.5 }}
            >
              {t("common:nav.requestEvaluation")}
            </Button>
            <Button
              variant="outlined"
              size="large"
              endIcon={<ArrowForward />}
              onClick={handleTryLiveDemoClick}
              sx={{ px: 5, py: 1.5 }}
            >
              {t("common:footer.tryLiveDemo")}
            </Button>
          </Stack>
        </Container>
      </Box>
    </Page>
  );
};

export default FeaturesPage;
