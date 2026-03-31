import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import prerender from "vite-plugin-prerender";
import path from "path";

// Vercel (and most CI providers) set CI=true. Use @sparticuz/chromium there
// because the build container lacks the system libs (libnss3 etc.) that
// Puppeteer's bundled Chromium requires. @sparticuz/chromium bundles its own.
const isCI = Boolean(process.env.CI);

async function getPuppeteerOptions(): Promise<Record<string, unknown>> {
  const baseArgs = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
  ];

  if (isCI) {
    const { default: chromium } = await import("@sparticuz/chromium");
    return {
      executablePath: await chromium.executablePath(),
      args: [...chromium.args, ...baseArgs],
      headless: true,
    };
  }

  return { args: baseArgs };
}

// https://vitejs.dev/config/
export default defineConfig(async () => {
  const puppeteerOptions = await getPuppeteerOptions();

  return {
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
          ...puppeteerOptions,
        }),
      }),
    ],
    build: {
      outDir: "build",
    },
    // Expose REACT_APP_* env vars to client code (mirrors CRA behaviour)
    envPrefix: "REACT_APP_",
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src"),
      },
    },
  };
});
