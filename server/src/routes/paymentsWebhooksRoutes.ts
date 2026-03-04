import express, { Router } from "express";

import END_POINTS from "../models/endpoints";
import PaymentsController from "../controllers/PaymentsController";

const paymentWebhooksRouter = Router();

paymentWebhooksRouter.post(
  END_POINTS.PAYMENTS.WEBHOOK,
  express.raw({ type: "application/json" }),
  PaymentsController.webhook
);

export default paymentWebhooksRouter;
