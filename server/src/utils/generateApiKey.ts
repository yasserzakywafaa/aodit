import crypto from "crypto";

export const generateApiKey = (prefix = "sk-bz-", hexLength = 64) => {
  const randomHex = crypto.randomBytes(hexLength / 2).toString("hex");
  return `${prefix}${randomHex}`;
};
