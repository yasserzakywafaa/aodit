import crypto from "crypto";
import CONFIG from "../config";

// Generate a proper 32-byte key and 16-byte IV
const ENCRYPTION_KEY = crypto.scryptSync(
  CONFIG.ENCRYPTION_PASSWORD || "",
  CONFIG.ENCRYPTION_SALT || "",
  32
);
const IV_LENGTH = 16; // For AES, this is always 16

export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  // Prepend IV to the encrypted data so we can use it for decryption
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (encryptedText: string) => {
  const textParts = encryptedText.split(":");
  const iv = Buffer.from(textParts.shift()!, "hex");
  const encryptedData = Buffer.from(textParts.join(":"), "hex");

  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};
