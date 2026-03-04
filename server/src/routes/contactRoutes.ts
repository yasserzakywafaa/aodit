import ContactController from "../controllers/ContactController";
import END_POINTS from "../models/endpoints";
import { Router } from "express";

const contactRouter = Router();

// Define API routes
contactRouter.post(
  END_POINTS.CONTACT.SUPPORT,
  ContactController.contactSupport
);

export default contactRouter;
