const APP_CONSTANTS = {
  DESIGN: {
    LOCAL_STORAGE_APP_THEME: "appTheme",
  },
  // Variables
  DEV_CLIENT_PORT: process.env.REACT_APP_PORT,
  DEV_SERVER_PORT: process.env.REACT_APP_SERVER_PORT,
  DEV_API_URL: process.env.REACT_APP_DEV_API_URL,
  PROD_API_URL: process.env.REACT_APP_PROD_API_URL,

  // Environment
  IS_LOCAL: process.env.REACT_APP_ENV === "local",
  IS_DEV: process.env.REACT_APP_ENV === "development",
  IS_PROD: process.env.REACT_APP_ENV === "production",

  // Tracking
  GOOGLE_ANALYTICS_ID: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,

  // Others
  LOCAL_STORAGE: {
    SW_RELOAD_ONCE: "SW_RELOAD_ONCE",
    TOKEN: "token",
    USER: "user",
    AUTHENTICATED: "isAuthenticated",
  },
  APP_THEME_CLASS: {
    DARK: "dark",
    LIGHT: "light",
  },
  MAX_APP_LIMIT_FREE: 4,
  MAX_APP_LIMIT_LITE: 20,
  MAX_APP_LIMIT_BASIC: 50,
  MAX_APP_LIMIT_ESSENTIAL: 100,
  MAX_APP_LIMIT_PREMIUM: 500,
  // App Main URL
  APP_URL:
    process.env.REACT_APP_ENV === "local" ||
    process.env.REACT_APP_ENV === "development"
      ? "https://dev.aodit.ai"
      : "https://www.aodit.ai",

  // Docs URL
  APP_DOCS_LINK:
    process.env.REACT_APP_ENV === "local" ||
    process.env.REACT_APP_ENV === "development"
      ? "https://docs-dev.aodit.ai"
      : "https://docs.aodit.ai",

  // Featured report PDF (e.g. AWS S3 presigned or public URI)
  FEATURED_REPORT_PDF_URL: "",
};

export default APP_CONSTANTS;
