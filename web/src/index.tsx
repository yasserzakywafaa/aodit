import "./application/shared/axiosConfig"; // Initialize Axios interceptors
import "./i18n/init";

import App from "./application/App";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { Buffer } from "buffer";
import { isPrerendering } from "@yasserzakywafaa/client-core/web";
import { createRoot } from "react-dom/client";

// react-pdf expects Node's Buffer to exist in browser contexts.
if (!globalThis.Buffer) {
  globalThis.Buffer = Buffer;
}

// --- CSP Nonce Handling for MUI ---
// 1. Read the nonce from the meta tag added by generate-nonce.js
const nonce = document.querySelector<HTMLMetaElement>(
  'meta[name="csp-nonce"]',
)?.content;

if (!nonce) {
  console.warn("CSP Nonce meta tag not found. MUI styles might be blocked.");
}

// 2. Create an Emotion cache instance with the nonce.
//    speedy: false only during prerender so styles are captured as <style> tags;
//    at runtime use insertRule (speedy: true) to avoid CSS leaking as text.
const cache = createCache({
  key: "css",
  prepend: true,
  nonce: nonce,
  speedy: !isPrerendering(),
});
// --- End CSP Nonce Handling ---

const rootElement = document.getElementById("root");
if (rootElement) {
  const app = (
    // 3. Wrap the App with CacheProvider
    (<CacheProvider value={cache}>
      <App />
    </CacheProvider>)
  );

  createRoot(rootElement).render(app);
} else {
  console.error("Failed to find the root element");
}
