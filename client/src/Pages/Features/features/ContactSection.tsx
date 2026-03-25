import {
  fontFamilyPlayfairDisplay,
} from "src/application/shared/themes";

import Box from "@mui/material/Box";
import ContactForm from "src/Pages/Contact/features/ContactForm";
import Typography from "@mui/material/Typography";

const SECTION_EYEBROW_STYLE = {
  fontSize: 9,
  letterSpacing: "0.25em",
  color: "primary.main",
  mb: 2,
};

const ContactSection = () => (
  <Box
    id="contact"
    component="section"
    sx={{
      py: { xs: 8, md: 12.5 },
      px: { xs: 3, md: 6 },
      borderTop: "1px solid",
      borderColor: "divider",
      bgcolor: "background.default",
    }}
  >
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: { xs: 5, md: 10 },
        alignItems: "center",
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <Box>
        <Typography sx={SECTION_EYEBROW_STYLE}>// GET RATED</Typography>
        <Typography
          component="h2"
          sx={{
            fontFamily: fontFamilyPlayfairDisplay,
            fontSize: {
              xs: "clamp(1.75rem, 4vw, 2.5rem)",
              md: "clamp(36px, 4vw, 56px)",
            },
            fontWeight: 700,
            lineHeight: 1.1,
            mb: 2.5,
            color: "text.primary",
          }}
        >
          Rate Your
          <br />
          AI Agent
        </Typography>
        <Typography
          sx={{
            fontSize: 14,
            color: "text.secondary",
            lineHeight: 1.8,
            mb: 4,
          }}
        >
          Tell us about your agent. We will run it through the AODIT-6 framework
          and deliver an institutional-grade rating report.
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {[
            "Independent scoring — no affiliation with tested models",
            "Frozen transcripts — methodology cannot be gamed",
            "Report delivered within 5 business days",
          ].map((text) => (
            <Box
              key={text}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                fontSize: 12,
                color: "text.secondary",
              }}
            >
              <Typography component="span" sx={{ color: "primary.main" }}>
                ✓
              </Typography>
              <Typography component="span">{text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
      <Box>
        <ContactForm />
      </Box>
    </Box>
  </Box>
);

export default ContactSection;
