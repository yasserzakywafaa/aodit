import express, { Router } from "express";

import END_POINTS from "../models/endpoints";
import PaymentsController from "../controllers/PaymentsController";

const paymentsRouter = Router();

// Define API routes
paymentsRouter.get(END_POINTS.PAYMENTS.CONFIG, PaymentsController.config);

paymentsRouter.get(
  END_POINTS.PAYMENTS.GET_PRICES_LIST,
  PaymentsController.getPricesList
);

paymentsRouter.get(
  END_POINTS.PAYMENTS.GET_PRODUCTS_LIST_WITH_PRICES,
  PaymentsController.getProductsListWithPrices
);

paymentsRouter.post(
  END_POINTS.PAYMENTS.CREATE_CHECKOUT_SESSION,
  PaymentsController.createCheckoutSession
);

paymentsRouter.post(
  END_POINTS.PAYMENTS.WEBHOOK,
  express.raw({ type: "application/json" }),
  PaymentsController.webhook
);

paymentsRouter.get(
  END_POINTS.PAYMENTS.GET_CHECKOUT_SESSION_DATA,
  PaymentsController.getCheckoutSessionData
);

paymentsRouter.get(
  END_POINTS.PAYMENTS.GET_SUBSCRIPTION_DETAILS,
  PaymentsController.getSubscriptionDetails
);

paymentsRouter.post(
  END_POINTS.PAYMENTS.CANCEL_SUBSCRIPTION,
  express.raw({ type: "application/json" }),
  PaymentsController.cancelSubscription
);

export default paymentsRouter;
