import "./PaymentStatus.scss";

import { AutoFixHighOutlined, PersonOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import Confetti from "src/assets/images/confetti.gif";
import Page from "src/components/shared/Page/Page";
import { getCurrencySymbol } from "@yasserzakywafaa/client-core";
import { routes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";
import { usePaymentStatusContext } from "./store/Provider";

const PaymentStatusPage = () => {
  const { t } = useTranslation("page");
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const {
    store: {
      state: { auth },
    },
  } = useApplicationContext();
  const {
    store: {
      state: { isFetching, sessionData, showPaymentSuccess },
    },
    manager: { handleGetPaymentStatusData },
  } = usePaymentStatusContext();

  if (!sessionId || !auth.user) {
    console.log("❌ PaymentStatusPage:>>> 'sessionId' or 'User' is required!", {
      sessionId,
      user: auth.user,
    });
    alert("❌ 'sessionId' or 'User' is required!");

    return;
  }

  const getTotalAmount = (): string => {
    if (!sessionData) return "0";

    return `${getCurrencySymbol(sessionData.currency)}${
      sessionData.amount_total / 100
    }`;
  };

  const handleOnCreateClick = () => navigate(routes.dashboard.reports.create);
  const handleOnMyProfileClick = () =>
    auth.user && navigate(routes.dashboard.user.userById(auth.user._id));

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const checkPaymentStatus = async () => {
      try {
        await handleGetPaymentStatusData(sessionId);
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    if (!showPaymentSuccess) {
      intervalId = setInterval(checkPaymentStatus, 1000);
    }

    return () => clearInterval(intervalId);
  }, [sessionId, showPaymentSuccess]);

  const subscriptionEndDate = new Date(
    auth.user.subscription.endDate || "",
  ).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const planName =
    sessionData?.invoice.subscription_details.metadata.subscriptionPlan ?? "";

  return (
    <Page
      title={t("paymentStatus.pageTitle")}
      className={`payment-status-page ${
        showPaymentSuccess ? "payment-success" : ""
      }`}
      isLoading={isFetching}
    >
      {!showPaymentSuccess ? (
        <Container className="payment-status-container" sx={{ paddingY: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center"
            }}>
            <CircularProgress color="primary" size="10rem" />
            <Typography variant="h4" sx={{ marginTop: 8 }}>
              {t("paymentStatus.processing")}
            </Typography>
          </Box>
        </Container>
      ) : (
        <>
          <img
            src={Confetti}
            alt="Confetti"
            width="100%"
            height="100%"
            className="payment-success-confetti-image"
          />

          <Container
            className="payment-success-container"
            sx={{ pt: 4, pb: 4 }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}>
              <img
                src={""}
                width="100%"
                className="payment-success-character-image"
                alt=""
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginY: 1
                }}>
                <Typography variant="h4" component="h2" sx={{ color: "#2e7d32" }}>
                  {t("paymentStatus.successTitle")}
                </Typography>
              </Box>
            </Box>

            <Box
              component="div"
              sx={{
                marginY: 1,
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                justifyContent: "center"
              }}>
              <Typography variant="h5" sx={{ marginY: 1, textAlign: "center" }}>
                <Trans
                  i18nKey="paymentStatus.successMessage"
                  ns="page"
                  values={{
                    name: auth.user.name.givenName,
                    amount: getTotalAmount(),
                  }}
                  components={{ bold: <span className="bold" />, br: <br /> }}
                />
              </Typography>

              <Typography variant="h6" sx={{ marginY: 1, textAlign: "center" }}>
                <Trans
                  i18nKey="paymentStatus.subscriptionEnd"
                  ns="page"
                  values={{ date: subscriptionEndDate }}
                  components={{ b: <b /> }}
                />
              </Typography>

              <Box
                sx={{
                  marginY: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: { xs: "column", sm: "row" }
                }}>
                <Button
                  sx={{ margin: "0.5rem" }}
                  size="large"
                  type="button"
                  color="primary"
                  variant="outlined"
                  endIcon={<PersonOutlined />}
                  onClick={handleOnMyProfileClick}
                >
                  {t("paymentStatus.goToProfile")}
                </Button>

                <Button
                  sx={{ margin: "0.5rem" }}
                  size="large"
                  type="button"
                  variant="contained"
                  endIcon={<AutoFixHighOutlined />}
                  onClick={handleOnCreateClick}
                >
                  {t("paymentStatus.createPlanProjects", { plan: planName })}
                </Button>
              </Box>
            </Box>
          </Container>
        </>
      )}
    </Page>
  );
};

export default PaymentStatusPage;
