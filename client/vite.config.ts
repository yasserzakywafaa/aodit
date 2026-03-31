import { defineConfig, loadEnv } from "vite";

import path from "path";
import prerender from "vite-plugin-prerender";
import react from "@vitejs/plugin-react";

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
    try {
      const { default: chromium } = await import("@sparticuz/chromium");
      return {
        executablePath: await chromium.executablePath(),
        args: [...chromium.args, ...baseArgs],
        headless: true,
      };
    } catch {
      // Binary extraction failed — fall back to Puppeteer's own Chrome.
      // This will only work if the system has the required shared libs,
      // but it's better than crashing the entire build.
      console.warn(
        "[prerender] @sparticuz/chromium failed, falling back to bundled Chrome",
      );
    }
  }

  return { args: baseArgs };
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  // loadEnv reads the .env file — process.env alone doesn't have it at config time
  const env = loadEnv(mode, process.cwd(), "REACT_APP_");
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
          // Time-based rendering is more reliable than event-based in CI:
          // it doesn't depend on the app dispatching a custom event and gives
          // React, Suspense, and lazy-loaded chunks a fixed window to settle.
          renderAfterTime: 5000,
          maxConcurrentRoutes: 2,
          ...puppeteerOptions,
        }),
      }),
    ],
    server: {
      port: Number(env.REACT_APP_PORT),
    },
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
