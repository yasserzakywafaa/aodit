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
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const { t } = useTranslation(["page", "common"]);
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();
  const differentiators = t("about.differentiators", {
    returnObjects: true,
  }) as { title: string; description: string }[];
  const areas = t("about.areas", { returnObjects: true }) as string[];

  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      t("about.schemaTitle"),
      t("about.schemaDescription"),
      localizedPath(routes.about),
    );
  }, [t, localizedPath]);

  useSchemaOrg(webPageSchema, "about-webpage-schema");

  return (
    <Page
      title={t("about.pageTitle")}
      className="about-page"
      isLoading={false}
      seo={{
        description: t("about.schemaDescription"),
        segment: routes.about,
      }}
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
            {t("about.title")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              maxWidth: 750,
              lineHeight: 1.7,
              fontSize: 17,
              mb: 2
            }}>
            {t("about.p1")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              maxWidth: 750,
              lineHeight: 1.7,
              fontSize: 17
            }}>
            <Typography
              component="span"
              sx={{
                fontSize: "inherit",
                color: "primary.main"
              }}>
              aodit
            </Typography>{" "}
            {t("about.p2")}
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
              {t("about.missionTitle")}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: 16, md: 18 },
                color: "text.secondary",
                lineHeight: 1.7,
              }}
            >
              {t("about.missionBody")}
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
            {t("about.differentTitle")}
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                icon: <BalanceOutlined sx={{ fontSize: 28, color: primaryColor }} />,
                ...differentiators[0],
              },
              {
                icon: <LocationOnOutlined sx={{ fontSize: 28, color: primaryColor }} />,
                ...differentiators[1],
              },
              {
                icon: <SecurityOutlined sx={{ fontSize: 28, color: primaryColor }} />,
                ...differentiators[2],
              },
            ].map(({ icon, title, description }) => (
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
                  <Typography
                    sx={{
                      color: "text.secondary",
                      lineHeight: 1.7
                    }}>
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
          <Grid container spacing={4} sx={{
            alignItems: "center"
          }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: { xs: "1.35rem", md: "1.75rem" },
                  mb: 2,
                  color: "text.primary",
                }}
              >
                {t("about.expertiseTitle")}
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.7,
                  mb: 2
                }}>
                {t("about.expertiseP1")}
              </Typography>
              <Typography
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.7
                }}>
                {t("about.expertiseP2")}
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
                  {t("about.areasTitle")}
                </Typography>
                {areas.map((item) => (
                  <Typography
                    key={item}
                    sx={{
                      color: "text.secondary",
                      py: 0.75,
                      pl: 2,
                      borderLeft: `2px solid ${primaryColor}`,
                      mb: 1,
                      fontSize: 14
                    }}>
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
            {t("about.ctaTitle")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              mb: 3,
              lineHeight: 1.7
            }}>
            {t("about.ctaBody")}
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
              endIcon={<ArrowForward />}
              onClick={() => navigate(localizedPath(routes.contact))}
            >
              {t("common:nav.contact")}
            </Button>
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              onClick={() => navigate(localizedPath(routes.demo))}
            >
              {t("common:footer.tryLiveDemo")}
            </Button>
          </Stack>
        </Container>
      </Box>
    </Page>
  );
};

export default AboutPage;
