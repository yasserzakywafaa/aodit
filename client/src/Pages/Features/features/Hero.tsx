import {
  ArrowForward,
  CloudOffOutlined,
  LockOutlined,
  VerifiedUserOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import { fontFamilyInter, primaryColor } from "src/application/shared/themes";

import { routes } from "src/application/routes";
import { trackEvent } from "src/shared/utils/ga4";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export interface HeroContent {
  titleLead: string;
  titleHighlight: string;
  subtitleLine1: string;
  subtitleLine2: string;
  bullets: string[];
}

const BULLET_ICONS = [
  <LockOutlined key="lock" sx={{ fontSize: 18 }} />,
  <CloudOffOutlined key="cloud-off" sx={{ fontSize: 18 }} />,
  <VerifiedUserOutlined key="verified" sx={{ fontSize: 18 }} />,
];

interface HeroProps {
  content: HeroContent;
}

const Hero = ({ content }: HeroProps) => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const resolved = content;
  const handleRequestEvaluationClick = () => {
    trackEvent("cta_click", {
      cta: "request_evaluation",
      location: "hero",
    });
    navigate(routes.contact);
  };

  const handleTryLiveDemoClick = () => {
    trackEvent("cta_click", {
      cta: "try_live_demo",
      location: "hero",
    });
    navigate(routes.demo);
  };

  return (
    <Box
      component="section"
      sx={{
        pt: { xs: 6, md: 14 },
        pb: { xs: 8, md: 12 },
        px: { xs: 3, md: 0 },
        backgroundImage: `
        linear-gradient(${alpha(primaryColor, 0.1)} 1px, transparent 1px),
        linear-gradient(90deg, ${alpha(primaryColor, 0.1)} 1px, transparent 1px)
      `,
        backgroundSize: "80px 80px",
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "2.5rem", sm: "3rem", md: "4rem" },
            lineHeight: 1.12,
            mb: 4,
            color: "text.primary",
            letterSpacing: "-0.02em",
          }}
        >
          {resolved.titleLead}{" "}
          <Typography
            component="span"
            sx={{
              fontSize: "inherit",
              fontFamily: "inherit",
              color: "primary.main"
            }}>
            {resolved.titleHighlight}
          </Typography>
        </Typography>

        <Typography
          variant="h3"
          component="span"
          sx={{
            color: "text.secondary",
            display: "block",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.75rem" },
            fontFamily: fontFamilyInter,
            mb: 4
          }}>
          {resolved.subtitleLine1} <br />
          <Typography
            component="span"
            className="text-underline"
            sx={{
              fontSize: "inherit",
              fontFamily: "inherit"
            }}>
            {resolved.subtitleLine2}
          </Typography>
        </Typography>

        <Stack spacing={1.5} sx={{ my: 5 }}>
          {resolved.bullets.map((text, idx) => (
            <Stack
              key={text}
              direction="row"
              sx={{
                alignItems: "center",
                gap: 1.5
              }}>
              <Box sx={{ color: primaryColor, display: "flex" }}>
                {BULLET_ICONS[idx % BULLET_ICONS.length]}
              </Box>
              <Typography sx={{ fontSize: 15, color: "text.primary" }}>
                {text}
              </Typography>
            </Stack>
          ))}
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={handleRequestEvaluationClick}
            sx={{ px: 4, py: 1.2 }}
          >
            {t("nav.requestEvaluation")}
          </Button>
          <Button
            variant="outlined"
            size="large"
            endIcon={<ArrowForward />}
            onClick={handleTryLiveDemoClick}
            sx={{ px: 4, py: 1.2 }}
          >
            {t("footer.tryLiveDemo")}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
