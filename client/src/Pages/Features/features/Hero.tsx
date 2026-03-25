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
          How Does Your AI Agent Behave Under{" "}
          <Typography
            component="span"
            fontSize="inherit"
            fontFamily="inherit"
            color="primary.main"
          >
            Pressure?
          </Typography>
        </Typography>

        <Typography
          variant="h3"
          component="span"
          color="text.secondary"
          display="block"
          sx={{
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.75rem" },
            fontFamily: fontFamilyInter,
            mb: 4,
          }}
        >
          We break your AI Agent <br />
          <Typography
            component="span"
            fontSize="inherit"
            fontFamily="inherit"
            className="text-underline"
          >
            before Regulators do
          </Typography>
        </Typography>

        <Stack spacing={1.5} sx={{ my: 5 }}>
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
