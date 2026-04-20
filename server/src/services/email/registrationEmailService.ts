import CONFIG from "../../config";
import { RegistrationEmailData } from "./types";
import { User } from "../../models/types";
import { createOAuth2Transporter, createSmtpTransporter } from "./utils/sendEmail";
import { generateRegistrationWelcomePlainText } from "./utils/plainTextGenerator";
import { renderEmailTemplate } from "./emailTemplateService";

export interface SendRegistrationWelcomeEmailParams {
  user: User;
}

/**
 * Sends a welcome email to newly registered users
 * This function is non-blocking and will not throw errors to avoid breaking the registration flow
 */
export const sendRegistrationWelcomeEmail = async (
  params: SendRegistrationWelcomeEmailParams,
): Promise<{ success: boolean; error?: string }> => {
  const { user } = params;

  // Validate required fields
  if (!user?.email) {
    console.error(
      "❌ Cannot send registration welcome email: user email is missing",
    );
    return { success: false, error: "User email is missing" };
  }

  try {
    const isGmailConfigured = Boolean(
      CONFIG.GMAIL_CLIENT_ID &&
      CONFIG.GMAIL_CLIENT_SECRET &&
      CONFIG.GMAIL_REFRESH_TOKEN,
    );
    const transporter = isGmailConfigured
      ? await createOAuth2Transporter()
      : createSmtpTransporter();

    const userName =
      user.name?.givenName && user.name?.familyName
        ? `${user.name.givenName} ${user.name.familyName}`
        : user.name?.givenName || user.email || "User";

    // Prepare email data
    const emailData: RegistrationEmailData = {
      userName,
      appUrl: CONFIG.APP_URL,
      docsUrl: CONFIG.APP_DOCS_LINK,
    };

    // Generate HTML content using Handlebars template
    const htmlContent = renderEmailTemplate("registrationWelcome", emailData);

    // Generate plain text fallback
    const textContent = generateRegistrationWelcomePlainText({
      userName,
    });

    const mailOptions = {
      from: `Yasser from "aodit.ai" <${CONFIG.GMAIL_SENDER ?? CONFIG.EMAIL}>`,
      to: user.email,
      subject: "Welcome to aodit.ai! 🎉",
      text: textContent,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Registration welcome email sent successfully", {
      userEmail: user.email,
      userName,
    });

    return { success: true };
  } catch (error: any) {
    console.error("❌ Failed to send registration welcome email", {
      userEmail: user.email,
      error: error.message,
    });

    return {
      success: false,
      error: error.message || "Unknown error occurred",
    };
  }
};
