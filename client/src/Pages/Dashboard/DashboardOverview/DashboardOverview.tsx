import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Dashboard as DashboardIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

import { hasAdminRights } from "src/shared/utils/getUserRoles";
import { routes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useDashboardOverviewContext } from "./store/Provider";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: number | null;
  description: string;
  path: string;
  isAdminCard?: boolean;
}

const DashboardOverview = () => {
  const navigate = useNavigate();
  const {
    store: {
      state: {
        userReportsCount,
        userAgentsCount,
        allReportsCount,
        allAgentsCount,
        allDemosCount,
      },
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
  const isAdmin = hasAdminRights(user);

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const renderStatCard = ({
    title,
    value,
    description,
    path,
    isAdminCard = false,
  }: StatCardProps) => (
    <Card
      onClick={() => handleCardClick(path)}
      sx={{
        cursor: "pointer",
        border: isAdminCard ? "1px solid" : "none",
        borderColor: isAdminCard ? "warning.main" : "transparent",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2
          }}>
          <DashboardIcon
            color={isAdminCard ? "warning" : "primary"}
            sx={{ mr: 1 }}
          />
          <Typography variant="h6">{title}</Typography>
        </Box>
        <Typography
          variant="h4"
          color={isAdminCard ? "warning.main" : "primary"}
        >
          {value !== null ? value : "--"}
        </Typography>
        <Typography variant="body2" sx={{
          color: "text.secondary"
        }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

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
      <Typography
        variant="subtitle1"
        sx={{
          color: "text.secondary",
          mb: 2
        }}>
        Your Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          {renderStatCard({
            title: "My Reports",
            value: userReportsCount,
            description: "Reports created by you",
            path: routes.dashboard.reports.base,
          })}
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          {renderStatCard({
            title: "My Agents",
            value: userAgentsCount,
            description: "Agents created by you",
            path: routes.dashboard.agents.base,
          })}
        </Grid>
      </Grid>
      {isAdmin && (
        <Box sx={{ mt: 4 }}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon color="warning" />}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1
                }}>
                <AdminPanelSettingsIcon color="warning" />
                <Typography variant="h6" sx={{
                  color: "warning.main"
                }}>
                  Admin
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderStatCard({
                    title: "All Reports",
                    value: allReportsCount,
                    description: "Reports created by all users",
                    path: routes.dashboard.admin.reports.base,
                    isAdminCard: true,
                  })}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderStatCard({
                    title: "All Agents",
                    value: allAgentsCount,
                    description: "Agents created by all users",
                    path: routes.dashboard.admin.agents.base,
                    isAdminCard: true,
                  })}
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  {renderStatCard({
                    title: "All Demos",
                    value: allDemosCount,
                    description: "Free demos run across all pages",
                    path: routes.dashboard.admin.demos.base,
                    isAdminCard: true,
                  })}
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default DashboardOverview;
