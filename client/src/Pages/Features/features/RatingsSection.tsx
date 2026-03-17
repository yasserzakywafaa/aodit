import { alpha, useTheme } from "@mui/material/styles";
import { fontFamilySans, fontFamilySerif } from "src/application/shared/themes";

import APP_CONSTANTS from "src/application/shared/app_constants";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import Typography from "@mui/material/Typography";

const SECTION_LABEL_STYLE = {
  fontFamily: fontFamilySans,
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: "primary.main",
  mb: 6,
  display: "flex",
  alignItems: "center",
  gap: 2,
  "&::after": {
    content: '""',
    flex: 1,
    maxWidth: 60,
    height: 1,
    bgcolor: "primary.main",
    opacity: 0.4,
  },
};

const FEATURED_REPORT = {
  label: "Featured Report",
  title: "2026 - Q1 Frontier AI Risk Ratings",
  subtitle: "Banking Services Behavioral Security Benchmark",
  description:
    "Our latest independent evaluation of leading large language models across a standardised 8-turn adversarial banking simulation. Ratings reflect behavioral compliance quality and deployment suitability for live financial environments. Download the full report for methodology, detailed findings, and recommendations.",
  reportId: "AODIT-2026-Q1-BANKING",
  ctaLabel: "Download PDF",
};

const RatingsSection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const pdfUrl = APP_CONSTANTS.FEATURED_REPORT_PDF_URL;
  const hasPdf = Boolean(pdfUrl && pdfUrl.trim());

  const handleDownload = () => {
    if (hasPdf) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Box
      id="ratings"
      component="section"
      sx={{
        py: { xs: 6, md: 12.5 },
        px: { xs: 3, md: 6 },
        borderTop: (t) => `1px solid ${t.palette.divider}`,
        bgcolor: "background.paper",
      }}
    >
      <Typography sx={SECTION_LABEL_STYLE}>{FEATURED_REPORT.label}</Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "1fr 1fr" },
          gap: { md: 6 },
          mb: 6,
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontFamily: fontFamilySerif,
            fontSize: {
              xs: "clamp(1.75rem, 4vw, 2.5rem)",
              md: "clamp(36px, 4vw, 56px)",
            },
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            color: "text.primary",
          }}
        >
          2026 AI Agent
          <br />
          Risk{" "}
          <Box
            component="em"
            sx={{ fontStyle: "italic", color: "primary.main" }}
          >
            Ratings
          </Box>
        </Typography>
        <Typography
          sx={{
            color: "text.secondary",
            fontSize: 15,
            lineHeight: 1.75,
            pt: 1,
          }}
        >
          {FEATURED_REPORT.description}
        </Typography>
      </Box>

      {/* Featured report card */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          border: "1px solid",
          borderColor: (t) => alpha(t.palette.primary.main, 0.35),
          bgcolor: (t) =>
            isDark
              ? alpha(t.palette.primary.main, 0.04)
              : alpha(t.palette.primary.main, 0.02),
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            bgcolor: "primary.main",
          },
        }}
      >
        <Box
          sx={{
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "stretch", md: "flex-start" },
            gap: 3,
          }}
        >
          <Typography
            sx={{
              fontFamily: fontFamilySans,
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "primary.main",
            }}
          >
            Report {FEATURED_REPORT.reportId}
          </Typography>
          <Typography
            component="h3"
            sx={{
              fontFamily: fontFamilySerif,
              fontSize: {
                xs: "clamp(1.5rem, 4vw, 2.25rem)",
                md: "clamp(28px, 3vw, 40px)",
              },
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "text.primary",
            }}
          >
            {FEATURED_REPORT.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: fontFamilySans,
              fontSize: 14,
              color: "text.secondary",
              lineHeight: 1.65,
              maxWidth: 560,
            }}
          >
            {FEATURED_REPORT.subtitle}
          </Typography>
          <Button
            variant="contained"
            size="large"
            disabled={!hasPdf}
            onClick={handleDownload}
            startIcon={<DownloadIcon />}
            sx={{
              fontFamily: fontFamilySans,
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              px: 3.5,
              py: 1.75,
              borderRadius: 0,
              border: "1px solid",
              borderColor: "primary.main",
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                bgcolor: (t) => alpha(t.palette.primary.main, 0.85),
                borderColor: "primary.main",
              },
              "&.Mui-disabled": {
                bgcolor: (t) => alpha(t.palette.primary.main, 0.2),
                color: "text.secondary",
                borderColor: (t) => alpha(t.palette.primary.main, 0.3),
              },
            }}
          >
            {hasPdf ? FEATURED_REPORT.ctaLabel : "PDF coming soon"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RatingsSection;
