import LeadMagnetController from "../controllers/LeadMagnetController";
import END_POINTS from "../models/endpoints";
import { Router } from "express";

const leadMagnetRouter = Router();

leadMagnetRouter.post(
  END_POINTS.LEAD_MAGNET.SUBSCRIBE,
  LeadMagnetController.subscribe
);

export default leadMagnetRouter;
