import { Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";

import { DemoSession } from "src/shared/types/demoSession";
import { Info as InfoIcon } from "@mui/icons-material";
import { getDemoStatusColor } from "../../DashboardAdminDemos/features/dataGridConfig";
import { useTranslation } from "react-i18next";

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Box>
    <Typography variant="caption" sx={{
      color: "text.secondary"
    }}>
      {label}
    </Typography>
    <Box sx={{ mt: 0.5 }}>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography variant="body1" sx={{
          fontWeight: "medium"
        }}>
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  </Box>
);

const DemoOverviewCard = ({ demo }: { demo: DemoSession }) => {
  const { t } = useTranslation("dashboard");
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2
          }}>
          <InfoIcon color="primary" sx={{ mr: 1 }} />
<Typography variant="h6">{t("admin.demos.overview")}</Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
<Field label={t("admin.demos.sourceIndustry")} value={demo.sourceLabel || "—"} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
<Field label={t("admin.demos.pagePath")} value={demo.sourcePath || "—"} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
<Field label={t("admin.demos.model")} value={demo.modelId || "—"} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field
              label={t("admin.demos.status")}
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
              label={t("admin.demos.rawScore")}
              value={demo.rawScore != null ? demo.rawScore.toFixed(2) : "—"}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
<Field label={t("admin.demos.turnsCompleted")} value={demo.turns?.length ?? 0} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
<Field label={t("admin.demos.createdAt")} value={createdAt} />
          </Grid>
          {demo.error && (
            <Grid size={{ xs: 12 }}>
              <Field
                label={t("admin.demos.error")}
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
