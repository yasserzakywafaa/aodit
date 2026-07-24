import {
  BoltOutlined,
  GavelOutlined,
  LockOutlined,
  NavigateNext,
  SecurityOutlined,
  TrendingUpOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import {
  fontFamilyPlayfairDisplay,
  primaryColor,
  primaryColorOpaqueEight,
  secondaryColor,
} from "src/application/shared/themes";

import AoditDemoPlayground from "src/components/shared/AoditDemoPlayground";
import Page from "src/components/shared/Page/Page";
import { alpha } from "@mui/material/styles";
import { routes } from "src/application/routes";
import { trackEvent } from "src/shared/utils/ga4";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocalizedPath } from "@yasserzakywafaa/client-core/web/i18n";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const StatPill = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <Stack
    direction="row"
    spacing={0.75}
    sx={{
      alignItems: "center",
      px: 1.5,
      py: 0.75,
      border: `1px solid ${alpha(primaryColor, 0.35)}`,
      borderRadius: "2px",
      bgcolor: primaryColorOpaqueEight
    }}>
    <Box sx={{ color: primaryColor, display: "flex", fontSize: 16 }}>
      {icon}
    </Box>
    <Typography
      variant="caption"
      sx={{
        fontWeight: 600,
        color: "text.secondary"
      }}>
      {label}
    </Typography>
  </Stack>
);

const HowItWorksStep = ({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) => (
  <Box>
    <Typography
      sx={{
        fontFamily: fontFamilyPlayfairDisplay,
        fontSize: "2rem",
        fontWeight: 700,
        color: primaryColor,
        lineHeight: 1,
        mb: 1,
      }}
    >
      {number}
    </Typography>
    <Typography variant="subtitle1" gutterBottom sx={{
      fontWeight: 700
    }}>
      {title}
    </Typography>
    <Typography variant="body2" sx={{
      color: "text.secondary"
    }}>
      {body}
    </Typography>
  </Box>
);

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const DemoPage = () => {
  const { t } = useTranslation("demo");
  const navigate = useNavigate();
  const localizedPath = useLocalizedPath();
  const {
    store: {
      state: { themeMode },
    },
  } = useApplicationContext();

  const isDark = themeMode === "dark";

  useEffect(() => {
    trackEvent("demo_start", {
      source: "demo_page_visit",
    });
  }, []);

  return (
    <Page
      title={t("page.pageTitle")}
      className="demo-page"
      seo={{
        description: t("page.subtitle"),
        segment: routes.demo,
      }}
    >
      {/* ================================================================== */}
      {/* HERO                                                                */}
      {/* ================================================================== */}
      <Box
        component="section"
        sx={{
          pt: { xs: 8, md: 10 },
          pb: { xs: 4, md: 6 },
          borderBottom: `1px solid ${alpha(primaryColor, 0.15)}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background orb */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            top: -120,
            right: -160,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(primaryColor, 0.12)} 0%, transparent 70%)`,
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="md">
          <Chip
            label={t("page.noAccount")}
            size="small"
            icon={<BoltOutlined sx={{ fontSize: 14 }} />}
            sx={{
              mb: 2.5,
              bgcolor: primaryColorOpaqueEight,
              border: `1px solid ${alpha(primaryColor, 0.4)}`,
              color: primaryColor,
              fontWeight: 700,
              fontSize: "0.7rem",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              "& .MuiChip-icon": { color: primaryColor },
            }}
          />

          <Typography
            variant="h2"
            sx={{
              fontFamily: fontFamilyPlayfairDisplay,
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "2.6rem", md: "3.2rem" },
              lineHeight: 1.15,
              mb: 2,
              letterSpacing: "-0.02em",
            }}
          >
            {t("page.title")}{" "}
            <Box
              component="span"
              sx={{
                color: primaryColor,
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -4,
                  left: 0,
                  right: 0,
                  height: 3,
                  bgcolor: primaryColor,
                  opacity: 0.35,
                },
              }}
            >
              {t("page.titleHighlight")}
            </Box>{" "}
            {t("page.titleSuffix")}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 560,
              mb: 3.5,
              lineHeight: 1.7,
              fontSize: "1.05rem"
            }}>
            {t("page.subtitle")}
          </Typography>

          <Stack
            direction="row"
            sx={{
              flexWrap: "wrap",
              gap: 1,
              mb: 1
            }}>
            <StatPill
              icon={<GavelOutlined fontSize="inherit" />}
              label={t("page.statJudge")}
            />
            <StatPill
              icon={<SecurityOutlined fontSize="inherit" />}
              label={t("page.statTurns")}
            />
            <StatPill
              icon={<TrendingUpOutlined fontSize="inherit" />}
              label={t("page.statScored")}
            />
            <StatPill
              icon={<LockOutlined fontSize="inherit" />}
              label={t("page.statTime")}
            />
          </Stack>
        </Container>
      </Box>
      {/* ================================================================== */}
      {/* PLAYGROUND                                                          */}
      {/* ================================================================== */}
      <Box
        component="section"
        sx={{
          py: { xs: 5, md: 7 },
          bgcolor: isDark ? alpha("#000", 0.4) : alpha(primaryColor, 0.025),
        }}
      >
        <AoditDemoPlayground sourceLabel={t("page.sourceLabel")} />
      </Box>
      {/* ================================================================== */}
      {/* HOW IT WORKS                                                        */}
      {/* ================================================================== */}
      <Box component="section" sx={{ py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{
              color: primaryColor,
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            {t("page.howItWorks")}
          </Typography>
          <Typography
            variant="h4"
            sx={{ fontFamily: fontFamilyPlayfairDisplay, mt: 0.5, mb: 5 }}
          >
            {t("page.stepsTitle")}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
              gap: { xs: 4, sm: 5 },
            }}
          >
            {(t("page.steps", { returnObjects: true }) as { title: string; body: string }[]).map(
              (step, i) => (
                <HowItWorksStep
                  key={step.title}
                  number={`0${i + 1}`}
                  title={step.title}
                  body={step.body}
                />
              ),
            )}
          </Box>

          <Divider sx={{ my: 6, borderColor: alpha(primaryColor, 0.12) }} />

          {/* CTA strip */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { sm: "center" },
              justifyContent: "space-between",
              gap: 3,
              p: { xs: 3, md: 4 },
              border: `1px solid ${alpha(primaryColor, 0.25)}`,
              bgcolor: primaryColorOpaqueEight,
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom sx={{
                fontWeight: 700
              }}>
                {t("page.needMoreTitle")}
              </Typography>
              <Typography variant="body2" sx={{
                color: "text.secondary"
              }}>
                {t("page.needMoreBody")}
              </Typography>
            </Box>
            <Button
              variant="contained"
              endIcon={<NavigateNext />}
              onClick={() => navigate(localizedPath(routes.contact))}
              sx={{ whiteSpace: "nowrap", flexShrink: 0 }}
            >
              {t("page.getFullAccess")}
            </Button>
          </Box>
        </Container>
      </Box>
      {/* ================================================================== */}
      {/* DIMENSION EXPLAINER                                                 */}
      {/* ================================================================== */}
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 8 },
          bgcolor: isDark
            ? alpha(secondaryColor, 0.1)
            : primaryColorOpaqueEight,
          borderTop: `1px solid ${alpha(primaryColor, 0.1)}`,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="overline"
            sx={{
              color: primaryColor,
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            {t("page.whatTests")}
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontFamily: fontFamilyPlayfairDisplay, mt: 0.5, mb: 1.5 }}
          >
            {t("page.dimensionTitle")}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 600,
              lineHeight: 1.75
            }}>
            {t("page.dimensionBody")}
          </Typography>

          <Box
            sx={{
              mt: 4,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            {(
              t("page.scoreRows", { returnObjects: true }) as {
                score: string;
                label: string;
                desc: string;
              }[]
            ).map((row) => (
              <Stack
                key={row.score}
                direction="row"
                spacing={1.5}
                sx={{
                  alignItems: "flex-start",
                  p: 1.75,
                  border: `1px solid`,
                  borderColor: "divider",
                  bgcolor: isDark ? alpha("#000", 0.2) : "#fff"
                }}>
                <Chip
                  label={row.score}
                  color={
                    row.score === "5" || row.score === "4"
                      ? "success"
                      : row.score === "3"
                        ? "warning"
                        : "error"
                  }
                  size="small"
                  sx={{ fontWeight: 700, minWidth: 36 }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      display: "block"
                    }}>
                    {row.label}
                  </Typography>
                  <Typography variant="caption" sx={{
                    color: "text.secondary"
                  }}>
                    {row.desc}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Box>
        </Container>
      </Box>
    </Page>
  );
};

export default DemoPage;
