import App from "./application/App";
import "./application/shared/axiosConfig"; // Initialize Axios interceptors
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { createRoot, hydrateRoot } from "react-dom/client";

// --- CSP Nonce Handling for MUI ---
// 1. Read the nonce from the meta tag added by generate-nonce.js
const nonce = document.querySelector<HTMLMetaElement>(
  'meta[name="csp-nonce"]'
)?.content;

if (!nonce) {
  console.warn("CSP Nonce meta tag not found. MUI styles might be blocked.");
}

// 2. Create an Emotion cache instance with the nonce
const cache = createCache({
  key: "css",
  nonce: nonce,
});
// --- End CSP Nonce Handling ---

const rootElement = document.getElementById("root");
if (rootElement) {
  const app = (
    // 3. Wrap the App with CacheProvider
    <CacheProvider value={cache}>
      <App />
    </CacheProvider>
  );

  if (rootElement.hasChildNodes()) {
    // Pre-rendered HTML exists — hydrate to attach React to existing markup
    hydrateRoot(rootElement, app);
  } else {
    // No pre-rendered HTML — standard client-side render
    createRoot(rootElement).render(app);
  }
} else {
  console.error("Failed to find the root element");
}
