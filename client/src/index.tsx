import App from "./application/App";
import "./application/shared/axiosConfig"; // Initialize Axios interceptors
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { createRoot } from "react-dom/client";

// --- CSP Nonce Handling for MUI ---
// 1. Read the nonce from the meta tag added by generate-nonce.js
const nonce = document.querySelector<HTMLMetaElement>(
  'meta[name="csp-nonce"]'
)?.content;

if (!nonce) {
  console.warn("CSP Nonce meta tag not found. MUI styles might be blocked.");
  // Decide if you want to proceed without a nonce or throw an error
}

// 2. Create an Emotion cache instance with the nonce
//    The key ensures that Emotion inserts styles after other head elements
const cache = createCache({
  key: "css", // Default key, you can customize if needed
  nonce: nonce, // Pass the nonce here
});
// --- End CSP Nonce Handling ---

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    // 3. Wrap the App with CacheProvider
    <CacheProvider value={cache}>
      <App />
    </CacheProvider>
  );
} else {
  console.error("Failed to find the root element");
}
