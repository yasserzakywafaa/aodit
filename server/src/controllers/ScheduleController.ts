import { NextFunction, Request, Response } from "express";

import testScheduleJob from "../services/agenda/jobs/testSchedule";

export const testSchedule = async () => {
  testScheduleJob();
};

export const cancelSchedule = async () => {
  // cancelScheduleJob();
};

export const getAllSchedules = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  // const scheduleId = request.query.scheduleId as string;

  try {
    // Logic to fetch all schedules
    response.status(200).json({ message: "All schedules" });
  } catch (error) {
    next(error);
  }
};
const ContactController = {
  testSchedule,
  getAllSchedules,
};

export default ContactController;
