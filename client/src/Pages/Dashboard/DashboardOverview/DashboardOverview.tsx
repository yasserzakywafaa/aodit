import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

import { Dashboard as DashboardIcon } from "@mui/icons-material";
import { routes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useDashboardOverviewContext } from "./store/Provider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DashboardOverview = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: { projectsCount },
    },
    manager: { setUp },
  } = useDashboardOverviewContext();
  const {
    store: {
      state: {
        auth: { user },
      },
    },
  } = useApplicationContext();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    setUp();
  }, []);

  return (
    <Box>
      <Box>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          Welcome back, {user?.name.givenName} {user?.name.familyName}!
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card
            onClick={() => handleCardClick(routes.dashboard.projects.base)}
            sx={{ cursor: "pointer" }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DashboardIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Projects</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {projectsCount !== null ? projectsCount : "--"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Projects created
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardOverview;
