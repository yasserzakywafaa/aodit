import { defineConfig, loadEnv } from "vite";

import fs from "node:fs";
import path from "path";
import prerender from "vite-plugin-prerender";
import { prerenderPaths } from "./src/application/routes";
import react from "@vitejs/plugin-react";

/**
 * vite-plugin-prerender depends on puppeteer@1.x; we override puppeteer to
 * puppeteer-core@24 (package.json resolutions) so Node 22+ can drive Chrome over CDP.
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
  const extraArgs = ["--disable-dev-shm-usage"];

  if (process.platform === "linux") {
    const { default: chromium } = await import("@sparticuz/chromium");
    return {
      executablePath: await chromium.executablePath(),
      args: [...chromium.args, ...extraArgs],
      headless: "shell",
    };
  }

  return {
    executablePath: resolveLocalChromeExecutable(),
    args: ["--no-sandbox", "--disable-setuid-sandbox", ...extraArgs],
    headless: "shell",
  };
}

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "REACT_APP_");
  const puppeteerOptions = await getPuppeteerOptions();

  return {
    plugins: [
      react({
        jsxImportSource: "@emotion/react",
      }),
      prerender({
        staticDir: path.join(__dirname, "dist"),
        routes: prerenderPaths,
        renderer: new prerender.PuppeteerRenderer({
          viewport: { width: 1280, height: 800 },
          renderAfterTime: 5000,
          maxConcurrentRoutes: 2,
          ...puppeteerOptions,
        }),
        postProcess(renderedRoute) {
          // Puppeteer resolves URLs against the local server, baking
          // "http://localhost:<port>" into src/href attributes. Strip it
          // so the HTML uses root-relative paths that work on any host.
          renderedRoute.html = renderedRoute.html.replace(
            /http:\/\/localhost:\d+\//g,
            "/",
          );
          return renderedRoute;
        },
      }),
    ],
    optimizeDeps: {
      include: ["@emotion/styled", "@emotion/react"],
    },
    server: {
      port: Number(env.REACT_APP_PORT),
    },
    build: {
      outDir: "dist",
    },
    envPrefix: "REACT_APP_",
    resolve: {
      alias: {
        src: path.resolve(__dirname, "src"),
      },
    },
  };
});
