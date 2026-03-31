/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_PORT: string;
  readonly REACT_APP_SERVER_PORT: string;
  readonly REACT_APP_ENV: "local" | "development" | "production";
  readonly REACT_APP_DEV_API_URL: string;
  readonly REACT_APP_PROD_API_URL: string;
  readonly REACT_APP_GOOGLE_ANALYTICS_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
