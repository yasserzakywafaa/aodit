import { Request, Response } from "express";
import { handleLeadMagnetSubscribe } from "../services/leadMagnet/leadMagnetService";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const subscribe = async (request: Request, response: Response) => {
  const email = request.body?.email;
  if (!email || typeof email !== "string") {
    response.status(400).json({
      message: "Email is required",
    });
    return;
  }
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) {
    response.status(400).json({
      message: "Email is required",
    });
    return;
  }
  if (!emailRegex.test(trimmed)) {
    response.status(400).json({
      message: "Please enter a valid email address",
    });
    return;
  }

  try {
    const result = await handleLeadMagnetSubscribe(trimmed);
    response.status(200).json({
      message: result.alreadySubscribed
        ? "You're already on the list."
        : "You're on the list. Check your inbox for confirmation.",
    });
  } catch (error: any) {
    console.error("❌ Lead magnet subscribe failed", { email: trimmed, error });
    response.status(500).json({
      message: "Something went wrong. Please try again later.",
      error: error?.message || "Unknown error",
    });
  }
};

const LeadMagnetController = {
  subscribe,
};

export default LeadMagnetController;
