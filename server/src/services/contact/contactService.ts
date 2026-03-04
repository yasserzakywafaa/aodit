import { ContactAdminEmailData, ContactUserEmailData } from "../email/types";
import {
  generateContactAdminPlainText,
  generateContactUserPlainText,
} from "../email/utils/plainTextGenerator";

import CONFIG from "../../config";
import nodeMailer from "nodemailer";
import { renderEmailTemplate } from "../email/emailTemplateService";

export interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type ContactSupportParams = ContactFormState;

export const handleContactSupport = async (props: ContactSupportParams) => {
  const { name, email, subject, message } = props;

  const transporter = nodeMailer.createTransport({
    host: CONFIG.SMTP,
    port: parseInt(CONFIG.SMTP_PORT ?? "587"),
    secure: parseInt(CONFIG.SMTP_PORT ?? "587") === 465,
    auth: {
      user: CONFIG.EMAIL,
      pass: CONFIG.EMAIL_PASSWORD,
    },
  });

  // Prepare admin email data
  const adminEmailData: ContactAdminEmailData = {
    name,
    email,
    subject,
    message,
    appUrl: CONFIG.APP_URL,
  };

  // Prepare user email data
  const userEmailData: ContactUserEmailData = {
    name,
    message,
    appUrl: CONFIG.APP_URL,
  };

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
    from: CONFIG.EMAIL,
    to: CONFIG.EMAIL,
    subject: `New Contact Form Submission: ${subject}`,
    text: adminTextContent,
    html: adminHtmlContent,
    replyTo: email,
  };

  const mailOptionsUser = {
    from: `"Aodit.ai" <${CONFIG.EMAIL}>`,
    to: email,
    subject: "Thank you for contacting us!",
    text: userTextContent,
    html: userHtmlContent,
  };

  try {
    await transporter.sendMail(mailOptionsAdmin);
    await transporter.sendMail(mailOptionsUser);
  } catch (error: any) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};
