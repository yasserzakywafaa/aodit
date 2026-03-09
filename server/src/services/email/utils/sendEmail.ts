import CONFIG from "../../../config";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { Transporter } from "nodemailer";
import { google } from "googleapis";
import nodeMailer from "nodemailer";

export function createSmtpTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
  const port = parseInt(CONFIG.SMTP_PORT ?? "587", 10);
  return nodeMailer.createTransport({
    host: CONFIG.SMTP,
    port,
    secure: port === 465,
    auth: {
      user: CONFIG.EMAIL,
      pass: CONFIG.EMAIL_PASSWORD,
    },
  });
}

export async function createOAuth2Transporter(): Promise<
  Transporter<SMTPTransport.SentMessageInfo>
> {
  const oAuth2Client = new google.auth.OAuth2(
    CONFIG.GMAIL_CLIENT_ID,
    CONFIG.GMAIL_CLIENT_SECRET,
  );

  oAuth2Client.setCredentials({
    refresh_token: CONFIG.GMAIL_REFRESH_TOKEN,
  });

  const { token: accessToken } = await oAuth2Client.getAccessToken();
  if (!accessToken) {
    throw new Error("Failed to get Gmail OAuth2 access token");
  }

  return nodeMailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: CONFIG.GMAIL_SENDER,
      clientId: CONFIG.GMAIL_CLIENT_ID,
      clientSecret: CONFIG.GMAIL_CLIENT_SECRET,
      refreshToken: CONFIG.GMAIL_REFRESH_TOKEN,
      accessToken,
    },
    debug: process.env.NODE_ENV === "development",
  } as SMTPTransport.Options);
}
