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

import { primaryColor } from "src/application/shared/themes";
import { routes } from "src/application/routes";
import { useNavigate } from "react-router-dom";

const HERO_BULLETS = [
  {
    icon: <LockOutlined sx={{ fontSize: 18 }} />,
    text: "Fully on-premise, airgapped deployment",
  },
  {
    icon: <CloudOffOutlined sx={{ fontSize: 18 }} />,
    text: "No access to client data or outputs",
  },
  {
    icon: <VerifiedUserOutlined sx={{ fontSize: 18 }} />,
    text: "Independent behavioral evaluation (not self-assessment)",
  },
];

const Hero = () => {
  const navigate = useNavigate();

  return (
    <Box
      component="section"
      sx={{
        pt: { xs: 10, md: 14 },
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
            fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.2rem" },
            lineHeight: 1.12,
            mb: 3,
            color: "text.primary",
            letterSpacing: "-0.02em",
          }}
        >
          Independent AI Agent Evaluation for Banks and Financial Institutions
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 16, md: 18 },
            color: "text.secondary",
            mb: 4,
            maxWidth: 620,
            lineHeight: 1.75,
          }}
        >
          Evidence how your AI behaves under stress — before regulators,
          auditors, or clients do.
        </Typography>

        <Stack spacing={1.5} sx={{ mb: 4 }}>
          {HERO_BULLETS.map(({ icon, text }) => (
            <Stack key={text} direction="row" alignItems="center" gap={1.5}>
              <Box sx={{ color: primaryColor, display: "flex" }}>{icon}</Box>
              <Typography sx={{ fontSize: 15, color: "text.primary" }}>
                {text}
              </Typography>
            </Stack>
          ))}
        </Stack>

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
  );
};

export default Hero;
