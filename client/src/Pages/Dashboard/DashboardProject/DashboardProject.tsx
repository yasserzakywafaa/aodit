import { Box, Container, Typography } from "@mui/material";

import { useDashboardProjectContext } from "./store/Provider";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const DashboardProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const {
    store: {
      state: { project },
    },
    manager: { setUp },
  } = useDashboardProjectContext();

  useEffect(() => {
    if (projectId) {
      setUp(projectId);
    }
  }, [projectId]);

  return (
    <Container maxWidth="xl" sx={{ margin: 0 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          {project?.name || "Project"}
        </Typography>
      </Box>
    </Container>
  );
};

export default DashboardProject;
