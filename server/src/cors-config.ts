import CONFIG from "./config";
import { Express } from "express";
import { createCors } from "@yasserzakywafaa/server-core";

const getAllowedOrigins = (): string[] => {
  const {
    IS_LOCAL,
    IS_DEV,
    PUBLIC_URLS_CLIENT_DEV,
    IS_PROD,
    PUBLIC_URLS_CLIENT_PROD,
  } = CONFIG;
  if ((IS_LOCAL || IS_DEV) && PUBLIC_URLS_CLIENT_DEV) {
    return PUBLIC_URLS_CLIENT_DEV.split(", ");
  }
  if (IS_PROD && PUBLIC_URLS_CLIENT_PROD) {
    return PUBLIC_URLS_CLIENT_PROD.split(", ");
  }

  return ["https://aodit.ai", "https://www.aodit.ai", "https://api.aodit.ai"];
};

const corsConfig = createCors({
  allowedOrigins: getAllowedOrigins(),
  allowRequestsWithoutOrigin: true,
  vercelPreview: {
    enabled: true,
    hostnameSuffix: ".vercel.app",
    secret: process.env.PREVIEW_SECRET,
    secretHeader: "x-preview-secret",
    requireSecret: true,
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Custom-Header",
    "X-Preview-Secret",
  ],
  credentials: true,
  optionsSuccessStatus: 204,
  onDeniedOrigin: (origin) => {
    console.error(`❌ Not allowed by CORS: ${origin}`);
  },
});

export const verifyPreviewSecret = corsConfig.verifyPreviewSecret;

const handleCorsConfig = (expressApp: Express): void => {
  expressApp.use(corsConfig.middleware);
  expressApp.options("*", corsConfig.preflightMiddleware);
  expressApp.use(corsConfig.verifyPreviewSecret);
};

export default handleCorsConfig;
