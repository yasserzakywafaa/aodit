import { ContactAdminEmailData, ContactUserEmailData } from "../email/types";
import {
  generateContactAdminPlainText,
  generateContactUserPlainText,
} from "../email/utils/plainTextGenerator";

import CONFIG from "../../config";
import { createOAuth2Transporter } from "../email/utils/sendEmail";
import { renderEmailTemplate } from "../email/emailTemplateService";

export interface ContactFormState {
  name: string;
  company?: string;
  email: string;
  reportOfInterest?: string;
  message: string;
}

type ContactSupportParams = ContactFormState;

export const handleContactSupport = async (props: ContactSupportParams) => {
  const { name, company, email, reportOfInterest, message } = props;

  const transporter = await createOAuth2Transporter();

  // Prepare admin email data
  const adminEmailData: ContactAdminEmailData = {
    name,
    company,
    email,
    reportOfInterest,
    message,
    appUrl: CONFIG.APP_URL,
  };

  // Prepare user email data
  const userEmailData: ContactUserEmailData = {
    name,
    message,
    appUrl: CONFIG.APP_URL,
  };

  // Check admin recipient is configured
  const adminEmail =
    CONFIG.GMAIL_FORWARD_TO ?? CONFIG.GMAIL_SENDER ?? CONFIG.EMAIL;
  if (!adminEmail) {
    console.error("GMAIL_FORWARD_TO (or GMAIL_SENDER/EMAIL) is not set");
    throw new Error(
      "Email configuration error: GMAIL_FORWARD_TO is not configured",
    );
  }
  const sender = CONFIG.GMAIL_SENDER ?? CONFIG.EMAIL;
  if (!sender) {
    console.error("GMAIL_SENDER (or EMAIL) is not set");
    throw new Error("Email configuration error: sender is not configured");
  }

  // Generate HTML content using Handlebars templates
  const adminHtmlContent = renderEmailTemplate(
    "contactAdminNotification",
    adminEmailData,
  );
  const userHtmlContent = renderEmailTemplate(
    "contactUserConfirmation",
    userEmailData,
  );

  // Generate plain text fallbacks
  const adminTextContent = generateContactAdminPlainText(adminEmailData);
  const userTextContent = generateContactUserPlainText(userEmailData);

  const mailOptionsAdmin = {
    from: `"aodit.ai" <${sender}>`,
    to: adminEmail,
    subject: `Rating request${reportOfInterest ? `: ${reportOfInterest}` : ""}`,
    text: adminTextContent,
    html: adminHtmlContent,
    replyTo: email,
  };

  const mailOptionsUser = {
    from: `"aodit.ai" <${sender}>`,
    to: email,
    subject: "Thank you for contacting us!",
    text: userTextContent,
    html: userHtmlContent,
  };

  try {
    // Send two emails in parallel
    await Promise.all([
      // Email 1: Notification to admin
      transporter.sendMail(mailOptionsAdmin),
      // Email 2: Confirmation to user
      transporter.sendMail(mailOptionsUser),
    ]);
  } catch (error: any) {
    throw error;
  }
};
