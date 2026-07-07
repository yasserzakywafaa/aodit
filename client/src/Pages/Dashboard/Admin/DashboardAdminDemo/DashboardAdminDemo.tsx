import { Box, CircularProgress, Grid, Typography } from "@mui/material";

import DemoOverviewCard from "./features/DemoOverviewCard";
import DemoPromptCard from "./features/DemoPromptCard";
import DemoTranscriptCard from "./features/DemoTranscriptCard";
import { useDashboardDemoContext } from "./store/Provider";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const DashboardAdminDemo = () => {
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
          Demo Not Found
        </Typography>
        <Typography variant="body1" sx={{
          color: "text.secondary"
        }}>
          The demo you're looking for doesn't exist or has been deleted.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ marginY: 3 }}>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        Demo Details
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 3
        }}>
        View the prompt, transcript, and source of this demo run.
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
