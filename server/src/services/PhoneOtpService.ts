import CONFIG from "../config";
import crypto from "crypto";
import twilio from "twilio";

export type PhoneOtpPurpose = "register" | "login";

interface DevOtpRecord {
  hashedCode: string;
  expiresAt: number;
  attempts: number;
}

const PHONE_NUMBER_REGEX = /^\+[1-9]\d{7,14}$/;
const MIN_OTP_VALUE = 100000;
const MAX_OTP_VALUE = 999999;
const DEV_OTP_STORE = new Map<string, DevOtpRecord>();

const IS_TWILIO_CONFIGURED = Boolean(
  CONFIG.TWILIO_ACCOUNT_SID &&
    CONFIG.TWILIO_AUTH_TOKEN &&
    CONFIG.TWILIO_VERIFY_SERVICE_SID,
);

const CAN_USE_DEV_FALLBACK = CONFIG.IS_LOCAL || CONFIG.IS_DEV;

const twilioClient = IS_TWILIO_CONFIGURED
  ? twilio(CONFIG.TWILIO_ACCOUNT_SID!, CONFIG.TWILIO_AUTH_TOKEN!)
  : null;

const getStoreKey = (phoneNumber: string, purpose: PhoneOtpPurpose): string =>
  `${purpose}:${phoneNumber}`;

const hashOtpCode = (otpCode: string): string =>
  crypto.createHash("sha256").update(otpCode).digest("hex");

const generateOtpCode = (): string => {
  const otpCode =
    Math.floor(Math.random() * (MAX_OTP_VALUE - MIN_OTP_VALUE + 1)) +
    MIN_OTP_VALUE;
  return String(otpCode);
};

const cleanupExpiredCodes = (): void => {
  const now = Date.now();
  DEV_OTP_STORE.forEach((record, key) => {
    if (record.expiresAt <= now) {
      DEV_OTP_STORE.delete(key);
    }
  });
};

const normalizePhoneNumber = (rawPhoneNumber: string): string => {
  const compactPhoneNumber = rawPhoneNumber.trim().replace(/[\s()-]/g, "");
  if (compactPhoneNumber.startsWith("00")) {
    return `+${compactPhoneNumber.slice(2)}`;
  }
  return compactPhoneNumber;
};

const isValidPhoneNumber = (phoneNumber: string): boolean =>
  PHONE_NUMBER_REGEX.test(phoneNumber);

const sendOtp = async (
  phoneNumber: string,
  purpose: PhoneOtpPurpose,
): Promise<void> => {
  cleanupExpiredCodes();

  if (twilioClient) {
    const verification = await twilioClient.verify.v2
      .services(CONFIG.TWILIO_VERIFY_SERVICE_SID!)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      });

    if (verification.status !== "pending") {
      throw new Error(
        "Failed to send OTP with Twilio Verify. Please try again.",
      );
    }
    return;
  }

  if (!CAN_USE_DEV_FALLBACK) {
    throw new Error(
      "Phone OTP is not configured. Please set Twilio credentials first.",
    );
  }

  const otpCode = generateOtpCode();
  DEV_OTP_STORE.set(getStoreKey(phoneNumber, purpose), {
    hashedCode: hashOtpCode(otpCode),
    expiresAt: Date.now() + CONFIG.PHONE_OTP_EXPIRY_SECONDS * 1000,
    attempts: 0,
  });

  console.info(
    `🔐 [PhoneOtpService] DEV OTP for ${phoneNumber} (${purpose}): ${otpCode}`,
  );
};

const verifyOtp = async (
  phoneNumber: string,
  otpCode: string,
  purpose: PhoneOtpPurpose,
): Promise<boolean> => {
  cleanupExpiredCodes();

  if (twilioClient) {
    const verificationCheck = await twilioClient.verify.v2
      .services(CONFIG.TWILIO_VERIFY_SERVICE_SID!)
      .verificationChecks.create({
        to: phoneNumber,
        code: otpCode.trim(),
      });

    return verificationCheck.status === "approved";
  }

  if (!CAN_USE_DEV_FALLBACK) {
    throw new Error(
      "Phone OTP is not configured. Please set Twilio credentials first.",
    );
  }

  const key = getStoreKey(phoneNumber, purpose);
  const otpRecord = DEV_OTP_STORE.get(key);

  if (!otpRecord) {
    return false;
  }

  if (otpRecord.expiresAt <= Date.now()) {
    DEV_OTP_STORE.delete(key);
    return false;
  }

  const nextAttempts = otpRecord.attempts + 1;
  if (nextAttempts > CONFIG.PHONE_OTP_MAX_ATTEMPTS) {
    DEV_OTP_STORE.delete(key);
    return false;
  }

  const isValidOtp = otpRecord.hashedCode === hashOtpCode(otpCode.trim());
  if (isValidOtp) {
    DEV_OTP_STORE.delete(key);
    return true;
  }

  DEV_OTP_STORE.set(key, {
    ...otpRecord,
    attempts: nextAttempts,
  });
  return false;
};

export const PhoneOtpService = {
  normalizePhoneNumber,
  isValidPhoneNumber,
  sendOtp,
  verifyOtp,
  isTwilioConfigured: IS_TWILIO_CONFIGURED,
};
