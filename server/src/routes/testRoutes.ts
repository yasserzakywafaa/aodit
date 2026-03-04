import END_POINTS from "../models/endpoints";
import { Router } from "express";
import TestController from "../controllers/TestController";

const testRouter = Router();

// Define API routes
testRouter.get(END_POINTS.TESTING.HELLO, TestController.testHello);

export default testRouter;
