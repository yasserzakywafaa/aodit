import {
  black,
  border,
  fontFamilyMono,
  fontFamilySerif,
  primaryColor,
} from "src/application/shared/themes";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { scrollToSection } from "src/shared/utils/scrollTo";

const Hero = () => {
  return (
    <Box
      id="hero"
      sx={{
        minHeight: { xs: "75vh", md: "82vh" },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 10 },
        px: { xs: 3, md: 6 },
      }}
    >
      {/* Theme-adaptive background */}
      <Box
        sx={(theme) => ({
          position: "absolute",
          inset: 0,
          background:
            theme.palette.mode === "dark"
              ? `
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(184,150,62,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 10% 80%, rgba(192,57,43,0.04) 0%, transparent 50%),
            linear-gradient(180deg, #0a0a0a 0%, #111008 100%)
          `
              : `
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(184,150,62,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 10% 80%, rgba(192,57,43,0.03) 0%, transparent 50%),
            linear-gradient(180deg, #f5f3ef 0%, #ede9e1 100%)
          `,
        })}
      />
      <Box
        sx={(theme) => ({
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(184,150,62,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,150,62,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage:
            theme.palette.mode === "dark"
              ? "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 40%, transparent 100%)"
              : "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.08) 40%, transparent 100%)",
        })}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            fontFamily: fontFamilyMono,
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: primaryColor,
            mb: 4,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          Swiss Lab for Intelligence (Swissli)
        </Box>

        <Typography
          component="h1"
          sx={{
            fontFamily: fontFamilySerif,
            fontSize: {
              xs: "clamp(2.5rem, 6vw, 4rem)",
              md: "clamp(52px, 8vw, 110px)",
            },
            fontWeight: 300,
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          Independent
          <br />
          <Box component="em" sx={{ fontStyle: "italic", color: primaryColor }}>
            behavioral ratings
          </Box>
          <br />
          for AI agents
        </Typography>

        <Typography
          sx={{
            maxWidth: 560,
            mt: 5,
            fontSize: 16,
            color: "text.secondary",
            lineHeight: 1.7,
          }}
        >
          Rigorous adversarial evaluation of large language models deployed in
          high-stakes financial and enterprise environments. Modelled on
          credit-rating methodology. Built for risk officers, compliance teams,
          and technology governance boards.
        </Typography>

        <Box sx={{ display: "flex", gap: 2.5, mt: 6, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            onClick={() => scrollToSection("ratings")}
            sx={{
              fontFamily: fontFamilyMono,
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: black,
              bgcolor: primaryColor,
              px: 3.5,
              py: 1.75,
              "&:hover": { bgcolor: "secondary.main" },
            }}
          >
            View Ratings
          </Button>
          <Button
            variant="outlined"
            onClick={() => scrollToSection("methodology")}
            sx={{
              fontFamily: fontFamilyMono,
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "text.primary",
              borderColor: border,
              px: 3.5,
              py: 1.75,
              "&:hover": { borderColor: primaryColor, color: primaryColor },
            }}
          >
            Our Methodology
          </Button>
        </Box>

        <Box
          sx={{
            position: "absolute",
            right: { xs: 0, md: 60 },
            bottom: { xs: 24, md: 48 },
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            gap: 1,
            textAlign: "right",
            "& span": {
              fontFamily: fontFamilyMono,
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "text.secondary",
            },
            "& strong": {
              fontFamily: fontFamilyMono,
              fontSize: 11,
              color: "text.secondary",
              fontWeight: 400,
            },
          }}
        >
          <Typography component="span" sx={{ display: "block" }}>
            Latest Report
          </Typography>
          <Typography component="strong" sx={{ display: "block" }}>
            AIR-2026-FSB-001
          </Typography>
          <Typography component="span" sx={{ display: "block" }}>
            Issued
          </Typography>
          <Typography component="strong" sx={{ display: "block" }}>
            22 February 2026
          </Typography>
          <Typography component="span" sx={{ display: "block" }}>
            Models Rated
          </Typography>
          <Typography component="strong" sx={{ display: "block" }}>
            6 LLMs
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
