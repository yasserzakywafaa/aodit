import { defineConfig, loadEnv } from "vite";

import fs from "node:fs";
import path from "path";
import prerender from "vite-plugin-prerender";
import react from "@vitejs/plugin-react";

/**
 * vite-plugin-prerender depends on puppeteer@1.x; we override it to puppeteer-core@24
 * (package.json resolutions) so Node 22+ can drive Chrome over CDP.
 *
 * - **Linux** (CI, Docker, most prod build agents): `@sparticuz/chromium` — same as before.
 * - **macOS / Windows** (local dev): @sparticuz/chromium ships a **Linux** Chromium; on Mac
 *   yields `ENOEXEC`. Use an installed **Google Chrome / Chromium** instead (same engine family).
 */
function resolveLocalChromeExecutable(): string {
  const fromEnv = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (fromEnv && fs.existsSync(fromEnv)) {
    return fromEnv;
  }

  const candidates: string[] = [];
  if (process.platform === "darwin") {
    candidates.push(
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    );
  } else if (process.platform === "win32") {
    const pf = process.env.PROGRAMFILES ?? "C:\\Program Files";
    const pf86 = process.env["PROGRAMFILES(X86)"] ?? "C:\\Program Files (x86)";
    candidates.push(
      `${pf}\\Google\\Chrome\\Application\\chrome.exe`,
      `${pf86}\\Google\\Chrome\\Application\\chrome.exe`,
    );
  }

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  throw new Error(
    `[prerender] No Chrome/Chromium found for ${process.platform}. Install Google Chrome or set PUPPETEER_EXECUTABLE_PATH. Checked: ${candidates.join(", ")}`,
  );
}

async function getPuppeteerOptions(): Promise<Record<string, unknown>> {
  const puppeteer = await import("puppeteer-core");
  const extraArgs = ["--disable-dev-shm-usage"];

  if (process.platform === "linux") {
    const { default: chromium } = await import("@sparticuz/chromium");
    const executablePath = await chromium.executablePath();
    const launchArgs = puppeteer.defaultArgs({
      args: [...chromium.args, ...extraArgs],
      headless: "shell",
    });
    return {
      executablePath,
      args: launchArgs,
      headless: "shell",
    };
  }

  const executablePath = resolveLocalChromeExecutable();
  const launchArgs = puppeteer.defaultArgs({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      ...extraArgs,
    ],
    headless: "shell",
  });

  return {
    executablePath,
    args: launchArgs,
    headless: "shell",
  };
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
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
    envPrefix: "REACT_APP_",
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src"),
      },
    },
  };
});
