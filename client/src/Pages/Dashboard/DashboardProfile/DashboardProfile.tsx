import "./DashboardProfile.scss";

import {
  ArticleOutlined,
  ModeNightOutlined,
  VisibilityOutlined,
  WbSunnyOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Grid,
  Switch,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { User, UserStatus } from "src/shared/types/user";
import { useEffect, useState } from "react";

import { AvatarSquareStyle } from "src/application/shared/themes";
import ProfileAvatar from "src/components/shared/ProfileAvatar";
import SubscriptionSection from "./features/Subscription";
import { routes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useDashboardProfileContext } from "./store/Provider";
import { useNavigate } from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const DashboardProfilePage = () => {
  const navigate = useNavigate();
  const { store } = useApplicationContext();
  const [activeTab, setActiveTab] = useState(0);

  const {
    manager: { handleGetSubscriptionDetails, handleUpdateUserInfo },
  } = useDashboardProfileContext();

  const { state } = store;
  const {
    auth,
    themeMode,
    auth: { isAuthenticated, user },
  } = state;

  if (!user) return null;

  const handleOnDarkModeSwitchChange = async () => {
    await handleUpdateUserInfo({
      preferences: {
        ...user.preferences,
        theme: themeMode === "dark" ? "light" : "dark",
      },
    });
  };

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

  const calculateAccountAge = () => {
    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (!isAuthenticated || !user) return <></>;

  useEffect(() => {
    if (user.subscription && user.subscription.id) {
      handleGetSubscriptionDetails();
    }
  }, [user]);

  return (
    <Container
      className="my-profile-container"
      sx={{
        pt: 4,
        pb: 4,
      }}
    >
      {/* Enhanced Profile Header */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "center", md: "center" },
          gap: 3,
        }}
      >
        <ProfileAvatar
          user={auth.user as User}
          verifiedBadgeSize={40}
          avatarSize={{ width: 120, height: 120 }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", md: "flex-start" },
            gap: 1,
          }}
        >
          <Typography variant="h4" component="h1" color="primary">
            Hi {user?.name.givenName} 👋🏻
          </Typography>
          <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
            <Chip
              label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
          <Typography
            component="a"
            href={`mailto:${user.email}`}
            variant="body2"
            color="text.secondary"
          >
            {user.email}
          </Typography>
        </Box>
      </Box>

      {/* Tabs Navigation */}
      <Box
        className="tabs-container"
        sx={{
          position: "sticky",
          top: { xs: "4.25rem", sm: "4.75rem" },
          zIndex: 1,
          backdropFilter: "blur(20px)",
          boxShadow: AvatarSquareStyle.boxShadow,
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="profile tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label="Profile"
            id="profile-tab-0"
            aria-controls="profile-tabpanel-0"
          />
          <Tab
            label="Subscription"
            id="profile-tab-1"
            aria-controls="profile-tabpanel-1"
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {/* Profile Tab */}
      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card className="stat-card" elevation={3}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ArticleOutlined color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Projects</Typography>
                </Box>
                <Typography variant="h4" color="primary">
                  {user.projectsCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Projects created
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<VisibilityOutlined />}
                  onClick={() =>
                    navigate(
                      routes.dashboard.projects.projectsByUserId(user._id),
                    )
                  }
                >
                  View My Projects
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Profile Information Card */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              elevation={3}
              sx={{
                padding: 3,
                transition: "box-shadow 0.2s",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>
                Profile Information
              </Typography>

              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" className="text-underline">
                    Full Name
                  </Typography>
                  <Typography component="span" color="text.secondary">
                    {`${user.name.givenName} ${user.name.familyName}`}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" className="text-underline">
                    Email
                  </Typography>
                  <Typography
                    component="a"
                    href={`mailto:${user.email}`}
                    color="text.secondary"
                  >
                    {`${user.email}`}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" className="text-underline">
                    Date joined
                  </Typography>
                  <Typography component="span" color="text.secondary">
                    {new Date(user.createdAt).toLocaleString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" className="text-underline">
                    Appearance
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    sx={{ cursor: "pointer" }}
                    onClick={handleOnDarkModeSwitchChange}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <WbSunnyOutlined
                        fontSize="small"
                        color="secondary"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        LIGHT
                      </Typography>
                    </Box>

                    <Switch
                      size="medium"
                      value="dark-mode"
                      checked={
                        (user.preferences?.theme || themeMode) === "dark"
                      }
                      onChange={undefined}
                    />

                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" color="text.secondary">
                        DARK
                      </Typography>
                      <ModeNightOutlined
                        fontSize="small"
                        color="secondary"
                        sx={{ mr: 1 }}
                      />
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h6" className="text-underline">
                    Account Age
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {calculateAccountAge()} days since joined Aodit
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography
                    variant="h6"
                    component="p"
                    className="text-underline"
                  >
                    Last Login
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })
                      : "Never"}{" "}
                    {""}at{" "}
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Never"}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Subscription Tab */}
      <TabPanel value={activeTab} index={1}>
        <Grid container spacing={3}>
          <SubscriptionSection />
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default DashboardProfilePage;
