import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import {
  border,
  fontFamilySans,
  fontFamilySerif,
  grey,
  primaryColor,
  primaryColorOpaqueTen,
} from "src/application/shared/themes";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import END_POINTS from "src/application/shared/endpoints";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribeSectionProps {
  variant?: "default" | "compact";
  id?: string;
}

const SubscribeSection = ({
  variant = "default",
  id = "subscribe",
}: SubscribeSectionProps) => {
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
        { headers: { "Content-Type": "application/json" } },
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

  const inputHeight = 40;

  const formSx = {
    display: "flex",
    alignItems: "stretch",
    gap: 0,
    width: "100%",
    maxWidth: 600,
    mx: "auto",
    "& .MuiOutlinedInput-root": {
      fontFamily: fontFamilySans,
      fontSize: 12,
      minHeight: inputHeight,
      height: inputHeight,
      bgcolor: (theme: { palette: { mode: string } }) =>
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.05)"
          : "rgba(0,0,0,0.04)",
      border: "1px solid",
      borderColor: "rgba(184, 150, 62, 0.4)",
      borderRight: "none",
      color: "text.primary",
      "&:hover": {
        borderColor: "rgba(184, 150, 62, 0.65)",
      },
      "&.Mui-focused": {
        borderColor: primaryColor,
        borderWidth: "1.5px",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: primaryColor,
          borderWidth: "1.5px",
        },
      },
      "& fieldset": { border: "none" },
    },
    "& .MuiInputBase-input": {
      py: 0,
      height: "100%",
      boxSizing: "border-box",
    },
    "& .MuiInputBase-input::placeholder": { color: grey, opacity: 1 },
    "& .MuiButton-root": {
      minHeight: inputHeight,
      height: inputHeight,
    },
  };

  const renderCompact = () => {
    return (
      <Box
        component="section"
        sx={{
          py: { xs: 4, md: 5 },
          px: { xs: 3, md: 6 },
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: primaryColorOpaqueTen,
        }}
      >
        <Box
          sx={{
            // maxWidth: 720,
            mx: "auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: fontFamilySans,
              textTransform: "uppercase",
              color: primaryColor,
            }}
          >
            Stay informed
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ ...formSx, mx: 0 }}
          >
            <TextField
              fullWidth
              name="email"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              disabled={loading}
            />
            <Button type="submit" variant="contained" disabled={loading}>
              Subscribe
            </Button>
          </Box>
        </Box>
      </Box>
    );
  };

  if (variant === "compact") {
    return renderCompact();
  }

  return (
    <Box
      id={id}
      component="section"
      sx={{
        py: { xs: 8, md: 14 },
        px: { xs: 3, md: 6 },
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={(theme) => ({
          maxWidth: 640,
          mx: "auto",
          textAlign: "center",
          px: { xs: 3, md: 5 },
          py: { xs: 4, md: 6 },
          border: `1px solid ${border}`,
          borderLeft: "4px solid",
          borderLeftColor: primaryColor,
          bgcolor:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.02)"
              : "rgba(0,0,0,0.02)",
        })}
      >
        <Typography
          sx={{
            fontFamily: fontFamilySans,
            textTransform: "uppercase",
            color: primaryColor,
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Box
            component="span"
            sx={{ width: 24, height: 1, bgcolor: primaryColor }}
          />
          Stay Informed
        </Typography>

        <Typography
          component="h2"
          sx={{
            fontFamily: fontFamilySerif,
            fontSize: {
              xs: "clamp(1.75rem, 4vw, 2.5rem)",
              md: "clamp(36px, 4vw, 52px)",
            },
            fontWeight: 300,
            mb: 2,
            color: "text.primary",
            lineHeight: 1.2,
          }}
        >
          Receive{" "}
          <Box component="em" sx={{ fontStyle: "italic", color: primaryColor }}>
            ratings
          </Box>{" "}
          when they publish
        </Typography>

        <Typography
          sx={{ color: "text.secondary", fontSize: 15, mb: 5, lineHeight: 1.6 }}
        >
          New reports issued quarterly. No marketing. No noise.
          <br />
          Risk, compliance, and governance professionals only.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={formSx}>
          <TextField
            fullWidth
            name="email"
            placeholder="your@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="small"
            disabled={loading}
          />
          <Button type="submit" variant="contained" disabled={loading}>
            Subscribe
          </Button>
        </Box>

        <Typography
          sx={{
            mt: 3,
            fontFamily: fontFamilySans,
            color: "text.secondary",
          }}
        >
          For institutional inquiries: contact@aodit.ai
        </Typography>
      </Box>
    </Box>
  );
};

export default SubscribeSection;
