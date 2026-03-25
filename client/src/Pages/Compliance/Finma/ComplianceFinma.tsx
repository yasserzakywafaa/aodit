import {
  AODIT_ADDED_VALUE_POINTS,
  FINMA_ALIGNMENT_DISCLAIMER,
  FINMA_ALIGNMENT_INTRO,
  FINMA_ALIGNMENT_ROWS,
  FINMA_KEY_PRINCIPLE,
  FINMA_KILLER_LINE,
  FINMA_LIFECYCLE_STAGES,
  FINMA_OFFICIAL_NOTICE,
  FINMA_RISK_IF_NOT_USED,
  OTHER_STANDARDS_INTRO,
  OTHER_STANDARD_ROWS,
} from "src/shared/constants/regulatoryAlignment";
import {
  ArrowForward,
  CheckCircleOutline,
  FormatQuoteRounded,
  WarningAmberRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from "@mui/material";
import { createWebPageSchema, useSchemaOrg } from "src/shared/utils/schemaOrg";
import {
  fontFamilyPlayfairDisplay,
  primaryColor,
} from "src/application/shared/themes";
import { useMediaQuery, useTheme } from "@mui/material";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Page from "src/components/shared/Page/Page";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import finmaLogo from "src/assets/images/finma_logo.png";
import { routes } from "src/application/routes";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const levelChipSx = (level: string) => {
  if (level === "Strong") {
    return { backgroundColor: "#DCFCE7", color: "#166534", fontWeight: 700 };
  }
  if (level === "Partial") {
    return { backgroundColor: "#FEF3C7", color: "#92400E", fontWeight: 700 };
  }
  return { backgroundColor: "#FEE2E2", color: "#991B1B", fontWeight: 700 };
};

const sectionSx = {
  py: { xs: 5, md: 7 },
  px: { xs: 3, md: 0 },
};

const altBgSx = {
  ...sectionSx,
  bgcolor: "rgba(0,0,0,0.015)",
};

const tableHeaderSx = {
  fontWeight: 700,
  fontSize: 13,
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  color: "text.secondary",
  borderBottom: `2px solid ${primaryColor}`,
  py: 1.5,
};

const ComplianceFinmaPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const hasOfficialPdfLink = Boolean(FINMA_OFFICIAL_NOTICE.downloadUrl?.trim());

  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      "FINMA AI Guidance 08/2024 Explained (Switzerland)",
      "Independent behavioral control-layer evidence for FINMA-aligned AI testing, monitoring, and risk decisions in Swiss financial services.",
      routes.compliance.finma,
    );
  }, []);

  useSchemaOrg(webPageSchema, "compliance-finma-webpage-schema");

  return (
    <Page
      title="FINMA AI Guidance 08/2024 Explained (Switzerland) | AODIT"
      className="compliance-finma-page"
      isLoading={false}
    >
      {/* ===== HERO ===== */}
      <Box
        component="section"
        sx={{
          pt: { xs: 10, md: 13 },
          pb: { xs: 6, md: 9 },
          px: { xs: 3, md: 0 },
          borderBottom: `1px solid`,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="subtitle2"
            sx={{
              color: primaryColor,
              fontWeight: 700,
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              mb: 2,
            }}
          >
            Regulatory Alignment
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontFamily: fontFamilyPlayfairDisplay,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "2.8rem" },
              lineHeight: 1.15,
              mb: 2,
              color: "text.primary",
              letterSpacing: "-0.01em",
            }}
          >
            FINMA AI Guidance 08/2024
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 16, md: 18 },
              color: "text.secondary",
              mb: 4,
              maxWidth: 600,
              lineHeight: 1.7,
            }}
          >
            How AODIT maps to Swiss financial market supervision requirements
            for AI in regulated institutions.
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderLeft: `3px solid ${primaryColor}`,
              bgcolor: alpha(primaryColor, 0.04),
              maxWidth: 580,
            }}
          >
            <Typography
              sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.65 }}
            >
              For CROs, compliance officers, and model risk teams evaluating
              independent AI testing evidence against FINMA requirements.
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* ===== INTRO + KEY PRINCIPLE ===== */}
      <Box component="section" sx={sectionSx}>
        <Container maxWidth="md">
          <Typography
            sx={{ fontSize: 16, lineHeight: 1.8, color: "text.primary", mb: 4 }}
          >
            {FINMA_ALIGNMENT_INTRO}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              bgcolor: alpha(primaryColor, 0.04),
              border: `1px solid ${alpha(primaryColor, 0.15)}`,
            }}
          >
            <Stack direction="row" alignItems="flex-start" gap={1.5} mb={1.5}>
              <FormatQuoteRounded
                sx={{ color: primaryColor, fontSize: 28, mt: 0.25 }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontFamily: fontFamilyPlayfairDisplay,
                  color: "text.primary",
                }}
              >
                Key Principle
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: 15, lineHeight: 1.75, mb: 1.5 }}>
              {FINMA_KEY_PRINCIPLE}
            </Typography>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 700,
                color: "text.primary",
                fontStyle: "italic",
              }}
            >
              {FINMA_KILLER_LINE}
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* ===== LIFECYCLE ===== */}
      <Box component="section" sx={altBgSx}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              fontFamily: fontFamilyPlayfairDisplay,
              fontSize: { xs: "1.4rem", md: "1.65rem" },
              mb: 4,
              color: "text.primary",
            }}
          >
            Where AODIT Fits in the Lifecycle
          </Typography>
          <Grid container spacing={2}>
            {FINMA_LIFECYCLE_STAGES.map((item, index) => (
              <Grid key={item.stage} size={{ xs: 12, sm: 6 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2.5,
                    height: "100%",
                    borderTop: `3px solid ${primaryColor}`,
                    transition: "box-shadow 0.2s",
                    "&:hover": {
                      boxShadow: `0 4px 20px ${alpha(primaryColor, 0.1)}`,
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: primaryColor,
                      mb: 0.75,
                    }}
                  >
                    Phase {index + 1}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 15, mb: 1 }}>
                    {item.stage}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 14,
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.useCase}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== OFFICIAL DOCUMENT ===== */}
      <Box component="section" sx={sectionSx}>
        <Container maxWidth="md">
          <Paper
            variant="outlined"
            sx={{
              overflow: "hidden",
            }}
          >
            <Grid container spacing={0}>
              <Grid size={{ xs: 12, sm: 8 }} sx={{ p: { xs: 3, md: 4 } }}>
                <Stack direction="row" alignItems="center" gap={1.5} mb={1.5}>
                  <PictureAsPdfRoundedIcon
                    sx={{ color: primaryColor, fontSize: 26 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: fontFamilyPlayfairDisplay,
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    Official FINMA Source Document
                  </Typography>
                </Stack>
                <Typography sx={{ fontWeight: 600, mb: 0.5, fontSize: 15 }}>
                  {FINMA_OFFICIAL_NOTICE.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2.5 }}
                >
                  {FINMA_OFFICIAL_NOTICE.authority} · Published{" "}
                  {FINMA_OFFICIAL_NOTICE.publishedDate}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 3, color: "text.secondary", lineHeight: 1.6 }}
                >
                  For transparency and audit-readiness, use the official FINMA
                  notice as the primary regulatory source.
                </Typography>
                <Button
                  variant="contained"
                  component="a"
                  color="primary"
                  startIcon={<DownloadRoundedIcon />}
                  href={
                    hasOfficialPdfLink
                      ? FINMA_OFFICIAL_NOTICE.downloadUrl
                      : undefined
                  }
                  target={hasOfficialPdfLink ? "_blank" : undefined}
                  rel={hasOfficialPdfLink ? "noopener noreferrer" : undefined}
                  disabled={!hasOfficialPdfLink}
                  sx={{ px: 3, py: 1 }}
                >
                  {hasOfficialPdfLink
                    ? "Download Official FINMA PDF"
                    : "Download link coming soon"}
                </Button>
              </Grid>
              <Grid
                size={{ xs: 12, sm: 4 }}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bgcolor: alpha(primaryColor, 0.03),
                  p: 3,
                }}
              >
                <img
                  src={finmaLogo}
                  alt={FINMA_OFFICIAL_NOTICE.title}
                  style={{
                    width: "70%",
                    maxWidth: 160,
                    height: "auto",
                    objectFit: "contain",
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* ===== FINMA SCORECARD TABLE ===== */}
      <Box component="section" sx={altBgSx}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              fontFamily: fontFamilyPlayfairDisplay,
              fontSize: { xs: "1.4rem", md: "1.65rem" },
              mb: 1.5,
              color: "text.primary",
            }}
          >
            FINMA Guidance 08/2024 — Control Evidence Scorecard
          </Typography>
          <Typography
            sx={{
              fontSize: 14,
              color: "text.secondary",
              mb: 3,
              lineHeight: 1.6,
            }}
          >
            <strong>Strong</strong> indicates direct behavioral evidence
            coverage. <strong>Partial</strong> indicates supporting evidence
            only. <strong>Not covered</strong> indicates an intentional
            boundary.
          </Typography>
          {isMobile ? (
            <Stack spacing={2}>
              {FINMA_ALIGNMENT_ROWS.map((row) => (
                <Paper
                  key={row.principle}
                  variant="outlined"
                  sx={{ p: 2.5, borderLeft: `3px solid ${primaryColor}` }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.5}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                      {row.principle}
                    </Typography>
                    <Chip
                      size="small"
                      label={row.level}
                      sx={levelChipSx(row.level)}
                    />
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: 13,
                      lineHeight: 1.65,
                      color: "text.secondary",
                    }}
                  >
                    {row.explanation}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Paper variant="outlined" sx={{ overflow: "hidden" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...tableHeaderSx, width: "24%" }}>
                      FINMA Principle
                    </TableCell>
                    <TableCell sx={{ ...tableHeaderSx, width: "14%" }}>
                      AODIT Level
                    </TableCell>
                    <TableCell sx={tableHeaderSx}>
                      Control Relevance &amp; Boundary
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {FINMA_ALIGNMENT_ROWS.map((row, index) => (
                    <TableRow
                      key={row.principle}
                      sx={{
                        bgcolor:
                          index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)",
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          verticalAlign: "top",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {row.principle}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top" }}>
                        <Chip
                          size="small"
                          label={row.level}
                          sx={levelChipSx(row.level)}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "top",
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: "text.secondary",
                        }}
                      >
                        {row.explanation}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Container>
      </Box>

      {/* ===== OTHER STANDARDS TABLE ===== */}
      <Box component="section" sx={sectionSx}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              fontFamily: fontFamilyPlayfairDisplay,
              fontSize: { xs: "1.4rem", md: "1.65rem" },
              mb: 1.5,
              color: "text.primary",
            }}
          >
            Other Standards — Alignment at the Behavioral Layer
          </Typography>
          <Typography
            sx={{
              fontSize: 15,
              color: "text.secondary",
              mb: 3,
              lineHeight: 1.7,
            }}
          >
            {OTHER_STANDARDS_INTRO}
          </Typography>
          {isMobile ? (
            <Stack spacing={2}>
              {OTHER_STANDARD_ROWS.map((row) => (
                <Paper
                  key={row.standard}
                  variant="outlined"
                  sx={{ p: 2.5, borderLeft: `3px solid ${primaryColor}` }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1.5}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                      {row.standard}
                    </Typography>
                    <Chip
                      size="small"
                      label={row.level}
                      sx={{ ...levelChipSx(row.level), ml: 1, flexShrink: 0 }}
                    />
                  </Stack>
                  <Typography
                    sx={{
                      fontSize: 13,
                      lineHeight: 1.65,
                      color: "text.secondary",
                    }}
                  >
                    {row.explanation}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Paper variant="outlined" sx={{ overflow: "hidden" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...tableHeaderSx, width: "26%" }}>
                      Standard
                    </TableCell>
                    <TableCell sx={{ ...tableHeaderSx, width: "14%" }}>
                      Level
                    </TableCell>
                    <TableCell sx={tableHeaderSx}>
                      Behavioral Coverage &amp; Limits
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {OTHER_STANDARD_ROWS.map((row, index) => (
                    <TableRow
                      key={row.standard}
                      sx={{
                        bgcolor:
                          index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.02)",
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          verticalAlign: "top",
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                      >
                        {row.standard}
                      </TableCell>
                      <TableCell sx={{ verticalAlign: "top" }}>
                        <Chip
                          size="small"
                          label={row.level}
                          sx={levelChipSx(row.level)}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          verticalAlign: "top",
                          fontSize: 14,
                          lineHeight: 1.6,
                          color: "text.secondary",
                        }}
                      >
                        {row.explanation}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Container>
      </Box>

      {/* ===== AODIT ADDED VALUE ===== */}
      <Box component="section" sx={altBgSx}>
        <Container maxWidth="md">
          <Typography
            variant="h4"
            sx={{
              fontFamily: fontFamilyPlayfairDisplay,
              fontSize: { xs: "1.4rem", md: "1.65rem" },
              mb: 3,
              color: "text.primary",
            }}
          >
            Three Things AODIT Adds That No Standard Currently Requires
          </Typography>
          <Stack spacing={2}>
            {AODIT_ADDED_VALUE_POINTS.map((point) => (
              <Stack
                key={point}
                direction="row"
                alignItems="flex-start"
                gap={1.5}
              >
                <CheckCircleOutline
                  sx={{ color: primaryColor, fontSize: 20, mt: 0.25 }}
                />
                <Typography
                  sx={{ fontSize: 15, lineHeight: 1.7, color: "text.primary" }}
                >
                  {point}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* ===== RISK IF NOT USED ===== */}
      <Box component="section" sx={sectionSx}>
        <Container maxWidth="md">
          <Stack direction="row" alignItems="center" gap={1.5} mb={3}>
            <WarningAmberRounded sx={{ color: "#D97706", fontSize: 26 }} />
            <Typography
              variant="h4"
              sx={{
                fontFamily: fontFamilyPlayfairDisplay,
                fontSize: { xs: "1.4rem", md: "1.65rem" },
                color: "text.primary",
              }}
            >
              What Happens If You Do Not Test Independently
            </Typography>
          </Stack>
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderLeft: `3px solid #D97706`,
            }}
          >
            <Stack spacing={1.5}>
              {FINMA_RISK_IF_NOT_USED.map((risk) => (
                <Typography
                  key={risk}
                  sx={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "text.secondary",
                  }}
                >
                  • {risk}
                </Typography>
              ))}
            </Stack>
          </Paper>
        </Container>
      </Box>

      {/* ===== SCOPE DISCLAIMER ===== */}
      <Box component="section" sx={{ ...altBgSx, pb: { xs: 3, md: 4 } }}>
        <Container maxWidth="md">
          <Typography
            variant="h6"
            sx={{
              fontFamily: fontFamilyPlayfairDisplay,
              mb: 1.5,
              color: "text.primary",
            }}
          >
            Scope Disclaimer
          </Typography>
          <Typography
            sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.7 }}
          >
            {FINMA_ALIGNMENT_DISCLAIMER} This is an explicit boundary, not a
            hidden gap.
          </Typography>
        </Container>
      </Box>

      {/* ===== CTA ===== */}
      <Box
        component="section"
        sx={{
          py: { xs: 6, md: 8 },
          px: { xs: 3, md: 0 },
          bgcolor: alpha(primaryColor, 0.04),
          borderTop: `2px solid ${primaryColor}`,
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography
            variant="h4"
            sx={{
              fontFamily: fontFamilyPlayfairDisplay,
              fontSize: { xs: "1.5rem", md: "1.75rem" },
              mb: 2,
              color: "text.primary",
            }}
          >
            Ready to Evaluate Your AI Agents?
          </Typography>
          <Typography
            sx={{
              fontSize: 15,
              color: "text.secondary",
              mb: 4,
              lineHeight: 1.7,
            }}
          >
            Request an evaluation to see how AODIT maps to your institution's
            FINMA compliance requirements.
          </Typography>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => navigate(routes.contact)}
            sx={{ px: 4, py: 1.2 }}
          >
            Request Evaluation
          </Button>
        </Container>
      </Box>
    </Page>
  );
};

export default ComplianceFinmaPage;
