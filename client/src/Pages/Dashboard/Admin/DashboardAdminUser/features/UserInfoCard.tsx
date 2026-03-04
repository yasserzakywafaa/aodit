import { Box, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import { User, UserStatus } from "src/shared/types/user";

import ProfileAvatar from "src/components/shared/ProfileAvatar";

interface UserInfoCardProps {
  user: User | null;
}

const UserInfoCard = ({ user }: UserInfoCardProps) => {
  if (!user) {
    return null;
  }

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case UserStatus.active:
        return "success";
      case UserStatus.inactive:
        return "default";
      case UserStatus.suspended:
        return "warning";
      case UserStatus.blocked:
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardContent>
        <Box
          display="flex"
          gap={3}
          justifyContent="space-between"
          flexWrap="wrap"
        >
          {/* User info */}
          <Box display="flex" alignItems="center" gap={2}>
            <ProfileAvatar user={user} avatarSize={{ width: 80, height: 80 }} />
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {user.name.givenName} {user.name.familyName}
              </Typography>
              <Box display="flex" gap={1} alignItems="center" mb={1}>
                <Chip
                  label={
                    user.status.charAt(0).toUpperCase() + user.status.slice(1)
                  }
                  color={getStatusColor(user.status) as any}
                  size="small"
                />
                <Chip
                  label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>
              <Typography variant="body2" fontWeight="bold">
                {user.email}
              </Typography>
            </Box>
          </Box>

          {/* User details */}
          <Grid container spacing={1}>
            <Grid container size={{ xs: 12 }} gap={2}>
              <Grid size={{ xs: 3, sm: 2 }}>
                <Typography variant="body2">User ID:</Typography>
              </Grid>
              <Grid size="auto">
                <Typography variant="body2" fontWeight="bold">
                  {user.userId}
                </Typography>
              </Grid>
            </Grid>

            <Grid container size={{ xs: 12 }} gap={2}>
              <Grid size={{ xs: 3, sm: 2 }}>
                <Typography variant="body2">Created:</Typography>
              </Grid>
              <Grid size="auto">
                <Typography variant="body2" fontWeight="bold">
                  {new Date(user.createdAt).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>

            <Grid container size={{ xs: 12 }} gap={2}>
              <Grid size={{ xs: 3, sm: 2 }}>
                <Typography variant="body2">Last Login:</Typography>
              </Grid>
              <Grid size="auto">
                <Typography variant="body2" fontWeight="bold">
                  {new Date(user.lastLogin).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>

            <Grid container size={{ xs: 12 }} gap={2}>
              <Grid size={{ xs: 3, sm: 2 }}>
                <Typography variant="body2">Subscription:</Typography>
              </Grid>
              <Grid size="auto">
                <Typography variant="body2" fontWeight="bold">
                  {user.subscription?.type || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
