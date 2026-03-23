import {
  AODIT_ADDED_VALUE_POINTS,
  FINMA_ALIGNMENT_DISCLAIMER,
  FINMA_ALIGNMENT_INTRO,
  FINMA_ALIGNMENT_ROWS,
  FINMA_OFFICIAL_NOTICE,
  OTHER_STANDARDS_INTRO,
  OTHER_STANDARD_ROWS,
} from "src/shared/constants/regulatoryAlignment";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { createWebPageSchema, useSchemaOrg } from "src/shared/utils/schemaOrg";

import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Page from "src/components/shared/Page/Page";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import finmaLogo from "src/assets/images/finma_logo.png";
import { routes } from "src/application/routes";
import { useMemo } from "react";

const levelChipSx = (level: string) => {
  if (level === "Strong") {
    return { backgroundColor: "#DCFCE7", color: "#166534", fontWeight: 700 };
  }
  if (level === "Partial") {
    return { backgroundColor: "#FEF3C7", color: "#92400E", fontWeight: 700 };
  }
  return { backgroundColor: "#FEE2E2", color: "#991B1B", fontWeight: 700 };
};

const ComplianceFinmaPage = () => {
  const hasOfficialPdfLink = Boolean(FINMA_OFFICIAL_NOTICE.downloadUrl?.trim());

  const webPageSchema = useMemo(() => {
    return createWebPageSchema(
      "FINMA AI Guidelines",
      "Overview of FINMA-aligned considerations for AI governance, risk controls, transparency, and model oversight in Swiss financial services.",
      routes.compliance.finma,
    );
  }, []);

  useSchemaOrg(webPageSchema, "compliance-finma-webpage-schema");

  return (
    <Page
      title="FINMA AI Guidelines | Aodit"
      className="compliance-finma-page"
      isLoading={false}
    >
      <Container sx={{ mt: 3, pb: 6 }}>
        <Typography variant="h4" gutterBottom>
          FINMA AI Guidelines
        </Typography>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Swiss financial market supervision
        </Typography>

        <Typography paragraph>{FINMA_ALIGNMENT_INTRO}</Typography>
        <Typography paragraph color="text.secondary">
          {FINMA_ALIGNMENT_DISCLAIMER}
        </Typography>

        <Box my={2.5}>
          <Paper>
            <Grid
              container
              spacing={2}
              width="100%"
              justifyContent="space-between"
            >
              <Grid size={{ xs: 12, sm: 8 }} sx={{ p: { xs: 2, md: 3 } }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                  <PictureAsPdfRoundedIcon
                    sx={{ color: "primary.main", fontSize: 28 }}
                  />
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  >
                    Official FINMA source document
                  </Typography>
                </Box>
                <Typography sx={{ fontWeight: 600, mb: 0.75 }}>
                  {FINMA_OFFICIAL_NOTICE.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {FINMA_OFFICIAL_NOTICE.authority} · Published{" "}
                  {FINMA_OFFICIAL_NOTICE.publishedDate}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  For transparency and audit-readiness, use the official FINMA
                  notice as the primary regulatory source.
                </Typography>
                <Button
                  variant="contained"
                  component="a"
                  color="primary"
                  size="large"
                  startIcon={<DownloadRoundedIcon />}
                  href={
                    hasOfficialPdfLink
                      ? FINMA_OFFICIAL_NOTICE.downloadUrl
                      : undefined
                  }
                  target={hasOfficialPdfLink ? "_blank" : undefined}
                  rel={hasOfficialPdfLink ? "noopener noreferrer" : undefined}
                  disabled={!hasOfficialPdfLink}
                >
                  {hasOfficialPdfLink
                    ? "Download official FINMA PDF"
                    : "Download link coming soon"}
                </Button>
              </Grid>

              <Grid
                size={{ xs: 12, sm: 3 }}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  src={finmaLogo}
                  alt={FINMA_OFFICIAL_NOTICE.title}
                  style={{
                    width: "80%",
                    height: "80%",
                    objectFit: "cover",
                  }}
                  height={100}
                  width={100}
                />
              </Grid>
            </Grid>
          </Paper>
        </Box>

        <Box my={2.5}>
          <Typography variant="h6" color="primary" gutterBottom>
            FINMA Guidance 08/2024 — alignment scorecard
          </Typography>
          <Paper variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: "24%" }}>
                    FINMA principle
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: "14%" }}>
                    AODIT level
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    Why — honest explanation
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {FINMA_ALIGNMENT_ROWS.map((row) => (
                  <TableRow key={row.principle}>
                    <TableCell sx={{ verticalAlign: "top", fontWeight: 600 }}>
                      {row.principle}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Chip
                        size="small"
                        label={row.level}
                        sx={levelChipSx(row.level)}
                      />
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top" }}>
                      {row.explanation}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>

        <Box my={2.5}>
          <Typography variant="h6" color="primary" gutterBottom>
            Other standards — conceptual alignment
          </Typography>
          <Typography paragraph>{OTHER_STANDARDS_INTRO}</Typography>
          <Paper variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, width: "26%" }}>
                    Standard
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, width: "14%" }}>
                    Level
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    What aligns and what does not
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {OTHER_STANDARD_ROWS.map((row) => (
                  <TableRow key={row.standard}>
                    <TableCell sx={{ verticalAlign: "top", fontWeight: 600 }}>
                      {row.standard}
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top" }}>
                      <Chip
                        size="small"
                        label={row.level}
                        sx={levelChipSx(row.level)}
                      />
                    </TableCell>
                    <TableCell sx={{ verticalAlign: "top" }}>
                      {row.explanation}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>

        <Box my={2.5} sx={{ borderLeft: "4px solid #10B981", pl: 2 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Three things AODIT adds that no standard currently requires
          </Typography>
          {AODIT_ADDED_VALUE_POINTS.map((point) => (
            <Typography key={point} paragraph sx={{ mb: 1 }}>
              {point}
            </Typography>
          ))}
        </Box>
      </Container>
    </Page>
  );
};

export default ComplianceFinmaPage;
