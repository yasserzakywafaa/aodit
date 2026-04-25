import {
  ArrowForwardRounded,
  BusinessRounded,
  CampaignRounded,
  CodeRounded,
  GavelRounded,
  GroupsRounded,
  LocalHospitalRounded,
  SupportAgentRounded,
  TrendingUpRounded,
  WalletRounded,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import {
  LANDING_PAGE_CATEGORIES,
  LANDING_PAGES,
  type LandingPageCategoryId,
} from "src/application/shared/landingPages";
import { routes } from "src/application/routes";
import Page from "src/components/shared/Page/Page";
import { useNavigate } from "react-router-dom";

const PAGE_TITLE =
  "Industries | aodit – AI Agent Risk Evaluation & Stress Testing";
const PAGE_META_DESCRIPTION =
  "Explore how aodit stress-tests AI agents across industries, from finance and healthcare to legal, IT, and customer operations.";

const CATEGORY_ICON_MAP: Record<LandingPageCategoryId, typeof BusinessRounded> =
  {
    customerExperience: SupportAgentRounded,
    salesRevenue: TrendingUpRounded,
    developerIt: CodeRounded,
    financeOperations: WalletRounded,
    hrRecruiting: GroupsRounded,
    healthcare: LocalHospitalRounded,
    legalCompliance: GavelRounded,
    marketing: CampaignRounded,
  };

const CATEGORY_LABEL_MAP = LANDING_PAGE_CATEGORIES.reduce<
  Record<LandingPageCategoryId, string>
>(
  (acc, category) => {
    acc[category.id] = category.label;
    return acc;
  },
  {} as Record<LandingPageCategoryId, string>,
);

const toShortDescription = (description: string): string => {
  const normalized = description.replace(/\s+/g, " ").trim();
  const sentences = normalized.split(/(?<=[.!?])\s+/);
  return sentences.slice(0, 2).join(" ");
};

const IndustriesHub = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let descriptionMeta = document.querySelector(
      "meta[name='description']",
    ) as HTMLMetaElement | null;

    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.setAttribute("name", "description");
      document.head.appendChild(descriptionMeta);
    }

    descriptionMeta.setAttribute("content", PAGE_META_DESCRIPTION);
  }, []);

  return (
    <Page title={PAGE_TITLE} className="industries-hub-page">
      <Box
        component="section"
        sx={{
          py: { xs: 8, md: 12 },
          borderBottom: "1px solid",
          borderColor: "divider",
          background: (theme) =>
            `linear-gradient(180deg, ${alpha(theme.palette.primary.main, theme.palette.mode === "dark" ? 0.14 : 0.06)} 0%, ${theme.palette.background.default} 65%)`,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={2.5} alignItems="flex-start">
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 1.1,
                fontWeight: 700,
                maxWidth: 900,
              }}
            >
              AI Agent Risk Testing Across Industries
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                maxWidth: 760,
                fontSize: { xs: "1rem", md: "1.15rem" },
                lineHeight: 1.7,
              }}
            >
              Evaluate mission-critical AI agents with independent stress tests
              designed for regulated and high-impact business environments.
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRounded />}
              onClick={() => navigate(routes.demo)}
              sx={{ px: 4, py: 1.4 }}
            >
              Get a Demo
            </Button>
          </Stack>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(1, minmax(0, 1fr))",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: { xs: 1.5, sm: 2.5, md: 3 },
            }}
          >
            {LANDING_PAGES.map((page) => {
              const IndustryIcon =
                CATEGORY_ICON_MAP[page.categoryId] ?? BusinessRounded;
              return (
                <Card
                  key={page.key}
                  variant="outlined"
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 250,
                    borderColor: "divider",
                    transition:
                      "transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease",
                    "&:hover": {
                      boxShadow: (theme) =>
                        `0 12px 28px ${alpha(
                          theme.palette.primary.main,
                          theme.palette.mode === "dark" ? 0.28 : 0.18,
                        )}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 }, flexGrow: 1 }}>
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      spacing={1}
                      sx={{ mb: 1.5 }}
                    >
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          p: 0.75,
                          borderRadius: 1.5,
                          color: "primary.main",
                          bgcolor: (theme) =>
                            alpha(
                              theme.palette.primary.main,
                              theme.palette.mode === "dark" ? 0.18 : 0.1,
                            ),
                        }}
                      >
                        <IndustryIcon fontSize="small" />
                      </Box>
                      <Chip
                        label={CATEGORY_LABEL_MAP[page.categoryId]}
                        size="small"
                        sx={{ maxWidth: "65%" }}
                      />
                    </Stack>
                    <Typography
                      component="h2"
                      sx={{
                        fontSize: { xs: "0.98rem", sm: "1.08rem" },
                        fontWeight: 600,
                        lineHeight: 1.35,
                        mb: 1,
                      }}
                    >
                      {page.title}
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{
                        fontSize: { xs: "0.86rem", sm: "0.93rem" },
                        lineHeight: 1.6,
                      }}
                    >
                      {toShortDescription(page.metaDescription)}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
                    <Button
                      variant="text"
                      endIcon={<ArrowForwardRounded fontSize="small" />}
                      onClick={() => navigate(page.slug)}
                      sx={{ px: 0.5 }}
                    >
                      Learn more
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default IndustriesHub;
