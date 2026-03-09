import "./Footer.scss";

import Logo, { LogoComponentEnum } from "../Logo";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { fontFamilyMono } from "src/application/shared/themes";
import { routes } from "src/application/routes";
import { useNavigate } from "react-router-dom";

const FOOTER_LINKS = [
  { id: "ratings", label: "Ratings", href: `${routes.features}#ratings` },
  {
    id: "methodology",
    label: "Methodology",
    href: `${routes.features}#methodology`,
  },
  { id: "about", label: "About", href: `${routes.features}#about` },
  { id: "subscribe", label: "Contact", href: `${routes.features}#subscribe` },
] as const;

const Footer = () => {
  const navigate = useNavigate();

  const handleSectionClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(href);
  };

  return (
    <Container
      className="footer"
      maxWidth={false}
      sx={{
        py: 5,
        px: { xs: 3, md: 6 },
        borderTop: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "center", md: "center" },
        gap: 3,
      }}
    >
      <Box
        component="span"
        sx={{
          fontFamily: fontFamilyMono,
          fontSize: 12,
          letterSpacing: "0.15em",
          color: "text.secondary",
        }}
      >
        <Logo variant="full" component={LogoComponentEnum.ANCHOR} />
      </Box>

      <Box sx={{ display: "flex", gap: 4 }}>
        {FOOTER_LINKS.map(({ id, label, href }) => (
          <Link
            key={id}
            href={href}
            onClick={handleSectionClick(href)}
            sx={{
              fontFamily: fontFamilyMono,
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "text.secondary",
              textDecoration: "none",
              "&:hover": { color: "text.primary" },
            }}
          >
            {label}
          </Link>
        ))}
      </Box>

      <Typography
        sx={{
          fontFamily: fontFamilyMono,
          fontSize: 9,
          letterSpacing: "0.08em",
          color: "text.secondary",
          maxWidth: 320,
          textAlign: { xs: "center", md: "right" },
          lineHeight: 1.6,
        }}
      >
        Not affiliated with Moody's Investors Service, Inc. Rating nomenclature
        adapted for illustrative analytical purposes only. Does not constitute
        financial, legal, or regulatory advice. © {new Date().getFullYear()}{" "}
        Swiss Lab for Intelligence (Swissli).
      </Typography>
    </Container>
  );
};

export default Footer;
