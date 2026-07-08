import { defineConfig, loadEnv } from "vite";
import { prerenderPaths, routes } from "./src/application/routes";

import { LANDING_PAGES } from "./src/application/shared/landingPages";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "path";
import prerender from "vite-plugin-prerender";
import react from "@vitejs/plugin-react";

const require = createRequire(import.meta.url);
const { sanitizePrerenderedHtml } = require("./scripts/sanitize-prerender-html.js");

const SITEMAP_OUTPUT_PATH = path.join(__dirname, "public/sitemaps/sitemap.xml");
const SITEMAP_DEFAULT_PRIORITY = "0.7";

function normalizeRoute(route: string): string {
  if (!route.startsWith("/")) {
    return `/${route}`;
  }
  return route;
}

function hreflangLink(hreflang: string, href: string): string {
  return `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`;
}

function toSitemapUrlNode(
  baseUrl: string,
  route: string,
  lastmod: string,
  priority: string,
  extraLines: string[] = [],
): string {
  return [
    "  <url>",
    `    <loc>${baseUrl}${route}</loc>`,
    ...extraLines,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <priority>${priority}</priority>`,
    "  </url>",
  ].join("\n");
}

function writeSitemap(baseUrl: string): void {
  const nowIsoDate = new Date().toISOString();
  const staticRoutes: string[] = [
    routes.features,
    routes.featuresCh,
    routes.industries,
    routes.demo,
    routes.methodology,
    routes.security,
    routes.about,
    routes.pricing,
    routes.compliance.finma,
    routes.compliance.euAiAct,
    routes.contact,
  ];

  const industryRoutes = LANDING_PAGES.map((page) => page.slug);
  const allRoutes = Array.from(
    new Set([...staticRoutes, ...industryRoutes].map(normalizeRoute)),
  );

  const homeHreflang = [
    hreflangLink("en", `${baseUrl}${routes.features}`),
    hreflangLink("en-CH", `${baseUrl}${routes.featuresCh}`),
    hreflangLink("x-default", `${baseUrl}${routes.features}`),
  ];

  const nodes = allRoutes.map((route) => {
    const priority =
      route === routes.features || route === routes.featuresCh
        ? "1.0"
        : SITEMAP_DEFAULT_PRIORITY;
    const hreflang =
      route === routes.features || route === routes.featuresCh
        ? homeHreflang
        : [];
    return toSitemapUrlNode(baseUrl, route, nowIsoDate, priority, hreflang);
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...nodes,
    "</urlset>",
    "",
  ].join("\n");

  fs.mkdirSync(path.dirname(SITEMAP_OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(SITEMAP_OUTPUT_PATH, xml, "utf8");
}

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
    const fromEnv = process.env.PUPPETEER_EXECUTABLE_PATH;
    if (fromEnv && fs.existsSync(fromEnv)) {
      return {
        executablePath: fromEnv,
        args: ["--no-sandbox", "--disable-setuid-sandbox", ...extraArgs],
        headless: "shell",
      };
    }
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
  const sitemapBaseUrl = "https://www.aodit.ai";

  writeSitemap(sitemapBaseUrl);

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
          maxConcurrentRoutes: 1,
          skipThirdPartyRequests: true, // blocks js.stripe.com, GA, etc.
          inject: { isPrerendering: true },
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
          renderedRoute.html = sanitizePrerenderedHtml(renderedRoute.html);
          return renderedRoute;
        },
      }),
    ],
    optimizeDeps: {
      include: ["@emotion/styled", "@emotion/react", "buffer"],
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
