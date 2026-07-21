import { fontFamilyPlayfairDisplay } from "src/application/shared/themes";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";

const SECTION_LABEL_STYLE = {
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase" as const,
  color: "primary.main",
  mb: 6,
  display: "flex",
  alignItems: "center",
  gap: 2,
};

const AboutSection = () => {
  const { t } = useTranslation("page");
  const stats = t("aboutSection.stats", { returnObjects: true }) as {
    num: string;
    label: string;
  }[];
  const coverage = t("aboutSection.coverage", { returnObjects: true }) as {
    name: string;
    status: string;
    active: boolean;
  }[];

  return (
    <Box
      id="about"
      component="section"
      sx={{
        py: { xs: 6, md: 12.5 },
        px: { xs: 3, md: 6 },
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Typography sx={SECTION_LABEL_STYLE}>{t("aboutSection.label")}</Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: { xs: 6, md: 12.5 },
          alignItems: "start",
        }}
      >
        <Box>
          <Typography
            component="h2"
            sx={{
              fontFamily: fontFamilyPlayfairDisplay,
              fontSize: {
                xs: "clamp(1.5rem, 3.5vw, 2.25rem)",
                md: "clamp(32px, 3.5vw, 50px)",
              },
              fontWeight: 300,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              mb: 4,
              color: "text.primary",
            }}
          >
            An{" "}
            <Box
              component="em"
              sx={{ fontStyle: "italic", color: "primary.main" }}
            >
              {t("aboutSection.titleIndependent")}
            </Box>
            <br />
            {t("aboutSection.titleRest")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 15,
              lineHeight: 1.8,
              mb: 2.5,
            }}
          >
            {t("aboutSection.p1")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 15,
              lineHeight: 1.8,
              mb: 2.5,
            }}
          >
            {t("aboutSection.p2")}
          </Typography>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 15,
              lineHeight: 1.8,
              mb: 2.5,
            }}
          >
            {t("aboutSection.p3")}
          </Typography>
          <Typography
            sx={{
              fontSize: 11,
              color: "text.secondary",
              mt: 4,
              letterSpacing: "0.05em",
            }}
          >
            {t("aboutSection.footer")}
          </Typography>
        </Box>

        <Box>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1px",
              bgcolor: "divider",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {stats.map((s) => (
              <Box key={s.label} sx={{ bgcolor: "background.default", p: 3.5 }}>
                <Typography
                  sx={{
                    fontFamily: fontFamilyPlayfairDisplay,
                    fontSize: 48,
                    fontWeight: 300,
                    color: "primary.main",
                    lineHeight: 1,
                    mb: 1,
                  }}
                >
                  {s.num}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 10,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 3, p: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography
              sx={{
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "text.secondary",
                mb: 2,
              }}
            >
              {t("aboutSection.coverageTitle")}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              {coverage.map((c, i) => (
                <Box
                  key={c.name}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: 1.25,
                    ...(i < coverage.length - 1
                      ? { borderBottom: "1px solid", borderColor: "divider" }
                      : {}),
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      color: c.active ? "text.primary" : "text.secondary",
                    }}
                  >
                    {c.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 10,
                      color: c.active ? "primary.main" : "text.secondary",
                    }}
                  >
                    {c.status}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AboutSection;
