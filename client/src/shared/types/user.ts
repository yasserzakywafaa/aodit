import { Plan, Price } from "./payment";

import { Integrations } from "./integrations";

export enum AuthProviderEnum {
  google = "google",
  linkedin = "linkedin",
  phone = "phone",
}

export interface User {
  _id: string;
  userId: string;
  email: string;
  phoneNumber?: string;
  phoneVerified?: boolean;
  name: UserName;
  picture: string;
  createdAt: Date;
  lastLogin: Date;
  projectsCount: number;
  status: UserStatus;
  role: UserRole;
  isPaidUser: boolean;
  subscription: UserSubscription;
  stripeCustomerId?: string;
  preferences: UserPreferences;
  location?: string;
  timezone?: string;
  integrations?: Integrations;

  // OAuth2 fields
  refreshToken?: string;
  provider?: AuthProviderEnum;
  verified?: boolean;
}

export interface UserName {
  givenName: string;
  familyName: string;
}

export enum UserStatus {
  active = "active",
  inactive = "inactive",
  suspended = "suspended",
  blocked = "blocked",
}

export enum UserRole {
  super_admin = "super_admin",
  admin = "admin",
  user = "user",
}

export interface UserSubscription {
  id: string | undefined;
  type: SubscriptionPlanEnum;
  startDate: Date;
  endDate: Date;
  paymentHistory?: UserPaymentHistory[];
  maxProjectsAllowed: number;
  plan: Plan;
  price: Price;
  cancel_at: number | null;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  cancellation_details: CancellationDetails;
  current_period_end: number;
  current_period_start: number;
  api: UserSubscriptionApi | undefined;
}
export interface UserSubscriptionApi {
  apiAccessAllowed: boolean;
  apiKey: string;
}

export interface CancellationDetails {
  comment: string | null;
  reason:
    | "cancellation_requested"
    | "payment_disputed"
    | "payment_failed"
    | null;
}

export enum SubscriptionPlanEnum {
  Free = "Free",
  Lite = "Lite",
  Basic = "Basic",
  Essential = "Essential",
  Premium = "Premium",
}

export interface UserPaymentHistory {
  transactionId: string;
  currency: string;
  amount: number;
  date: Date;
}

export interface UserPreferences {
  theme: "light" | "dark";
  notifications: boolean;
  languagePreference?: string;
}
