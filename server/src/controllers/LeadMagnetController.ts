import { Request, Response } from "express";

import { handleLeadMagnetSubscribe } from "../services/email/leadMagnetService";

export const subscribe = async (request: Request, response: Response) => {
  const email = request.body?.email;
  if (!email || typeof email !== "string") {
    response.status(400).json({ message: "Email is required" });
    return;
  }

  const result = await handleLeadMagnetSubscribe(email);

  if (!result.success) {
    const isValidationError =
      result.message === "Email is required" ||
      result.message === "Invalid email address";
    response
      .status(isValidationError ? 400 : 500)
      .json({
        message:
          result.message ?? "Something went wrong. Please try again later.",
      });
    return;
  }

  response.status(200).json({
    message: result.alreadySubscribed
      ? "You're already on the list."
      : "You're on the list. Check your inbox for confirmation.",
  });
};

const LeadMagnetController = {
  subscribe,
};

export default LeadMagnetController;
