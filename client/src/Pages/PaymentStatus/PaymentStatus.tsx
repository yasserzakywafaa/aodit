import "./PaymentStatus.scss";

import { AutoFixHighOutlined, PersonOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

// import PaymentImage from "src/assets/images/bot_with_money.webp";
import Confetti from "src/assets/images/confetti.gif";
import Page from "src/components/shared/Page/Page";
import { getCurrencySymbol } from "src/shared/utils/getCurrencySymbol";
import { routes } from "src/application/routes";
import { useApplicationContext } from "src/application/store/Provider";
import { useEffect } from "react";
import { usePaymentStatusContext } from "./store/Provider";

const PaymentStatusPage = () => {
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

  console.log("PaymentStatus.tsx", sessionData);

  return (
    <Page
      title="Payment Success | Aodit"
      className={`payment-status-page ${
        showPaymentSuccess ? "payment-success" : ""
      }`}
      isLoading={isFetching}
    >
      {!showPaymentSuccess ? (
        <>
          <Container className="payment-status-container" sx={{ paddingY: 4 }}>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress color="primary" size="10rem" />
              <Typography variant="h4" marginTop={8}>
                Please wait while we securely process your payment...
              </Typography>
            </Box>
          </Container>
        </>
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
            sx={{
              pt: 4,
              pb: 4,
            }}
          >
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <img
                src={""}
                width="100%"
                className="payment-success-character-image"
              />

              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                marginY={1}
              >
                <Typography variant="h4" component="h2" color="#2e7d32">
                  Payment Successful
                </Typography>
              </Box>
            </Box>

            <Box
              marginY={1}
              display="flex"
              component="div"
              alignItems="center"
              flexDirection="column"
              justifyContent="center"
            >
              <Typography marginY={1} variant="h5" textAlign="center">
                Hooray, {auth.user.name.givenName}! 🎉 <br />
                Your payment process of{" "}
                {/* <span className="bold">{totalAmount}</span> has been completed */}
                <span className="bold">{getTotalAmount()}</span> has been
                completed successfully!
              </Typography>

              <Typography marginY={1} variant="h6" textAlign="center">
                Your subscription will end on{" "}
                <b>
                  {new Date(
                    auth.user.subscription.endDate || "",
                  ).toLocaleString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </b>
                .
              </Typography>

              <Box
                marginY={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection={{ xs: "column", sm: "row" }}
              >
                <Button
                  sx={{ margin: "0.5rem" }}
                  size="large"
                  type="button"
                  color="primary"
                  variant="outlined"
                  endIcon={<PersonOutlined />}
                  onClick={handleOnMyProfileClick}
                >
                  Go to Profile
                </Button>

                <Button
                  sx={{ margin: "0.5rem" }}
                  size="large"
                  type="button"
                  variant="contained"
                  endIcon={<AutoFixHighOutlined />}
                  onClick={handleOnCreateClick}
                >
                  Create{" "}
                  {
                    sessionData.invoice.subscription_details.metadata
                      .subscriptionPlan
                  }{" "}
                  Projects
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
