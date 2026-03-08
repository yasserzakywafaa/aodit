import {
  fontFamilyMono,
  fontFamilySerif,
  grey,
  primaryColor,
} from "src/application/shared/themes";
import END_POINTS from "src/application/shared/endpoints";
import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import axios from "axios";
import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      Notify({
        content: "Please enter your email address",
        type: ToastTypes.Error,
      });
      return;
    }
    if (!emailRegex.test(trimmed)) {
      Notify({
        content: "Please enter a valid email address",
        type: ToastTypes.Error,
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        END_POINTS.LEAD_MAGNET.SUBSCRIBE,
        { email: trimmed },
        { headers: { "Content-Type": "application/json" } }
      );
      const message =
        response.data?.message || "You're on the list. Check your inbox.";
      Notify({ content: message, type: ToastTypes.Success });
      setEmail("");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        Notify({
          content: error.response.data.message,
          type: ToastTypes.Error,
        });
      } else {
        Notify({
          content: "Something went wrong. Please try again later.",
          type: ToastTypes.Error,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      id="subscribe"
      component="section"
      sx={{
        py: { xs: 6, md: 12.5 },
        px: { xs: 3, md: 6 },
        borderTop: "1px solid",
        borderColor: "divider",
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
          fontSize: {
            xs: "clamp(1.75rem, 4vw, 2.5rem)",
            md: "clamp(36px, 4vw, 60px)",
          },
          fontWeight: 300,
          mb: 2,
          color: "text.primary",
        }}
      >
        Receive{" "}
        <Box component="em" sx={{ fontStyle: "italic", color: primaryColor }}>
          ratings
        </Box>
        <br />
        when they publish
      </Typography>

      <Typography sx={{ color: "text.secondary", fontSize: 15, mb: 5 }}>
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
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.04)",
            border: "1px solid",
            borderColor: "divider",
            borderRight: "none",
            color: "text.primary",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: primaryColor,
            },
            "& fieldset": { border: "none" },
          },
          "& .MuiInputBase-input::placeholder": { color: grey, opacity: 1 },
        }}
      >
        <TextField
          fullWidth
          name="email"
          placeholder="your@email.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="small"
          sx={{ flex: 1 }}
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading}
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
            "&:hover": { bgcolor: "secondary.main" },
          }}
        >
          Subscribe
        </Button>
      </Box>

      <Typography
        sx={{
          mt: 2.5,
          fontFamily: fontFamilyMono,
          fontSize: 10,
          color: "text.secondary",
          letterSpacing: "0.08em",
        }}
      >
        For institutional inquiries: contact@aodit.ai
      </Typography>
    </Box>
  );
};

export default SubscribeSection;
