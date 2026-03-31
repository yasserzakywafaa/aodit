/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PORT: string;
  readonly VITE_SERVER_PORT: string;
  readonly VITE_APP_ENV: "local" | "development" | "production";
  readonly VITE_DEV_API_URL: string;
  readonly VITE_PROD_API_URL: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
