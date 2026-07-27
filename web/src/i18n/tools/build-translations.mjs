#!/usr/bin/env node
/**
 * Builds ar/de/fr locale files from en source + translation overrides.
 * Run: node web/src/i18n/tools/build-translations.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = path.join(__dirname, "../locales");
const OVERRIDES_DIR = path.join(__dirname, "overrides");
const NAMESPACES = [
  "common",
  "auth",
  "dashboard",
  "page",
  "report",
  "agent",
  "compliance",
  "demo",
];
const TARGET_LANGS = ["ar", "de", "fr"];

function deepMerge(base, override) {
  if (override === undefined || override === null) return base;
  if (Array.isArray(override)) return override;
  if (typeof override !== "object" || typeof base !== "object" || Array.isArray(base)) {
    return override;
  }
  const out = { ...base };
  for (const key of Object.keys(override)) {
    out[key] = deepMerge(base[key], override[key]);
  }
  return out;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

for (const lang of TARGET_LANGS) {
  for (const ns of NAMESPACES) {
    const enPath = path.join(LOCALES_DIR, "en", `${ns}.json`);
    const overridePath = path.join(OVERRIDES_DIR, lang, `${ns}.json`);
    const outPath = path.join(LOCALES_DIR, lang, `${ns}.json`);

    if (!fs.existsSync(enPath)) {
      console.warn(`Skip missing en: ${ns}`);
      continue;
    }

    const en = readJson(enPath);
    if (!fs.existsSync(overridePath)) {
      console.warn(`No override for ${lang}/${ns}, skipping`);
      continue;
    }

    const override = readJson(overridePath);
    const merged = deepMerge(en, override);
    writeJson(outPath, merged);
    console.log(`Wrote ${lang}/${ns}.json`);
  }
}

console.log("Done.");
