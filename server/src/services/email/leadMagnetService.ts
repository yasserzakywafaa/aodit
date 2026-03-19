import {
  LeadMagnetAdminEmailData,
  LeadMagnetSubscriberEmailData,
} from "./types";
import {
  createDocument,
  readDocumentByField,
} from "../../models/mongoDb/crudOperations";
import {
  generateLeadMagnetAdminPlainText,
  generateLeadMagnetSubscriberPlainText,
} from "./utils/plainTextGenerator";

import CONFIG from "../../config";
import { DBCollectionsEnum } from "../../models/mongoDb";
import { createOAuth2Transporter } from "./utils/sendEmail";
import { renderEmailTemplate } from "./emailTemplateService";

export interface LeadMagnetSubscribeResponse {
  success: boolean;
  message?: string;
  alreadySubscribed?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function handleLeadMagnetSubscribe(
  email: string,
): Promise<LeadMagnetSubscribeResponse> {
  try {
    // Validate required field
    if (!email?.trim()) {
      return {
        success: false,
        message: "Email is required",
      };
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Validate email format
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return {
        success: false,
        message: "Invalid email address",
      };
    }

    const existing = await readDocumentByField(
      "email",
      trimmedEmail,
      DBCollectionsEnum.lead_subscribers,
    );
    if (existing) {
      return { success: true, alreadySubscribed: true };
    }

    // Check admin recipient is configured
    const adminEmail =
      CONFIG.GMAIL_FORWARD_TO ?? CONFIG.GMAIL_SENDER ?? CONFIG.EMAIL;
    if (!adminEmail) {
      console.error("GMAIL_FORWARD_TO (or GMAIL_SENDER/EMAIL) is not set");
      return {
        success: false,
        message:
          "Email configuration error: GMAIL_FORWARD_TO is not configured",
      };
    }

    const sender = CONFIG.GMAIL_SENDER ?? CONFIG.EMAIL;
    if (!sender) {
      console.error("GMAIL_SENDER (or EMAIL) is not set");
      return {
        success: false,
        message: "Email configuration error: sender is not configured",
      };
    }

    const subscriber = {
      email: trimmedEmail,
      createdAt: new Date(),
    };
    await createDocument(subscriber, DBCollectionsEnum.lead_subscribers);

    const transporter = await createOAuth2Transporter();

    const subscriberEmailData: LeadMagnetSubscriberEmailData = {
      email: subscriber.email,
      appUrl: CONFIG.APP_URL,
    };
    const adminEmailData: LeadMagnetAdminEmailData = {
      email: subscriber.email,
      subscribedAt: subscriber.createdAt.toISOString(),
      appUrl: CONFIG.APP_URL,
    };

    const subscriberHtml = renderEmailTemplate(
      "leadMagnetSubscriberConfirmation",
      subscriberEmailData,
    );
    const adminHtml = renderEmailTemplate(
      "leadMagnetAdminNotification",
      adminEmailData,
    );
    const subscriberText = generateLeadMagnetSubscriberPlainText({
      email: subscriber.email,
    });
    const adminText = generateLeadMagnetAdminPlainText({
      email: subscriber.email,
      subscribedAt: subscriber.createdAt.toISOString(),
    });

    const mailOptionsUser = {
      from: `Yasser from "aodit.ai" <${sender}>`,
      to: subscriber.email,
      subject: "You're on the list",
      text: subscriberText,
      html: subscriberHtml,
    };

    const mailOptionsAdmin = {
      from: `Yasser from "aodit.ai" <${sender}>`,
      to: adminEmail,
      subject: "New lead-magnet signup",
      text: adminText,
      html: adminHtml,
    };

    // Send both emails in parallel
    await Promise.all([
      transporter.sendMail(mailOptionsUser),
      transporter.sendMail(mailOptionsAdmin),
    ]);

    return { success: true, alreadySubscribed: false };
  } catch (error) {
    console.error("Lead magnet subscribe failed:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to send confirmation email",
    };
  }
}
