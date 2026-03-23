import { alpha, useTheme } from "@mui/material/styles";
import { fontFamilySans, fontFamilySerif } from "src/application/shared/themes";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { scrollToSection } from "src/shared/utils/scrollTo";

const Hero = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const gridOpacity = isDark ? 0.09 : 0.04;
  const accent = theme.palette.primary.main;

  return (
    <Box
      id="hero"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        py: { xs: 6, md: 10 },
        px: { xs: 3, md: 6 },
      }}
    >
      {/* Grid overlay — stronger in dark mode so lines are visible */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          pointerEvents: "none",
          backgroundColor: "transparent",
          backgroundImage: `
            linear-gradient(${alpha(accent, gridOpacity)} 1px, transparent 1px),
            linear-gradient(90deg, ${alpha(accent, gridOpacity)} 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Eyebrow */}
        <Typography
          variant="body2"
          sx={{
            fontFamily: fontFamilySans,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "primary.main",
            mb: 3.5,
          }}
        >
          // Swiss Lab of Intelligence (Swissli)
        </Typography>

        {/* Headline */}
        <Typography
          component="h1"
          sx={{
            fontFamily: fontFamilySerif,
            fontSize: {
              xs: "clamp(2.25rem, 6vw, 4rem)",
              md: "clamp(52px, 8vw, 120px)",
            },
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            color: "text.primary",
            mb: 4,
          }}
        >
          How Does Your
          <br />
          AI Agent Behave
          <br />
          Under{" "}
          <Box
            component="span"
            sx={{
              color: "primary.main",
              position: "relative",
              display: "inline-block",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "-8px",
                left: 0,
                right: 0,
                height: "3px",
                background: "primary.main",
                transform: "scaleX(1)",
              },
            }}
          >
            Pressure?
          </Box>
        </Typography>

        {/* Body */}
        <Typography
          sx={{
            maxWidth: 560,
            fontSize: 16,
            lineHeight: 1.8,
            mb: 6,
          }}
        >
          AODIT-6 rates any AI agent across six behavioral dimensions using
          structured adversarial testing. Independent. Institutional.
          Comparable.
        </Typography>

        {/* Buttons */}
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <Button
            size="large"
            variant="contained"
            onClick={() => scrollToSection("ratings")}
          >
            View 2026 Ratings
          </Button>
          <Button
            size="large"
            variant="outlined"
            onClick={() => scrollToSection("contact")}
          >
            Rate Your Agent
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
