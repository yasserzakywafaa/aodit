import {
  ContactFormState,
  handleContactSupport,
} from "../services/contact/contactService";
import { NextFunction, Request, Response } from "express";

export const contactSupport = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const { name, email, subject, message } = request.body as ContactFormState;

  try {
    await handleContactSupport({ name, email, subject, message });

    response.status(200).send("✅ Emails sent successfully");
  } catch (error: any) {
    response.status(400).json({
      message: `❌ Failed to send email!`,
      error: error?.message || "Unknown error occurred",
    });
  }
};

const ContactController = {
  contactSupport,
};

export default ContactController;
