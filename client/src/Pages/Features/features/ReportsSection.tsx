import { fontFamilyPlayfairDisplay } from "src/application/shared/themes";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import { scrollToSection } from "src/shared/utils/scrollTo";
import { useTranslation } from "react-i18next";

const SECTION_EYEBROW_STYLE = {
  fontSize: 9,
  letterSpacing: "0.25em",
  color: "primary.main",
  mb: 2,
};

const SECTION_TITLE_STYLE = {
  fontFamily: fontFamilyPlayfairDisplay,
  fontSize: { xs: "clamp(1.5rem, 4vw, 2.5rem)", md: "clamp(36px, 5vw, 64px)" },
  fontWeight: 700,
  lineHeight: 1.05,
  mb: 2,
  color: "text.primary",
};

const SECTION_DESC_STYLE = {
  fontSize: 15,
  color: "text.secondary",
  maxWidth: 480,
  lineHeight: 1.8,
  mb: 7,
};

const WEIGHT_TEMPLATES = [
  [
    { name: "RELIABILITY", pct: "25%", fill: 42 },
    { name: "INTEGRITY", pct: "20%", fill: 33 },
    { name: "JUDGMENT", pct: "20%", fill: 33 },
    { name: "RESISTANCE", pct: "20%", fill: 33 },
    { name: "RESILIENCE", pct: "15%", fill: 25 },
  ],
  [
    { name: "RELIABILITY", pct: "15%", fill: 25 },
    { name: "INTEGRITY", pct: "35%", fill: 58 },
    { name: "JUDGMENT", pct: "20%", fill: 33 },
    { name: "RESISTANCE", pct: "15%", fill: 25 },
    { name: "RESILIENCE", pct: "15%", fill: 25 },
  ],
  [
    { name: "RELIABILITY", pct: "15%", fill: 25 },
    { name: "INTEGRITY", pct: "10%", fill: 17 },
    { name: "JUDGMENT", pct: "15%", fill: 25 },
    { name: "RESISTANCE", pct: "45%", fill: 75 },
    { name: "RESILIENCE", pct: "15%", fill: 25 },
  ],
  [
    { name: "RELIABILITY", pct: "25%", fill: 42 },
    { name: "INTEGRITY", pct: "20%", fill: 33 },
    { name: "JUDGMENT", pct: "25%", fill: 42 },
    { name: "RESISTANCE", pct: "15%", fill: 25 },
    { name: "RESILIENCE", pct: "15%", fill: 25 },
  ],
  [
    { name: "RELIABILITY", pct: "20%", fill: 33 },
    { name: "INTEGRITY", pct: "15%", fill: 25 },
    { name: "JUDGMENT", pct: "25%", fill: 42 },
    { name: "RESISTANCE", pct: "15%", fill: 25 },
    { name: "RESILIENCE", pct: "25%", fill: 42 },
  ],
];

const ICONS = ["🌐", "🎭", "🔓", "🏦", "👥"];

const ReportsSection = () => {
  const { t } = useTranslation("page");
  const scrollToContact = () => scrollToSection("contact");
  const cards = (
    t("reportsSection.cards", { returnObjects: true }) as {
      number: string;
      title: string;
      desc: string;
    }[]
  ).map((card, i) => ({
    ...card,
    icon: ICONS[i],
    weights: WEIGHT_TEMPLATES[i],
    cta: t("reportsSection.getNotified"),
  }));

  return (
    <Box
      id="reports"
      component="section"
      sx={{
        py: { xs: 8, md: 12.5 },
        px: { xs: 3, md: 6 },
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Typography sx={SECTION_EYEBROW_STYLE}>
        {t("reportsSection.eyebrow")}
      </Typography>
      <Typography component="h2" sx={SECTION_TITLE_STYLE}>
        {t("reportsSection.title")}
      </Typography>
      <Typography sx={SECTION_DESC_STYLE}>
        {t("reportsSection.subtitle")}
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: "1px",
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
          border: "1px solid",
          borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
        }}
      >
        {cards.map((card) => (
          <Box
            key={card.number}
            className="report-card"
            onClick={scrollToContact}
            sx={{
              bgcolor: "background.default",
              p: { xs: 3, md: 4.5 },
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              transition: "background 0.3s",
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: 2,
                bgcolor: "primary.main",
                transform: "scaleX(0)",
                transformOrigin: "left",
                transition: "transform 0.4s ease",
              },
              "&:hover": {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06),
                "&::after": { transform: "scaleX(1)" },
                "& .card-cta-arrow": { transform: "translateX(4px)" },
              },
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "text.secondary",
                mb: 2.5,
              }}
            >
              {card.number}
            </Typography>
            <Typography sx={{ fontSize: 28, mb: 2 }}>{card.icon}</Typography>
            <Typography
              component="h3"
              sx={{
                fontFamily: fontFamilyPlayfairDisplay,
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.2,
                mb: 1.5,
                color: "text.primary",
              }}
            >
              {card.title}
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: "text.secondary",
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              {card.desc}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.75,
                mb: 3,
              }}
            >
              {card.weights.map((w) => (
                <Box
                  key={w.name}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 8,
                      letterSpacing: "0.1em",
                      color: "text.secondary",
                      width: 60,
                    }}
                  >
                    {w.name}
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      height: 1,
                      bgcolor: "rgba(255,255,255,0.07)",
                      position: "relative",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        height: "100%",
                        width: `${w.fill}%`,
                        bgcolor: "primary.main",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: 8,
                      letterSpacing: "0.1em",
                      color: "primary.main",
                      width: 28,
                      textAlign: "right",
                    }}
                  >
                    {w.pct}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Typography
              className="card-cta-arrow"
              sx={{
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                gap: 1,
                transition: "transform 0.2s",
                "&::after": { content: '"→"' },
              }}
            >
              {card.cta}
            </Typography>
          </Box>
        ))}
        <Box
          className="report-card"
          onClick={scrollToContact}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "1px dashed",
            borderColor: (theme) => alpha(theme.palette.primary.main, 0.2),
            minHeight: 300,
            bgcolor: "background.default",
            opacity: 0.5,
            cursor: "pointer",
            transition: "opacity 0.3s",
            "&:hover": { opacity: 1 },
          }}
        >
          <Typography sx={{ fontSize: 40, mb: 2 }}>+</Typography>
          <Typography
            sx={{
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "text.secondary",
            }}
          >
            {t("reportsSection.customReport")}
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: "text.secondary",
              mt: 1,
              textAlign: "center",
              maxWidth: 160,
              lineHeight: 1.6,
            }}
          >
            {t("reportsSection.customDesc")}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportsSection;
