import { Box, CircularProgress, Grid, Typography } from "@mui/material";

import DemoOverviewCard from "./features/DemoOverviewCard";
import DemoPromptCard from "./features/DemoPromptCard";
import DemoTranscriptCard from "./features/DemoTranscriptCard";
import { useDashboardDemoContext } from "./store/Provider";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DashboardAdminDemo = () => {
  const { t } = useTranslation("dashboard");
  const { demoId } = useParams<{ demoId: string }>();
  const {
    store: {
      state: { isFetching, demo },
    },
    manager: { setUp },
  } = useDashboardDemoContext();

  useEffect(() => {
    if (demoId) {
      setUp(demoId);
    }
  }, [demoId]);

  if (isFetching && !demo) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px"
        }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!demo) {
    return (
      <Box>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          {t("admin.demos.notFoundTitle")}
        </Typography>
        <Typography variant="body1" sx={{
          color: "text.secondary"
        }}>
{t("admin.demos.notFoundDescription")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ marginY: 3 }}>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
{t("admin.demos.detailsTitle")}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 3
        }}>
{t("admin.demos.detailsSubtitle")}
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <DemoOverviewCard demo={demo} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <DemoPromptCard systemPrompt={demo.systemPrompt} />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <DemoTranscriptCard turns={demo.turns} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardAdminDemo;
