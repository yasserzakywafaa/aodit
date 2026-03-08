import {
  LeadMagnetAdminEmailData,
  LeadMagnetSubscriberEmailData,
} from "../email/types";
import {
  generateLeadMagnetAdminPlainText,
  generateLeadMagnetSubscriberPlainText,
} from "../email/utils/plainTextGenerator";
import { renderEmailTemplate } from "../email/emailTemplateService";
import CONFIG from "../../config";
import nodeMailer from "nodemailer";
import { DBCollectionsEnum } from "../../models/mongoDb";
import {
  createDocument,
  readDocumentByField,
} from "../../models/mongoDb/crudOperations";

export const handleLeadMagnetSubscribe = async (email: string) => {
  const existing = await readDocumentByField(
    "email",
    email.toLowerCase().trim(),
    DBCollectionsEnum.lead_subscribers,
  );
  if (existing) {
    return { success: true, alreadySubscribed: true };
  }

  const subscriber = {
    email: email.toLowerCase().trim(),
    createdAt: new Date(),
  };
  await createDocument(subscriber, DBCollectionsEnum.lead_subscribers);

  const transporter = nodeMailer.createTransport({
    host: CONFIG.SMTP,
    port: parseInt(CONFIG.SMTP_PORT ?? "587"),
    secure: parseInt(CONFIG.SMTP_PORT ?? "587") === 465,
    auth: {
      user: CONFIG.EMAIL,
      pass: CONFIG.EMAIL_PASSWORD,
    },
  });

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
    from: `"Aodit.ai" <${CONFIG.EMAIL}>`,
    to: subscriber.email,
    subject: "You're on the list",
    text: subscriberText,
    html: subscriberHtml,
  };

  const mailOptionsAdmin = {
    from: CONFIG.EMAIL,
    to: CONFIG.EMAIL,
    subject: "New lead-magnet signup",
    text: adminText,
    html: adminHtml,
  };

  await transporter.sendMail(mailOptionsUser);
  await transporter.sendMail(mailOptionsAdmin);

  return { success: true, alreadySubscribed: false };
};
