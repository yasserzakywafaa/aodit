import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import { alpha } from "@mui/material/styles";
import { fontFamilyPlayfairDisplay } from "src/application/shared/themes";
import { routes } from "src/application/routes";
import { useDashboardCreateReportContext } from "./store/Provider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardCreateReport = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { report },
      setReport,
    },
    manager: { handleCreateReport },
  } = useDashboardCreateReportContext();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }
    >,
  ) => {
    const { name, value } = e.target;
    setReport({
      ...report,
      [name as string]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report.name?.trim() || !report.description?.trim()) return;
    try {
      const created = await handleCreateReport(report);
      if (created?._id) {
        navigate(routes.dashboard.reports.reportById(created._id));
      }
    } catch (error) {
      console.error("❌ Failed to create report:", error);
    }
  };

  useEffect(() => {
    return () => {
      setReport({
        name: "",
        description: "",
      });
    };
  }, []);

  return (
    <Container sx={{ margin: "0" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Create New Report
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Card variant="outlined" sx={{ borderWidth: 1 }}>
              <CardContent>
                <Typography
                  variant="subtitle1"
                  color="primary"
                  fontWeight={600}
                  sx={{ mb: 2 }}
                >
                  Report details
                </Typography>
                <TextField
                  label="Report Name"
                  name="name"
                  value={report.name ?? ""}
                  onChange={handleChange}
                  placeholder="e.g. Healthcare Agent Risk 2026"
                  required
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <TextField
                  label="Description"
                  name="description"
                  multiline
                  rows={4}
                  value={report.description ?? ""}
                  onChange={handleChange}
                  placeholder="Describe the AI agent use case, sector, and risk context (e.g. Banking chatbot handling loan applications)"
                  required
                  fullWidth
                />
              </CardContent>
            </Card>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!report.name?.trim() || !report.description?.trim()}
              sx={{ mt: 3 }}
            >
              Go to Report Config
            </Button>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              height: "100%",
              p: 3,
              borderLeft: { md: 1 },
              borderColor: "divider",
              pl: { md: 4 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontFamily: fontFamilyPlayfairDisplay,
                color: "primary.main",
                mb: 2,
                letterSpacing: "0.02em",
              }}
            >
              Next step: Report Config
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                lineHeight: 1.7,
                mb: 2,
              }}
            >
              After creating your report, you’ll configure scenarios per
              dimension, dimension weights, and choose which AI models to test
              and evaluate. You can then run the report and view results in the
              <Typography
                component="span"
                fontSize="inherit"
                color="primary.main"
              >
                aodit
              </Typography>{" "}
              framework.
            </Typography>
            <Box
              sx={{
                mt: 3,
                py: 2,
                px: 2,
                bgcolor: (t) => alpha(t.palette.primary.main, 0.06),
                borderLeft: 3,
                borderColor: "primary.main",
              }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Scenarios and weights define how many test cases run per
                dimension and how each dimension contributes to the composite
                score. Models to test are the agents you want to evaluate; the
                evaluator model judges the results.
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardCreateReport;
