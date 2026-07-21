import "./Footer.scss";

import Logo, { LogoComponentEnum } from "../Logo";
import {
  getEffectiveRegion,
  setRegionCookie,
} from "src/application/shared/regionContent";
import { useLocation, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { Trans, useTranslation } from "react-i18next";
import { routes } from "src/application/routes";
import { useState } from "react";

const FOOTER_SECTIONS_GLOBAL = [
  {
    titleKey: "footer.product",
    links: [
      { labelKey: "footer.industries", href: routes.industries },
      { labelKey: "footer.methodology", href: routes.methodology },
      { labelKey: "footer.security", href: routes.security },
      { labelKey: "footer.tryLiveDemo", href: routes.demo },
    ],
  },
  {
    titleKey: "footer.compliance",
    links: [{ labelKey: "footer.finmaGuidance", href: routes.compliance.finma }],
  },
  {
    titleKey: "footer.company",
    links: [
      { labelKey: "footer.about", href: routes.about },
      { labelKey: "footer.contact", href: routes.contact },
    ],
  },
  {
    titleKey: "footer.legal",
    links: [
      { labelKey: "footer.privacyPolicy", href: routes.privacyPolicy },
      { labelKey: "footer.termsAndConditions", href: routes.termsAndConditions },
      {
        labelKey: "footer.dataProcessingAgreement",
        href: routes.dataProcessingAgreement,
      },
    ],
  },
] as const;

const Footer = () => {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const region = getEffectiveRegion(location.pathname, location.search);
  const [regionAnchor, setRegionAnchor] = useState<null | HTMLElement>(null);

  const handleSectionClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(href);
  };

  const handleRegionSelect = (target: "ch" | "global") => {
    setRegionAnchor(null);
    setRegionCookie(target);
    if (target === "ch") {
      navigate(routes.featuresCh);
      return;
    }
    navigate(routes.features);
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

        <Grid size={{ xs: 12, md: 9 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: { xs: 4, md: 3 },
              rowGap: 4,
            }}
          >
            {FOOTER_SECTIONS_GLOBAL.map(({ titleKey, links }) => (
              <Box
                key={titleKey}
                sx={{
                  flex: "1 1 140px",
                  minWidth: { xs: "45%", sm: 120, md: 130 },
                  maxWidth: { md: 200 },
                }}
              >
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
                  {t(titleKey)}
                </Typography>
                {links.map(({ labelKey, href }) => (
                  <Link
                    key={labelKey}
                    href={href}
                    onClick={handleSectionClick(href)}
                    sx={linkStyle}
                  >
                    {t(labelKey)}
                  </Link>
                ))}
              </Box>
            ))}

            <Box
              sx={{
                flex: "1 1 140px",
                minWidth: { xs: "45%", sm: 120, md: 130 },
                maxWidth: { md: 200 },
              }}
            >
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
                {t("footer.region")}
              </Typography>
              <Link
                component="button"
                type="button"
                onClick={(e) => setRegionAnchor(e.currentTarget)}
                sx={{
                  ...linkStyle,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  p: 0,
                }}
              >
                {region === "swiss"
                  ? t("footer.regionSwitzerland")
                  : t("footer.regionGlobal")}{" "}
                ▾
              </Link>
              <Menu
                anchorEl={regionAnchor}
                open={Boolean(regionAnchor)}
                onClose={() => setRegionAnchor(null)}
              >
                <MenuItem onClick={() => handleRegionSelect("global")}>
                  {t("footer.regionGlobal")}
                </MenuItem>
                <MenuItem onClick={() => handleRegionSelect("ch")}>
                  {t("footer.regionSwitzerland")}
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Grid>
      </Grid>
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
        <Trans
          t={t}
          i18nKey="footer.disclaimer"
          components={{
            brand: (
              <Typography
                component="span"
                sx={{
                  fontSize: "inherit",
                  color: "primary.main",
                }}
              />
            ),
          }}
        />
      </Typography>
    </Container>
  );
};

export default Footer;
