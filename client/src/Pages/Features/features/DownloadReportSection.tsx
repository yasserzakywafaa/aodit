import {
  Notify,
  ToastTypes,
} from "src/components/shared/Notification/Notification";
import { alpha, useTheme } from "@mui/material/styles";
import {
  fontFamilyInter,
  fontFamilyPlayfairDisplay,
} from "src/application/shared/themes";

import APP_CONSTANTS from "src/application/shared/app_constants";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import END_POINTS from "src/application/shared/endpoints";
import PDF from "@mui/icons-material/PictureAsPdf";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useState } from "react";

const FEATURED_REPORT = {
  title: "2026 Banking AI Risk Report",
  subtitle:
    "AODIT evaluated leading AI systems across multi-turn adversarial scenarios covering customer interactions, fraud handling, and escalation behavior.",
  description:
    "Independent evaluation of AI agent behavior under adversarial banking scenarios aligned with FINMA expectations.",
  ctaLabel: "Download Executive Summary",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EXECUTIVE_SUMMARY_LEAD = {
  reportOfInterest: "Banking AI Risk Assessment - Executive Summary",
  message: "Executive summary download lead magnet",
};

const DownloadReportSection = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const executiveSummaryUrl = APP_CONSTANTS.FEATURED_REPORT_PDF_URL;
  const hasPdf = Boolean(executiveSummaryUrl && executiveSummaryUrl.trim());

  const [leadOpen, setLeadOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [companyErr, setCompanyErr] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetLeadForm = () => {
    setName("");
    setCompany("");
    setEmail("");
    setNameErr("");
    setCompanyErr("");
    setEmailErr("");
  };

  const openExecutiveSummaryLeadDialog = () => {
    if (!hasPdf) return;
    resetLeadForm();
    setLeadOpen(true);
  };

  const closeLeadDialog = () => {
    if (!submitting) setLeadOpen(false);
  };

  const validateLeadForm = (): boolean => {
    let ok = true;
    if (!name.trim()) {
      setNameErr("Full name is required");
      ok = false;
    } else setNameErr("");
    if (!company.trim()) {
      setCompanyErr("Company is required");
      ok = false;
    } else setCompanyErr("");
    const em = email.trim();
    if (!em) {
      setEmailErr("Work email is required");
      ok = false;
    } else if (!EMAIL_REGEX.test(em)) {
      setEmailErr("Enter a valid email address");
      ok = false;
    } else setEmailErr("");
    return ok;
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLeadForm() || !executiveSummaryUrl) return;
    setSubmitting(true);
    try {
      await axios.post(
        END_POINTS.CONTACT.SUPPORT,
        {
          name: name.trim(),
          company: company.trim(),
          email: email.trim(),
          reportOfInterest: EXECUTIVE_SUMMARY_LEAD.reportOfInterest,
          message: EXECUTIVE_SUMMARY_LEAD.message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        },
      );
      Notify({
        content: "Thank you — opening the executive summary.",
        type: ToastTypes.Success,
      });
      setLeadOpen(false);
      resetLeadForm();
      window.open(executiveSummaryUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        Notify({
          content: String(error.response.data.message),
          type: ToastTypes.Error,
        });
      } else {
        Notify({
          content: "Could not submit. Please try again.",
          type: ToastTypes.Error,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Featured report card */}
      <Box
        id="ratings"
        component="section"
        sx={{
          position: "relative",
          overflow: "hidden",
          border: "1px solid",
          borderColor: (t) => alpha(t.palette.primary.main, 0.35),
          bgcolor: (t) =>
            isDark
              ? alpha(t.palette.primary.main, 0.04)
              : alpha(t.palette.primary.main, 0.02),
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            bgcolor: "primary.main",
          },
        }}
      >
        <Box
          sx={{
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 6 },
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "stretch", md: "flex-start" },
            gap: 3,
          }}
        >
          <Typography
            component="h3"
            sx={{
              fontFamily: fontFamilyPlayfairDisplay,
              fontSize: {
                xs: "clamp(1.5rem, 4vw, 2.25rem)",
                md: "clamp(28px, 3vw, 40px)",
              },
              fontWeight: 600,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "text.primary",
            }}
          >
            {FEATURED_REPORT.title}
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 15,
              lineHeight: 1.75,
              pt: 1,
            }}
          >
            {FEATURED_REPORT.description}
          </Typography>

          <Typography
            sx={{
              fontFamily: fontFamilyInter,
              fontSize: 14,
              color: "text.secondary",
              lineHeight: 1.65,
              maxWidth: 560,
            }}
          >
            {FEATURED_REPORT.subtitle}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              disabled={!hasPdf}
              onClick={openExecutiveSummaryLeadDialog}
              startIcon={<PDF />}
            >
              {hasPdf ? FEATURED_REPORT.ctaLabel : "PDF coming soon"}
            </Button>
          </Box>
        </Box>
      </Box>

      <Dialog
        open={leadOpen}
        onClose={closeLeadDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 0 } }}
      >
        <form onSubmit={handleLeadSubmit}>
          <DialogTitle sx={{ fontFamily: fontFamilyInter, fontWeight: 600 }}>
            Enter your details to get the executive summary
          </DialogTitle>
          <DialogContent
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              required
              fullWidth
              label="Full name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameErr) setNameErr("");
              }}
              error={Boolean(nameErr)}
              helperText={nameErr}
              disabled={submitting}
            />
            <TextField
              required
              fullWidth
              label="Company"
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                if (companyErr) setCompanyErr("");
              }}
              error={Boolean(companyErr)}
              helperText={companyErr}
              disabled={submitting}
            />
            <TextField
              required
              fullWidth
              type="email"
              label="Work email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailErr) setEmailErr("");
              }}
              error={Boolean(emailErr)}
              helperText={emailErr}
              disabled={submitting}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={closeLeadDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={
                submitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
            >
              {submitting ? "Submitting…" : "Get executive summary"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default DownloadReportSection;
