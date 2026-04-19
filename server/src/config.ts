import dotenv from "dotenv";
import path from "path";

dotenv.config();

const CONFIG = {
  DEV_PORT: process.env.DEV_PORT,
  PROD_PORT: process.env.PROD_PORT,

  // Environment
  NODE_ENV: process.env.NODE_ENV,
  IS_LOCAL: process.env.NODE_ENV === "local",
  IS_DEV: process.env.NODE_ENV === "development",
  IS_PROD: process.env.NODE_ENV === "production",
  LOCAL_CLIENT_URL: process.env.LOCAL_CLIENT_URL,
  LOCAL_SERVER_URL: process.env.LOCAL_SERVER_URL,

  // Public URLs
  PUBLIC_URLS_SERVER_DEV: process.env.PUBLIC_URLS_SERVER_DEV,
  PUBLIC_URLS_SERVER_PROD: process.env.PUBLIC_URLS_SERVER_PROD,
  PUBLIC_URLS_CLIENT_DEV: process.env.PUBLIC_URLS_CLIENT_DEV,
  PUBLIC_URLS_CLIENT_PROD: process.env.PUBLIC_URLS_CLIENT_PROD,

  //  Encryption
  ENCRYPTION_PASSWORD: process.env.ENCRYPTION_PASSWORD,
  ENCRYPTION_SALT: process.env.ENCRYPTION_SALT,

  // Paths
  FRONTEND_DEV_PATH: path.resolve("../client/public"),
  FRONTEND_BUILD_PATH: process.env.FRONTEND_BUILD_PATH || path.resolve("../client/dist"),
  SERVE_STATIC_CONTENT: process.env.SERVE_STATIC_CONTENT,

  // GitLab
  GITLAB: {
    GITLAB_PROJECT_ID: process.env.GITLAB_PROJECT_ID,
    GITLAB_ACCESS_TOKEN: process.env.GITLAB_ACCESS_TOKEN,
    FILE_URL: (projectId: string, filePath: string, branch: string) =>
      `https://gitlab.com/api/v4/projects/${projectId}/repository/files/${encodeURIComponent(
        filePath,
      )}/raw?ref=${branch}`,
    UPDATE_URL: (projectId: string) =>
      `https://gitlab.com/api/v4/projects/${projectId}/repository/commits`,
    SITEMAP_PATH: (sitemapFileName: string) =>
      `client/public/sitemaps/${sitemapFileName}`,
  },

  // Google Service Account
  GOOGLE_TYPE: process.env.GOOGLE_TYPE,
  GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID,
  GOOGLE_PRIVATE_KEY_ID: process.env.GOOGLE_PRIVATE_KEY_ID,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Fix newline formatting,
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_AUTH_URI: process.env.GOOGLE_AUTH_URI,
  GOOGLE_TOKEN_URI: process.env.GOOGLE_TOKEN_URI,
  GOOGLE_AUTH_PROVIDER_CERT_URL: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  GOOGLE_CLIENT_CERT_URL: process.env.GOOGLE_CLIENT_CERT_URL,
  GOOGLE_UNIVERSE_DOMAIN: process.env.GOOGLE_UNIVERSE_DOMAIN,

  // // APIs keys for AI

  // AI / LLM provider
  // OPENROUTER_BASE_URL: for on-prem deployments, set this to the bank's internal
  // OpenAI-compatible endpoint (e.g., http://llm.bank.internal:11434/v1 for Ollama,
  // or an Azure OpenAI endpoint). Defaults to openrouter.ai for cloud deployments.
  OPENROUTER_BASE_URL:
    process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
  OPENROUTER_API_KEY:
    process.env.NODE_ENV === "development"
      ? process.env.OPENROUTER_API_KEY_DEV
      : process.env.OPENROUTER_API_KEY_PROD,
  OPENROUTER_MODEL_NAME:
    process.env.OPENROUTER_MODEL_NAME || "openai/gpt-5-mini",
  OPENROUTER_WEB_BROWSE_MODEL:
    process.env.OPENROUTER_WEB_BROWSE_MODEL || "openai/gpt-5-mini:online",

  // Legacy OpenAI API key (kept for backward compatibility with externalOpenAiApiKey)
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,

  // Database
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_URI_DEV: process.env.MONGODB_URI_DEV,
  MONGODB_URI_PROD: process.env.MONGODB_URI_PROD,

  // Hosting
  HOST_AWS_S3_BUCKET_NAME: process.env.HOST_AWS_S3_BUCKET_NAME,
  HOST_AWS_S3_KEY_PREFIX_DEV: process.env.HOST_AWS_S3_KEY_PREFIX_DEV,
  HOST_AWS_S3_KEY_PREFIX_PROD: process.env.HOST_AWS_S3_KEY_PREFIX_PROD,
  HOST_AWS_ACCESS_KEY: process.env.HOST_AWS_ACCESS_KEY,
  HOST_AWS_SECRET_KEY: process.env.HOST_AWS_SECRET_KEY,
  HOST_AWS_REGION: process.env.HOST_AWS_REGION,

  // --- Email Service ---
  SMTP: process.env.SMTP,
  SMTP_PORT: process.env.SMTP_PORT,
  EMAIL: process.env.EMAIL,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  // Gmail OAuth2 for Google
  GMAIL_SENDER: process.env.GMAIL_SENDER,
  GMAIL_FORWARD_TO: process.env.GMAIL_FORWARD_TO,
  GMAIL_CLIENT_ID: process.env.GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET: process.env.GMAIL_CLIENT_SECRET,
  GMAIL_REFRESH_TOKEN: process.env.GMAIL_REFRESH_TOKEN,

  // Analytics
  GOOGLE_ANALYTICS_MEASUREMENT_ID: process.env.GOOGLE_ANALYTICS_MEASUREMENT_ID,
  GOOGLE_ANALYTICS_API_SECRET: process.env.GOOGLE_ANALYTICS_API_SECRET,
  GOOGLE_ANALYTICS_TRACKING_URL: (MEASUREMENT_ID: string, API_SECRET: string) =>
    `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,

  // Stripe [TEST]
  STRIPE_TEST_PUB_KEY: process.env.STRIPE_TEST_PUB_KEY,
  STRIPE_TEST_SECRET_KEY: process.env.STRIPE_TEST_SECRET_KEY,
  STRIPE_TEST_WEBHOOK_SECRET: process.env.STRIPE_TEST_WEBHOOK_SECRET,

  // Stripe [LIVE]
  STRIPE_LIVE_PUB_KEY: process.env.STRIPE_LIVE_PUB_KEY,
  STRIPE_LIVE_SECRET_KEY: process.env.STRIPE_LIVE_SECRET_KEY,
  STRIPE_LIVE_WEBHOOK_SECRET: process.env.STRIPE_LIVE_WEBHOOK_SECRET,

  // Auth
  GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
  GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  LINKEDIN_CLIENT_ID: process.env.LINKEDIN_CLIENT_ID,
  LINKEDIN_CLIENT_SECRET: process.env.LINKEDIN_CLIENT_SECRET,
  OAUTH_CALLBACK_URL: (baseURL: string, userId: string, provider: string) =>
    `${baseURL}?authStatus=success&provider=${provider}&userId=${userId}`,
  JWT_SECRET: process.env.JWT_SECRET,
  // ON_PREM: hides Google/LinkedIn/Phone auth in the UI; email+password only
  ON_PREM: process.env.ON_PREM === "true",
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_VERIFY_SERVICE_SID: process.env.TWILIO_VERIFY_SERVICE_SID,
  PHONE_OTP_EXPIRY_SECONDS: Number(process.env.PHONE_OTP_EXPIRY_SECONDS) || 300,
  PHONE_OTP_MAX_ATTEMPTS: Number(process.env.PHONE_OTP_MAX_ATTEMPTS) || 5,

  // App Constants
  MAX_PROJECTS_LIMIT_FREE: 4,
  MAX_PROJECTS_LIMIT_LITE: 20,
  MAX_PROJECTS_LIMIT_BASIC: 50,
  MAX_PROJECTS_LIMIT_ESSENTIAL: 100,
  MAX_PROJECTS_LIMIT_PREMIUM: 500,

  // AI Token Limits (1 token ≈ 0.75 words, 1 word ≈ 1.33 tokens)
  AI_MAX_TOKENS: {
    URL_FETCH: 2000, // URL data fetching
    DEFAULT: 4000, // Default for general content
  },
  // App Main URL
  APP_URL:
    process.env.LOCAL_CLIENT_URL ||
    (process.env.NODE_ENV === "development"
      ? "https://dev.aodit.ai"
      : "https://www.aodit.ai"),

  SERVER_URL:
    process.env.LOCAL_SERVER_URL ||
    (process.env.NODE_ENV === "development"
      ? "https://api-dev.aodit.ai"
      : "https://api.aodit.ai"),

  APP_DOCS_LINK:
    process.env.NODE_ENV === "development"
      ? "https://docs-dev.aodit.ai"
      : "https://docs.aodit.ai",

  INTEGRATION: {
    TEST_WORDPRESS_URL: (websiteUrl: string) => `${websiteUrl}/wp-json/wp/v2/`,
    PUBLISH_WORDPRESS_URL: (websiteUrl: string) =>
      `${websiteUrl}/wp-json/wp/v2/posts/`,
    PUBLISH_WORDPRESS_MEDIA_URL: (websiteUrl: string) =>
      `${websiteUrl}/wp-json/wp/v2/media/`,
    PUBLISH_WORDPRESS_CATEGORIES_URL: (websiteUrl: string) =>
      `${websiteUrl}/wp-json/wp/v2/categories/`,
    PUBLISH_WORDPRESS_TAGS_URL: (websiteUrl: string) =>
      `${websiteUrl}/wp-json/wp/v2/tags/`,
    TEST_GHOST_URL: (websiteUrl: string) => `${websiteUrl}/ghost/`,
    PUBLISH_GHOST_URL: (websiteUrl: string) =>
      `${websiteUrl}/ghost/api/admin/posts/?source=html`,
  },
};

export default CONFIG;
