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
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const SecurityPage = () => {
  const { t } = useTranslation(["page", "common"]);
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();
  const documentationItems = t("security.docItems", {
    returnObjects: true,
  }) as string[];

  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      t("security.schemaTitle"),
      t("security.schemaDescription"),
      localizedPath(routes.security),
    );
  }, [t, localizedPath]);

  useSchemaOrg(webPageSchema, "security-webpage-schema");

  return (
    <Page
      title={t("security.pageTitle")}
      className="security-page"
      isLoading={false}
      seo={{
        description: t("security.schemaDescription"),
        segment: routes.security,
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
            {t("security.title")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              mb: 4,
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
            {t("security.intro")}
          </Typography>

          {/* Deployment flow */}
          <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 } }}>
            <Grid container spacing={3} sx={{
              alignItems: "center"
            }}>
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
                    {t("security.yourInfra")}
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: "text.secondary"
                  }}>
                    {t("security.onPremise")}
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
                      sx={{
                        fontSize: "inherit",
                        color: "primary.main"
                      }}>
                      aodit
                    </Typography>{" "}
                    {t("security.evaluation")}
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: "text.secondary"
                  }}>
                    {t("security.runsInside")}
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
                    {t("security.resultsInHouse")}
                  </Typography>
                  <Typography variant="body2" sx={{
                    color: "text.secondary"
                  }}>
                    {t("security.noTransfer")}
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
                  {t("security.deploymentArch")}
                </Typography>
                <List sx={{ listStyleType: "disc", pl: 3 }}>
                  {(t("security.archItems", { returnObjects: true }) as string[]).map((item) => (
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
                  {t("security.devEnvs")}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
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
                  {t("security.devEnvsBody")}
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
                  {t("security.clientAccess")}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    mb: 1,
                    lineHeight: 1.7
                  }}>
                  {t("security.clientAccessP1")}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.7
                  }}>
                  {t("security.clientAccessP2")}
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
                  {t("security.dataPrinciples")}
                </Typography>
                {(t("security.dataItems", { returnObjects: true }) as string[]).map((item) => (
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
                    <Typography
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.6
                      }}>
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
                  {t("security.securityControls")}
                </Typography>
                {(t("security.controlItems", { returnObjects: true }) as string[]).map((item) => (
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
                    <Typography
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.6
                      }}>
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
                  {t("security.swissGov")}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    lineHeight: 1.7
                  }}>
                  {t("security.swissGovLead")}{" "}
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "inherit",
                      color: "primary.main"
                    }}>
                    aodit
                  </Typography>{" "}
                  {t("security.swissGovTail")}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ p: 3, height: "100%" }}>
                <Typography
                  variant="h5"
                  sx={{ mb: 1.5, fontWeight: 600, color: "text.primary" }}
                >
                  {t("security.documentation")}
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                    mb: 2
                  }}>
                  {t("security.docIntro")}
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
                    <Typography sx={{
                      color: "text.secondary"
                    }}>{item}</Typography>
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
                    onClick={() => navigate(localizedPath(routes.contact))}
                  >
                    {t("security.requestSecurityPackage")}
                  </Button>
                  <Button
                    variant="outlined"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate(localizedPath(routes.demo))}
                  >
                    {t("common:footer.tryLiveDemo")}
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
