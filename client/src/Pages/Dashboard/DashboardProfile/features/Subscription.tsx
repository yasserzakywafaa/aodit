import { Alert, Button, Card, Grid, Typography } from "@mui/material";
import { AutoAwesomeOutlined, HeartBrokenOutlined } from "@mui/icons-material";

import { SubscriptionPlanEnum } from "src/shared/types/user";
import { useApplicationContext } from "src/application/store/Provider";
import { CancelSubscriptionModal } from "src/components/Modals/CancelSubscriptionModal/CancelSubscriptionModal";
import { useCancelSubscriptionModalContext } from "src/components/Modals/CancelSubscriptionModal/store/Provider";
import { useDashboardProfileContext } from "../store/Provider";
import { usePricingModalContext } from "src/components/Modals/PricingModal/store/Provider";

const SubscriptionSection = () => {
  const {
    store: {
      state: {
        auth: { user },
      },
    },
  } = useApplicationContext();

  const {
    store: {
      state: { subscription },
    },
  } = useDashboardProfileContext();

  if (!user) return null;

  const projectsCounterLeft =
    user.subscription.maxProjectsAllowed - user.reportsCount;
  const hasMaxProjectsLimit =
    user.reportsCount >= user.subscription.maxProjectsAllowed;
  const isCancelledButStillActive =
    subscription && subscription.cancel_at_period_end;

  const {
    store: { handleTogglePricingModal },
  } = usePricingModalContext();
  const {
    store: { handleToggleCancelSubscriptionModal },
  } = useCancelSubscriptionModalContext();

  const handleOnCancelSubscriptionClick = () => {
    handleToggleCancelSubscriptionModal();
  };

  const handleOnSubscribeClick = () => handleTogglePricingModal();

  return (
    <>
      <CancelSubscriptionModal />
      <Grid size={{ xs: 12, md: 8 }} id="subscription">
      <Card elevation={3} sx={{ padding: 3 }}>
        <Typography variant="h5">Subscription</Typography>
        <Grid container spacing={2} sx={{ marginTop: 2 }}>
          <Grid size={{ xs: 6, md: 4 }}>
            <Typography variant="h6" component="p" className="text-underline">
              Plan Type
            </Typography>
            <span className="bold">{user.subscription.type}</span>
          </Grid>

          {user.isPaidUser &&
          user.subscription.type !== SubscriptionPlanEnum.Free ? (
            <>
              <Grid size={{ xs: 6, md: 4 }}>
                <Typography
                  variant="h6"
                  component="p"
                  className="text-underline"
                >
                  Start Date
                </Typography>
                <span className="bold">
                  {new Date(user.subscription.startDate).toLocaleString(
                    "en-GB",
                    {
                      dateStyle: "short",
                    },
                  )}
                </span>
              </Grid>

              <Grid size={{ xs: 6, md: 4 }}>
                <Typography
                  variant="h6"
                  component="p"
                  className="text-underline"
                >
                  End Date
                </Typography>
                <span className="bold">
                  {new Date(user.subscription.endDate).toLocaleString("en-GB", {
                    dateStyle: "short",
                  })}
                </span>
              </Grid>

              {/* <Grid item xs={12} sm={6} md={8}>
                      <Alert
                        severity="info"
                        variant="outlined"
                        sx={{ width: "fit-content" }}
                        icon={<AutoAwesomeOutlined />}
                      >
                        You have{" "}
                        <span className="bold">{projectsCounterLeft}</span>{" "}
                        projects left out of{" "} 
                        <span className="bold">
                          {user.subscription.maxProjectsAllowed}
                        </span>
                      </Alert>
                    </Grid> */}

              <Grid size={{ xs: 12, sm: 3, md: 4 }}>
                <Button
                  fullWidth
                  color="error"
                  variant="contained"
                  sx={{ marginTop: 1 }}
                  onClick={handleOnCancelSubscriptionClick}
                >
                  Cancel Subscription
                </Button>
              </Grid>
            </>
          ) : (
            <Grid size={{ xs: 6, md: 6 }}>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                sx={{ marginTop: 1 }}
                // disabled={!!isCancelledButStillActive}
                onClick={handleOnSubscribeClick}
              >
                Upgrade
              </Button>
            </Grid>
          )}

          {hasMaxProjectsLimit ? (
            <Grid size={{ xs: 12, md: 12 }}>
              <Alert
                severity="warning"
                variant="outlined"
                sx={{ width: "fit-content" }}
                icon={<AutoAwesomeOutlined />}
              >
                {`You have consumed your maximum credit of ${user.subscription.maxProjectsAllowed} projects`}
              </Alert>
            </Grid>
          ) : (
            <Grid size={{ xs: 12, sm: 6, md: 8 }}>
              <Alert
                severity="info"
                variant="outlined"
                sx={{ width: "fit-content" }}
                icon={<AutoAwesomeOutlined />}
              >
                You have <span className="bold">{projectsCounterLeft}</span>{" "}
                projects left out of{" "}
                <span className="bold">
                  {user.subscription.maxProjectsAllowed}
                </span>
              </Alert>
            </Grid>
          )}

          {isCancelledButStillActive && subscription.current_period_end && (
            <Grid size={{ xs: 12, md: 12 }}>
              <Alert
                severity="info"
                variant="outlined"
                icon={<HeartBrokenOutlined />}
              >
                It is sad to see you go. Enjoy the subscription benefits until{" "}
                <span className="bold">
                  {new Date(
                    subscription.current_period_end * 1000,
                  ).toLocaleString("en-GB", {
                    dateStyle: "short",
                  })}
                </span>
              </Alert>
            </Grid>
          )}
        </Grid>
      </Card>
    </Grid>
    </>
  );
};

export default SubscriptionSection;
