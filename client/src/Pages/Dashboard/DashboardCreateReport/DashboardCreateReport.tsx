import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import { routes } from "src/application/routes";
import { REPORT_TYPES } from "src/shared/constants/aoditFramework";
import { useDashboardCreateReportContext } from "./store/Provider";
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
    try {
      await handleCreateReport(report);

      navigate(routes.dashboard.reports.base);
    } catch (error) {
      console.error("❌ Failed to create report:", error);
    }
  };

  return (
    <Container sx={{ margin: "0" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Create New Report
        </Typography>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Report Name"
              name="name"
              value={report.name}
              onChange={handleChange}
              required
              fullWidth
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="report-type-label">Report Type</InputLabel>
              <Select
                labelId="report-type-label"
                label="Report Type"
                name="reportType"
                value={report.reportType || ""}
                onChange={(e) =>
                  setReport({ ...report, reportType: e.target.value })
                }
              >
                {REPORT_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Description"
              name="description"
              multiline
              rows={4}
              value={report.description || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
        </Grid>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 4 }}
        >
          Create Report
        </Button>
      </Box>
    </Container>
  );
};

export default DashboardCreateReport;
