import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import prerender from "vite-plugin-prerender";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    prerender({
      staticDir: path.join(__dirname, "build"),
      routes: [
        "/",
        "/ai-agent-testing-methodology",
        "/about-swissli",
        "/security-on-premise-ai",
        "/compliance/finma-ai-guidance-switzerland",
        "/compliance/eu-ai-act-europe",
        "/pricing",
        "/contact",
        "/privacy-policy",
        "/terms-and-conditions",
        "/data-processing-agreement",
      ],
      renderer: new prerender.PuppeteerRenderer({
        renderAfterDocumentEvent: "render-complete",
      }),
    }),
  ],
  build: {
    outDir: "build",
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
});
