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
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const framework = getFrameworkDefinition(DEFAULT_FRAMEWORK_VERSION);

const MethodologyPage = () => {
  const { t } = useTranslation(["page", "common"]);
  const navigate = useNavigate();

  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      t("methodology.schemaTitle"),
      t("methodology.schemaDescription"),
      routes.methodology,
    );
  }, [t]);

  useSchemaOrg(webPageSchema, "methodology-webpage-schema");

  return (
    <Page
      title={t("methodology.pageTitle")}
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
            {t("methodology.eyebrow")}
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
            {t("methodology.title")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              maxWidth: 800,
              mb: 2,
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
            {t("methodology.intro")}
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
              {t("methodology.whoForTitle")}
            </Typography>
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 14
              }}>
              {t("methodology.whoForBody")}
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
            {t("methodology.dimensionsTitle")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              mb: 2
            }}>
            {t("methodology.dimensionsSubtitle")}
          </Typography>
          <Stack
            direction="row"
            sx={{
              flexWrap: "wrap",
              gap: 1,
              mb: 4
            }}>
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
                    sx={{
                      color: "text.secondary",
                      mb: 1.5,
                      fontSize: 14,
                      lineHeight: 1.6
                    }}>
                    {framework.dimensionQuestions[dimension]}
                  </Typography>
                  <Stack
                    direction="row"
                    sx={{
                      flexWrap: "wrap",
                      gap: 0.75
                    }}>
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
            {t("methodology.protocolTitle")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              mb: 4,
              maxWidth: 700
            }}>
            {t("methodology.protocolSubtitle")}
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
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: 14
                    }}>
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
            {t("methodology.ctaTitle")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              mb: 3,
              lineHeight: 1.7
            }}>
            <Typography
              component="span"
              sx={{
                fontSize: "inherit",
                color: "primary.main"
              }}>
              aodit
            </Typography>{" "}
            {t("methodology.ctaBody")}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{
              justifyContent: "center"
            }}
          >
            <Button variant="contained" onClick={() => navigate(routes.contact)}>
              {t("common:nav.requestEvaluation")}
            </Button>
            <Button variant="outlined" onClick={() => navigate(routes.demo)}>
              {t("common:footer.tryLiveDemo")}
            </Button>
          </Stack>
        </Container>
      </Box>
    </Page>
  );
};

export default MethodologyPage;
