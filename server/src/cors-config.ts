import CONFIG from "./config";
import { Express, NextFunction, Request, Response } from "express";
import cors from "cors";

const isVercelOrigin = (origin: string): boolean => {
  try {
    const { hostname } = new URL(origin);
    return hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

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

const corsOptions = {
  origin: (origin: string, callback: Function) => {
    const allowedOrigins = getAllowedOrigins();

    if (
      !origin ||
      allowedOrigins.indexOf(origin) !== -1 ||
      isVercelOrigin(origin)
    ) {
      callback(null, true);
    } else {
      console.error(`❌ Not allowed by CORS: ${origin}`);
      callback(new Error("❌ Not allowed by CORS"));
    }
  },
  // origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Custom-Header",
    "X-Preview-Secret",
  ],
  credentials: true, // Allow credentials (cookies, authorization headers)
  optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

export const verifyPreviewSecret = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  const origin = req.headers.origin;
  if (!origin || !isVercelOrigin(origin)) {
    return next();
  }

  const previewSecret = req.headers["x-preview-secret"];
  const expectedSecret = process.env.PREVIEW_SECRET;

  if (!expectedSecret || previewSecret !== expectedSecret) {
    console.error(`❌ Invalid preview secret for Vercel origin: ${origin}`);
    return res.status(403).json({ error: "Forbidden: invalid preview secret" });
  }

  return next();
};

const handleCorsConfig = (expressApp: Express) => {
  // Always use the full cors options to ensure credentials are allowed
  expressApp.use(cors(corsOptions));

  // Explicitly handle OPTIONS requests
  expressApp.options("*", cors(corsOptions));

  expressApp.use(verifyPreviewSecret);
};

export default handleCorsConfig;
