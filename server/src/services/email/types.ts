/**
 * Base email data interface with common fields
 */
export interface BaseEmailData {
  userName?: string;
  appUrl: string;
  docsUrl?: string;
}

/**
 * Project ready email data
 */
export interface ProjectReadyEmailData extends BaseEmailData {
  userName: string;
  projectTitle: string;
  projectUrl: string;
}

/**
 * Contact form user confirmation email data
 */
export interface ContactUserEmailData extends BaseEmailData {
  name: string;
  message?: string;
}

/**
 * Contact form admin notification email data
 */
export interface ContactAdminEmailData extends BaseEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Registration welcome email data
 */
export interface RegistrationEmailData extends BaseEmailData {
  userName: string;
}

/**
 * Lead magnet subscriber confirmation email data (sent to user)
 */
export interface LeadMagnetSubscriberEmailData extends BaseEmailData {
  email: string;
}

/**
 * Lead magnet admin notification email data (sent to admin)
 */
export interface LeadMagnetAdminEmailData extends BaseEmailData {
  email: string;
  subscribedAt: string;
}
