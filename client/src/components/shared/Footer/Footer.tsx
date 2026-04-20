import "./Footer.scss";

import Logo, { LogoComponentEnum } from "../Logo";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { routes } from "src/application/routes";
import { useNavigate } from "react-router-dom";

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { label: "Methodology", href: routes.methodology },
      { label: "Security", href: routes.security },
      { label: "Try Live Demo", href: routes.demo },
    ],
  },
  {
    title: "Compliance",
    links: [{ label: "FINMA Guidance", href: routes.compliance.finma }],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: routes.about },
      { label: "Contact", href: routes.contact },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: routes.privacyPolicy },
      { label: "Terms & Conditions", href: routes.termsAndConditions },
      {
        label: "Data Processing Agreement",
        href: routes.dataProcessingAgreement,
      },
    ],
  },
] as const;

const Footer = () => {
  const navigate = useNavigate();

  const handleSectionClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(href);
  };

  const linkStyle = {
    fontSize: 13,
    color: "text.secondary",
    textDecoration: "none",
    display: "block",
    mb: 1,
    "&:hover": { color: "text.primary" },
  };

  return (
    <Container
      className="footer"
      maxWidth={false}
      sx={{
        py: 6,
        px: { xs: 3, md: 6 },
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Grid container spacing={4}>
        {/* Logo + Address */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Logo variant="full" component={LogoComponentEnum.ANCHOR} />
          </Box>
          <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
              lineHeight: 1.8,
            }}
          >
            Swiss Lab of Intelligence (SwissLI AG)
            <br />
            Murbacherstrasse 19
            <br />
            6003 Luzern
            <br />
            Switzerland
          </Typography>
        </Grid>

        {/* Footer sections */}
        {FOOTER_SECTIONS.map(({ title, links }) => (
          <Grid key={title} size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "text.primary",
                mb: 2,
              }}
            >
              {title}
            </Typography>
            {links.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={handleSectionClick(href)}
                sx={linkStyle}
              >
                {label}
              </Link>
            ))}
          </Grid>
        ))}
      </Grid>

      {/* Disclaimer */}
      <Typography
        sx={{
          fontSize: 11,
          color: "text.secondary",
          mt: 5,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
          lineHeight: 1.7,
          maxWidth: 700,
        }}
      >
        <Typography component="span" fontSize="inherit" color="primary.main">
          aodit
        </Typography>{" "}
        is an independent AI evaluation framework. SwissLI AG is not affiliated
        with FINMA or any regulatory authority. Evaluation results are advisory
        and do not constitute regulatory approval or legal advice. &copy; 2026
        Swiss Lab of Intelligence (SwissLI AG)
      </Typography>
    </Container>
  );
};

export default Footer;
