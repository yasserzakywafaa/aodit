import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";

import IsPaidUserToggle from "./features/IsPaidUserToggle";
import ProjectCountInput from "./features/ProjectCountInput";
import ProjectsCard from "./features/ProjectsCard";
import RoleSelector from "./features/RoleSelector";
import SubscriptionDetailsCard from "./features/SubscriptionDetailsCard";
import UserInfoCard from "./features/UserInfoCard";
import { useDashboardUserContext } from "./store/Provider";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const DashboardUser = () => {
  const { userId } = useParams<{ userId: string }>();
  const {
    store: {
      state: {
        isFetching,
        user,
        role,
        isPaidUser,
        projectsCount,
        subscriptionType,
        maxProjectsAllowed,
        paymentStatus,
        apiAccessAllowed,
        isUpdating,
      },
      setRole,
      setIsPaidUser,
      setProjectsCount,
      setSubscriptionType,
      setMaxProjectsAllowed,
      setPaymentStatus,
      setApiAccessAllowed,
    },
    manager: { setUp, handleUpdateUserProfile, hasChanges },
  } = useDashboardUserContext();

  useEffect(() => {
    if (userId) {
      setUp(userId);
    }
  }, [userId]);

  if (isFetching && !user) {
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

  if (!user) {
    return (
      <Box>
        <Typography variant="h4" component="h1" color="primary" gutterBottom>
          User Not Found
        </Typography>
        <Typography variant="body1" sx={{
          color: "text.secondary"
        }}>
          The user you're looking for doesn't exist or has been deleted.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ marginY: 3 }}>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        User Details
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: "text.secondary",
          mb: 3
        }}>
        View and manage user information, projects, campaigns, and permissions.
      </Typography>
      <Grid container spacing={3}>
        <Grid container size={{ xs: 12, sm: 12, md: 12 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <UserInfoCard user={user} />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <ProjectsCard projectsCount={projectsCount} userId={user._id} />
          </Grid>
        </Grid>

        <Grid container size={{ xs: 12, sm: 12, md: 12 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <RoleSelector user={user} value={role} onChange={setRole} />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <ProjectCountInput
              user={user}
              value={projectsCount}
              onChange={setProjectsCount}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <IsPaidUserToggle
              user={user}
              value={isPaidUser}
              onChange={setIsPaidUser}
            />
          </Grid>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <SubscriptionDetailsCard
            user={user}
            subscriptionType={subscriptionType}
            maxProjectsAllowed={maxProjectsAllowed}
            paymentStatus={paymentStatus}
            apiAccessAllowed={apiAccessAllowed}
            onSubscriptionTypeChange={setSubscriptionType}
            onMaxProjectsAllowedChange={setMaxProjectsAllowed}
            onPaymentStatusChange={setPaymentStatus}
            onApiAccessAllowedChange={setApiAccessAllowed}
          />
        </Grid>

        {/* Global Update Profile Button */}
        <Grid size={{ xs: 12 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              my: 2
            }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleUpdateUserProfile}
              disabled={isUpdating || !hasChanges()}
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardUser;
