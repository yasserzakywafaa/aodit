import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  border,
  primaryColor,
  grey,
  fontFamilyMono,
  fontFamilySerif,
} from "src/application/shared/themes";

const SubscribeSection = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to newsletter API
  };

  return (
  <Box
    id="subscribe"
    component="section"
    sx={{
      py: { xs: 6, md: 12.5 },
      px: { xs: 3, md: 6 },
      borderTop: `1px solid ${border}`,
      bgcolor: "background.default",
      textAlign: "center",
    }}
  >
    <Typography
      sx={{
        fontFamily: fontFamilyMono,
        fontSize: 10,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: primaryColor,
        mb: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      Stay Informed
    </Typography>

    <Typography
      component="h2"
      sx={{
        fontFamily: fontFamilySerif,
        fontSize: { xs: "clamp(1.75rem, 4vw, 2.5rem)", md: "clamp(36px, 4vw, 60px)" },
        fontWeight: 300,
        mb: 2,
        color: "text.primary",
      }}
    >
      Receive <Box component="em" sx={{ fontStyle: "italic", color: primaryColor }}>ratings</Box>
      <br />
      when they publish
    </Typography>

    <Typography sx={{ color: "rgba(245,243,239,0.5)", fontSize: 15, mb: 5 }}>
      New reports issued quarterly. No marketing. No noise.
      <br />
      Risk, compliance, and governance professionals only.
    </Typography>

    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        gap: 0,
        maxWidth: 480,
        mx: "auto",
        "& .MuiOutlinedInput-root": {
          fontFamily: fontFamilyMono,
          fontSize: 12,
          bgcolor: "rgba(255,255,255,0.05)",
          border: `1px solid ${border}`,
          borderRight: "none",
          color: "text.primary",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: primaryColor },
          "& fieldset": { border: "none" },
        },
        "& .MuiInputBase-input::placeholder": { color: grey, opacity: 1 },
      }}
    >
      <TextField
        fullWidth
        placeholder="your@email.com"
        type="email"
        size="small"
        sx={{ flex: 1 }}
      />
      <Button
        type="submit"
        sx={{
          fontFamily: fontFamilyMono,
          fontSize: 11,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          bgcolor: primaryColor,
          color: "background.default",
          px: 3,
          py: 1.75,
          borderRadius: 0,
          "&:hover": { bgcolor: "var(--white, #f5f3ef)" },
        }}
      >
        Subscribe
      </Button>
    </Box>

    <Typography sx={{ mt: 2.5, fontFamily: fontFamilyMono, fontSize: 10, color: "rgba(107,107,107,0.6)", letterSpacing: "0.08em" }}>
      For institutional inquiries: contact@swisslii.com
    </Typography>
  </Box>
  );
};

export default SubscribeSection;
