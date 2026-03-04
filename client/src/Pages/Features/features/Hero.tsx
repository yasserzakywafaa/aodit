import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import {
  black,
  primaryColor,
  border,
  grey,
  lightGrey,
  fontFamilyMono,
  fontFamilySerif,
} from "src/application/shared/themes";
import { scrollToSection } from "src/shared/utils/scrollTo";

const Hero = () => {
  return (
    <Box
      id="hero"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
        overflow: "hidden",
        pb: { xs: 6, md: 10 },
        px: { xs: 3, md: 6 },
      }}
    >
      {/* Background */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(184,150,62,0.06) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 10% 80%, rgba(192,57,43,0.04) 0%, transparent 50%),
            linear-gradient(180deg, #0a0a0a 0%, #111008 100%)
          `,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(184,150,62,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,150,62,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 40%, transparent 100%)",
        }}
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
          <Box sx={{ width: 32, height: 1, bgcolor: primaryColor }} />
          Swiss Lab for Intelligence International
        </Box>

        <Typography
          component="h1"
          sx={{
            fontFamily: fontFamilySerif,
            fontSize: { xs: "clamp(2.5rem, 6vw, 4rem)", md: "clamp(52px, 8vw, 110px)" },
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
            color: "rgba(245,243,239,0.6)",
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
              "&:hover": { bgcolor: "var(--white, #f5f3ef)" },
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
            bottom: { xs: 24, md: 80 },
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            gap: 1,
            textAlign: "right",
            "& span": {
              fontFamily: fontFamilyMono,
              fontSize: 10,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: grey,
            },
            "& strong": {
              fontFamily: fontFamilyMono,
              fontSize: 11,
              color: lightGrey,
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
