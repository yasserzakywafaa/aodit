import CONFIG from "../config";

/**
 * Replace spaces in a string with dash
 */
export const replaceSpaceWithDash = (string: string) => {
  return string.split(" ").join("-");
};

/**
 * Create a slug from a text
 */
export const getSlugFromText = (text: string) => {
  let slug: string = "";
  const latinChars = /[A-Za-z]/;
  const nonLatinChars = /[^A-Za-z\s]/;

  // Check if text contains both Latin and non-Latin characters
  const hasLatinChars = latinChars.test(text);
  const hasNonLatinChars = nonLatinChars.test(text);

  if (hasLatinChars && hasNonLatinChars) {
    // For mixed language text, create a hybrid approach
    // Keep Latin parts as-is, transliterate non-Latin parts
    slug = text.trim().toLowerCase();

    // Replace accents and diacritics in Latin parts
    slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Replace spaces and punctuation with hyphens
    slug = slug
      .replace(
        /[^a-z0-9\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g,
        "-"
      ) // Keep Arabic Unicode ranges
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

    return slug;
  } else if (hasLatinChars) {
    // For Latin-based languages, do full slugification
    slug = text.trim().toLowerCase();

    // Replace accents and diacritics
    slug = slug.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Replace all non-alphanumeric characters with hyphens and clean up
    slug = slug
      .replace(/[^a-z0-9]+/g, "-") // Replace any sequence of non-alphanumeric chars with a single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

    return slug;
  } else if (hasNonLatinChars) {
    // For non-Latin languages, preserve the text structure but make it URL-friendly
    slug = text.trim().toLowerCase();

    // Replace spaces and punctuation with hyphens, but preserve the original characters
    slug = slug
      .replace(/[\s\u200B\u200C\u200D\uFEFF]+/g, "-") // Replace various types of spaces with hyphens
      .replace(
        /[^\w\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF-]/g,
        ""
      ) // Remove punctuation but keep Arabic characters
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

    return slug;
  }

  return slug;
};

/**
 * Generate random string
 */
export const getRandomString = (length = 8, prefix = "") => {
  let str = "";

  while (str.length <= length) {
    const [character] = Math.random().toString(36).substr(2),
      isTrue = Math.floor(Math.random() * 2) === 0;

    str += character[isTrue ? "toLowerCase" : "toUpperCase"]();
  }

  return `${prefix}_${str}`;
};

/**
 * Helper function to append docs link to messages
 */
export const appendDocsLink = (message: string): string => {
  return `${message} See documentation for details: ${CONFIG.APP_DOCS_LINK}`;
};

export const maskString = (string: string, maskLength = 4) => {
  return "********" + string.substring(string.length - maskLength);
};

/**
 * Cleans markdown formatting from text
 * Removes: ** (bold), * (italic), quotes, code blocks, headers, and other markdown artifacts
 * @param text - The text to clean
 * @param options - Optional configuration
 * @param options.removeCodeBlocks - Whether to remove markdown code blocks (```). Default: true
 * @param options.normalizeWhitespace - Whether to normalize multi-line whitespace. Default: false
 */
export const cleanMarkdownFromText = (
  text: string,
  options: { removeCodeBlocks?: boolean; normalizeWhitespace?: boolean } = {}
): string => {
  if (!text) return "";

  const { removeCodeBlocks = true, normalizeWhitespace = false } = options;

  let cleaned = text.trim();

  // Remove quotes at the beginning and end
  cleaned = cleaned.replace(/^["']+|["']+$/g, "");

  // Remove markdown code blocks if enabled
  if (removeCodeBlocks) {
    // Step 1: Remove markdown code blocks at the start
    cleaned = cleaned.replace(
      /^```(?:html|HTML|json|JSON|xml|XML)?\s*\n?/i,
      ""
    );

    // Step 2: Remove markdown code blocks at the end
    cleaned = cleaned.replace(/\n?\s*```$/i, "");

    // Step 3: Remove any remaining markdown code block markers anywhere in content
    cleaned = cleaned.replace(/```(?:html|HTML|json|JSON|xml|XML)?/gi, "");

    // Step 4: Remove backwards patterns like "html```" or "json```"
    cleaned = cleaned.replace(/(?:html|json|xml)\s*```/gi, "");
    cleaned = cleaned.replace(/```\s*(?:html|json|xml)/gi, "");

    // Step 5: Remove standalone backticks that might remain
    cleaned = cleaned.replace(/^`+|`+$/gm, "");

    // Step 6: Remove lines that are just backticks or markdown artifacts
    const lines = cleaned.split("\n");
    cleaned = lines
      .map((line) => {
        const trimmed = line.trim();
        if (trimmed === "`" || trimmed === "```" || trimmed.match(/^```/)) {
          return "";
        }
        return line;
      })
      .filter((line) => line !== "")
      .join("\n");
  } else {
    // If not removing code blocks, just remove inline backticks
    cleaned = cleaned.replace(/`/g, "");
  }

  // Remove markdown bold markers (**text** or **text)
  cleaned = cleaned.replace(/\*\*/g, "");

  // Remove markdown italic markers (*text*) - only if it's clearly formatting
  // Pattern: *text* where text doesn't contain asterisks
  cleaned = cleaned.replace(/\*([^*]+?)\*/g, "$1");

  // Remove any remaining standalone asterisks at the start or end
  cleaned = cleaned.replace(/^\*+|\*+$/g, "");

  // Remove markdown headers (#)
  cleaned = cleaned.replace(/^#+\s*/g, "");

  // Normalize whitespace if enabled (for multi-line content)
  if (normalizeWhitespace) {
    // Normalize excessive newlines
    cleaned = cleaned.replace(/\n{2,}/g, "\n");

    // Remove trailing whitespace from each line
    cleaned = cleaned
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n");
  }

  // Final trim
  cleaned = cleaned.trim();

  return cleaned;
};
