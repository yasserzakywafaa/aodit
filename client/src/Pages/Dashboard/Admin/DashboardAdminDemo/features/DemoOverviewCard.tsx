import { Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";

import { DemoSession } from "src/shared/types/demoSession";
import { Info as InfoIcon } from "@mui/icons-material";
import { getDemoStatusColor } from "../../DashboardAdminDemos/features/dataGridConfig";

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Box sx={{ mt: 0.5 }}>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography variant="body1" fontWeight="medium">
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  </Box>
);

const DemoOverviewCard = ({ demo }: { demo: DemoSession }) => {
  const createdAt = new Date(demo.createdAt).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <InfoIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Demo Overview</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="SOURCE PAGE / INDUSTRY" value={demo.sourceLabel || "—"} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="PAGE PATH" value={demo.sourcePath || "—"} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="MODEL" value={demo.modelId || "—"} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field
              label="STATUS"
              value={
                <Chip
                  label={
                    demo.status.charAt(0).toUpperCase() + demo.status.slice(1)
                  }
                  color={getDemoStatusColor(demo.status) as any}
                  size="small"
                />
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field
              label="RAW SCORE"
              value={demo.rawScore != null ? demo.rawScore.toFixed(2) : "—"}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="TURNS COMPLETED" value={demo.turns?.length ?? 0} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="CREATED AT" value={createdAt} />
          </Grid>
          {demo.error && (
            <Grid size={{ xs: 12 }}>
              <Field
                label="ERROR"
                value={
                  <Typography variant="body2" color="error">
                    {demo.error}
                  </Typography>
                }
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DemoOverviewCard;
