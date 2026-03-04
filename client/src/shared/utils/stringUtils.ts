/**
 * Get available space size
 */
export const getAvailableSpace = (element: Element) => {
  const style = window.getComputedStyle(element, null),
    calc = (property: string) =>
      style
        .getPropertyValue(property)
        .split(/\D+/g)
        .map((num) => Number(num));

  const [pt, pr, pb, pl] = calc("padding"),
    [height] = calc("height"),
    [width] = calc("width");

  return {
    width: width - (pl + pr) * 2,
    height: height - pt - pb,
  };
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
 * Get query params
 */
export const getQueryParams = (params: string) => {
  return String(params)
    .split(/\?|&/g)
    .filter((str) => str)
    .map((str) => {
      const [key, value] = str.split("=");
      return { [key]: value };
    })
    .reduce((p, n) => ({ ...p, ...n }), {});
};

/**
 * Replace spaces in a string with dash
 */
export const replaceSpaceWithDash = (string: string) => {
  // return string.split(" ").join("-").toLowerCase();
  return string.split(" ").join("-");
};

/**
 * Replace spaces in a string with underscore
 */
export const replaceSpaceWithUnderscore = (string: string) => {
  // return string.split(" ").join("-").toLowerCase();
  return string.split(" ").join("_");
};

/**
 * Convert bytes into Megabytes
 */
export const convertToMB = (bytes: number) => (bytes / 1000000).toFixed(0);

/**
 * Converting <a> tags into [text](url) format
 */
export const htmlToMarkdown = (html: string) => {
  return html.replace(/<a href="(.*?)".*?>(.*?)<\/a>/gi, "[$2]($1)");
};
/**
 * Detect if content is HTML or Markdown format
 */
export const detectContentFormat = (content: string): "html" | "markdown" => {
  if (!content || typeof content !== "string") {
    return "markdown"; // Default to markdown for empty/null content
  }

  // Check for HTML tags - if content contains HTML tags, it's HTML
  const htmlTagRegex = /<[^>]*>/;
  const hasHtmlTags = htmlTagRegex.test(content);

  // Check for common HTML elements that are unlikely to be in markdown
  const htmlElements = [
    /<div[^>]*>/i,
    /<span[^>]*>/i,
    /<p[^>]*>/i,
    /<h[1-6][^>]*>/i,
    /<ul[^>]*>/i,
    /<ol[^>]*>/i,
    /<li[^>]*>/i,
    /<strong[^>]*>/i,
    /<em[^>]*>/i,
    /<b[^>]*>/i,
    /<i[^>]*>/i,
    /<a[^>]*>/i,
    /<img[^>]*>/i,
    /<br[^>]*>/i,
    /<hr[^>]*>/i,
    /<blockquote[^>]*>/i,
    /<code[^>]*>/i,
    /<pre[^>]*>/i,
    /<table[^>]*>/i,
    /<tr[^>]*>/i,
    /<td[^>]*>/i,
    /<th[^>]*>/i,
  ];

  const hasHtmlElements = htmlElements.some((regex) => regex.test(content));

  // If content has HTML tags or HTML elements, it's HTML
  if (hasHtmlTags || hasHtmlElements) {
    return "html";
  }

  // Check for markdown patterns
  const markdownPatterns = [
    /^#{1,6}\s/, // Headers
    /\*\*.*?\*\*/, // Bold
    /\*.*?\*/, // Italic
    /\[.*?\]\(.*?\)/, // Links
    /!\[.*?\]\(.*?\)/, // Images
    /^[-*+]\s/, // Unordered lists
    /^\d+\.\s/, // Ordered lists
    /^>\s/, // Blockquotes
    /`.*?`/, // Inline code
    /^```/, // Code blocks
    /^\|.*\|$/, // Tables
  ];

  const hasMarkdownPatterns = markdownPatterns.some((regex) =>
    regex.test(content)
  );

  // If content has markdown patterns and no HTML, it's markdown
  if (hasMarkdownPatterns && !hasHtmlTags) {
    return "markdown";
  }

  // Default to markdown for backward compatibility
  return "markdown";
};

// Smart keyword parsing functions
export const detectInputFormat = (input: string): string => {
  if (input.includes("\n")) return "line-separated";
  if (input.includes(";") || input.includes("|")) return "mixed-separators";
  if (input.includes("•") || input.includes("-") || input.includes("*"))
    return "bullet-list";
  if (/^\d+\.\s/.test(input.trim())) return "numbered-list";
  return "comma-separated";
};

export const parseKeywords = (input: string): string[] => {
  const format = detectInputFormat(input);

  let keywords: string[] = [];

  switch (format) {
    case "line-separated":
      keywords = input.split("\n");
      break;
    case "mixed-separators":
      keywords = input.split(/[,;|]+/);
      break;
    case "bullet-list":
      keywords = input.split(/[•\-\*]+/);
      break;
    case "numbered-list":
      keywords = input.split(/\n/).map((line) => line.replace(/^\d+\.\s*/, ""));
      break;
    case "comma-separated":
    default:
      keywords = input.split(",");
      break;
  }

  // Clean keywords: trim, filter empty, remove duplicates
  return keywords
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0)
    .filter((keyword, index, arr) => arr.indexOf(keyword) === index);
};

/**
 * Parse URLs from input string
 * Only splits on commas and newlines (preserves dashes in URLs)
 */
export const parseUrls = (input: string): string[] => {
  // Split by newlines first, then by commas
  // This handles both comma-separated and line-separated URLs
  const urls = input
    .split(/\n|,/)
    .map((url) => url.trim())
    .filter((url) => url.length > 0)
    .filter((url, index, arr) => arr.indexOf(url) === index); // Remove duplicates

  return urls;
};

/**
 * Line-based parsing for pain points and benefits
 * Preserves sentences with internal punctuation (commas, hyphens, etc.)
 */
export const parsePainPointsAndBenefits = (input: string): string[] => {
  // Split by newlines and clean up
  return input
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .filter((item, index, arr) => arr.indexOf(item) === index); // Remove duplicates
};

export const maskString = (string: string, maskLength = 4) => {
  return "********" + string.substring(string.length - maskLength);
};

/**
 * Fix HTML links by adding https:// protocol if missing
 * This ensures URLs like "www.example.com" become "https://www.example.com"
 */
export const fixHtmlLinks = (html: string): string => {
  if (!html || typeof html !== "string") return html;

  // Regex to find <a> tags with href attributes
  return html.replace(
    /<a\s+([^>]*\s+)?href=["']([^"']+)["']([^>]*)>/gi,
    (match, before, url, after) => {
      // Skip if URL already has a protocol or is a relative path
      if (
        url.startsWith("http://") ||
        url.startsWith("https://") ||
        url.startsWith("mailto:") ||
        url.startsWith("tel:") ||
        url.startsWith("#") ||
        url.startsWith("/")
      ) {
        return match;
      }

      // Add https:// to URLs that look like domains (contain a dot and no slashes at start)
      if (url.includes(".") && !url.startsWith("/")) {
        const fixedUrl = `https://${url}`;
        return `<a ${before || ""}href="${fixedUrl}"${after || ""}>`;
      }

      return match;
    }
  );
};
