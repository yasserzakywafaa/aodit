import END_POINTS from "../models/endpoints";
import { Router } from "express";
import ScheduleController from "../controllers/ScheduleController";

const scheduleRouter = Router();

// Define API routes

scheduleRouter.post(
  END_POINTS.SCHEDULE.TEST_SCHEDULE,
  ScheduleController.testSchedule,
);

scheduleRouter.post(
  END_POINTS.SCHEDULE.GET_ALL_SCHEDULED_REPORTS,
  ScheduleController.getAllSchedules,
);

export default scheduleRouter;
