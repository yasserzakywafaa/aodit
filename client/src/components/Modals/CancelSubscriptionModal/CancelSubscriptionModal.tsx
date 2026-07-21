import { Box, Button, Typography } from "@mui/material";
import {
  HighlightOffOutlined,
  SentimentVeryDissatisfiedOutlined,
  SentimentVerySatisfiedOutlined,
} from "@mui/icons-material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useApplicationContext } from "src/application/store/Provider";
import { useCancelSubscriptionModalContext } from "./store/Provider";
import { useDashboardProfileContext } from "src/Pages/Dashboard/DashboardProfile/store/Provider";
import { usePricing } from "src/components/shared/Pricing/usePricing";
import { useTranslation } from "react-i18next";

export const CancelSubscriptionModal = () => {
  const { t } = useTranslation("dashboard");
  const {
    store: { state, handleToggleCancelSubscriptionModal },
  } = useCancelSubscriptionModalContext();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();

  const {
    manager: { handleCancelSubscription },
  } = useDashboardProfileContext();
  const { plans } = usePricing();

  const currentPlan = plans.find(
    (plan) => plan.title === auth.user?.subscription.type,
  );

  const onCloseModal = (
    event: {},
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason && reason === "backdropClick") return;

    handleToggleCancelSubscriptionModal();
  };

  const handleOnCancelSubscriptionClick = async () => {
    await handleCancelSubscription();
    handleToggleCancelSubscriptionModal();
  };

  if (!currentPlan) return <></>;

  return (
    <>
      <Dialog
        maxWidth="sm"
        scroll="body"
        fullWidth={true}
        open={state.isVisible}
        onClose={onCloseModal}
      >
        <DialogContent>
          <Typography variant="h5" component="h5">
            {t("subscription.cancelConfirmTitle")}
          </Typography>

          <Typography variant="h6" component="h6" sx={{
            marginTop: 2
          }}>
            {t("subscription.cancelConfirmSubtitle")}
          </Typography>

          {currentPlan.features.map((feature) => (
            <Box
              key={feature}
              sx={{
                gap: 1.5,
                paddingY: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <HighlightOffOutlined color="error" />
              <Typography component="span" variant="subtitle2">
                {feature}
              </Typography>
            </Box>
          ))}
        </DialogContent>

        <DialogActions>
          <Button
            size="small"
            type="button"
            color="primary"
            aria-label="close"
            variant="contained"
            startIcon={<SentimentVerySatisfiedOutlined />}
            onClick={handleToggleCancelSubscriptionModal}
          >
            {t("subscription.keepPlan")}
          </Button>
          <Button
            size="small"
            type="button"
            color="error"
            aria-label="close"
            variant="text"
            startIcon={<SentimentVeryDissatisfiedOutlined />}
            onClick={handleOnCancelSubscriptionClick}
          >
            {t("subscription.cancelSubscription")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
