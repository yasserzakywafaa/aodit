/**
 * Generate a plain text version from email data
 * This is a simple utility to create plain text fallbacks for emails
 */

export interface ProjectReadyPlainTextData {
  userName: string;
  projectTitle: string;
  projectUrl: string;
}

export interface ContactUserPlainTextData {
  name: string;
  message?: string;
}

export interface ContactAdminPlainTextData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface RegistrationWelcomePlainTextData {
  userName: string;
}

/**
 * Generate plain text for project ready email
 */
export const generateProjectReadyPlainText = (
  data: ProjectReadyPlainTextData,
): string => {
  const { userName, projectTitle, projectUrl } = data;
  return `
Your project is ready! 🎉

Hello ${userName},

Great news! Your project "${projectTitle}" has been successfully generated and is now ready to view.

Read your project here: ${projectUrl} 

Best regards,
The Metriz.ai Team
  `.trim();
};

/**
 * Generate plain text for contact user confirmation email
 */
export const generateContactUserPlainText = (
  data: ContactUserPlainTextData,
): string => {
  const { name, message } = data;
  let text = `
Thank you for contacting us!

Hello ${name},

Thank you for reaching out to us. We have received your message and our team will get back to you as soon as possible.
  `.trim();

  if (message) {
    text += `\n\nYour Message:\n${message}`;
  }

  text += `\n\nBest regards,\nThe Metriz.ai Team`;

  return text;
};

/**
 * Generate plain text for contact admin notification email
 */
export const generateContactAdminPlainText = (
  data: ContactAdminPlainTextData,
): string => {
  const { name, email, subject, message } = data;
  return `
New Contact Form Submission

Sender Details:
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Reply to: ${email}

Best regards,
The Metriz.ai Team
  `.trim();
};

/**
 * Generate plain text for registration welcome email
 */
export const generateRegistrationWelcomePlainText = (
  data: RegistrationWelcomePlainTextData,
): string => {
  const { userName } = data;
  return `
Welcome to Metriz.ai! 🎉

Hello ${userName},

We're thrilled to have you join the Metriz.ai community! You're now ready to create stunning, AI-powered projects in seconds.

Getting Started:
1. Enter your project topic or URL
2. Let our AI generate your content
3. Review and customize your project
4. Publish and share with the world!

Best regards,
The Metriz.ai Team
  `.trim();
};
