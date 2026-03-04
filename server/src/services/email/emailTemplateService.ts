import * as Handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";

import { BaseEmailData } from "./types";
import CONFIG from "../../config";

// Logo URL constant
export const LOGO_URL =
  "https://s3.eu-west-2.amazonaws.com/aodit.ai/logo/aodit_logo.webp";

// Template cache
const templateCache: Map<string, HandlebarsTemplateDelegate> = new Map();
let partialsRegistered = false;

/**
 * Get the absolute path to email templates directory
 */
const getTemplatesDir = (): string => {
  return path.join(__dirname, "templates");
};

/**
 * Get the absolute path to partials directory
 */
const getPartialsDir = (): string => {
  return path.join(__dirname, "templates", "partials");
};

/**
 * Register Handlebars partials
 */
const registerPartials = (): void => {
  if (partialsRegistered) return;

  const partialsDir = getPartialsDir();

  if (fs.existsSync(partialsDir)) {
    const partialFiles = fs.readdirSync(partialsDir);

    partialFiles.forEach((file) => {
      if (file.endsWith(".hbs")) {
        const partialName = path.basename(file, ".hbs");
        const partialPath = path.join(partialsDir, file);
        const partialContent = fs.readFileSync(partialPath, "utf-8");
        Handlebars.registerPartial(partialName, partialContent);
      }
    });
  }

  partialsRegistered = true;
};

/**
 * Register Handlebars helpers
 */
const registerHelpers = (): void => {
  // Logo URL helper
  Handlebars.registerHelper("logoUrl", () => {
    return LOGO_URL;
  });

  // App URL helper
  Handlebars.registerHelper("appUrl", () => {
    return CONFIG.APP_URL;
  });

  // Format date helper
  Handlebars.registerHelper("formatDate", (date: Date | string) => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Uppercase helper
  Handlebars.registerHelper("uppercase", (str: string) => {
    return typeof str === "string" ? str.toUpperCase() : str;
  });

  // Equality helper
  Handlebars.registerHelper("eq", (a: any, b: any) => {
    return a === b;
  });
};

// Register helpers and partials on module load
registerHelpers();
registerPartials();

/**
 * Compile and cache a Handlebars template
 */
const compileTemplate = (templateName: string): HandlebarsTemplateDelegate => {
  // Ensure partials are registered
  registerPartials();

  // Check cache first
  if (templateCache.has(templateName)) {
    return templateCache.get(templateName)!;
  }

  // Read template file
  const templatePath = path.join(getTemplatesDir(), `${templateName}.hbs`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Email template not found: ${templateName}.hbs`);
  }

  const templateContent = fs.readFileSync(templatePath, "utf-8");
  const compiledTemplate = Handlebars.compile(templateContent);

  // Cache the compiled template
  templateCache.set(templateName, compiledTemplate);

  return compiledTemplate;
};

/**
 * Render an email template with the provided data
 */
export const renderEmailTemplate = <T extends BaseEmailData>(
  templateName: string,
  data: T,
): string => {
  try {
    const template = compileTemplate(templateName);

    // Ensure appUrl is always set and add current year for footer
    const currentYear = new Date().getFullYear();
    const templateData = {
      ...data,
      appUrl: data.appUrl || CONFIG.APP_URL,
      docsUrl: data.docsUrl || CONFIG.APP_DOCS_LINK,
      logoUrl: LOGO_URL,
      currentYear: currentYear,
    };

    return template(templateData);
  } catch (error: any) {
    throw new Error(
      `Failed to render email template ${templateName}: ${error.message}`,
    );
  }
};

/**
 * Get the logo URL
 */
export const getLogoUrl = (): string => {
  return LOGO_URL;
};
