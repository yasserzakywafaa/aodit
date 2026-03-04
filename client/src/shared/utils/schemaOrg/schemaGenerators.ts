import APP_CONSTANTS from "src/application/shared/app_constants";

/**
 * Get the base URL for the application
 */
export const getBaseUrl = (): string => {
  return APP_CONSTANTS.APP_URL || "https://www.aodit.ai";
};

/**
 * Get absolute URL from a relative path
 */
export const getAbsoluteUrl = (path: string): string => {
  const baseUrl = getBaseUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Format date to ISO 8601 string
 */
export const formatDateISO = (date: Date | string): string => {
  if (typeof date === "string") {
    return new Date(date).toISOString();
  }
  return date.toISOString();
};

/**
 * Get image URL (absolute)
 */
export const getImageUrl = (
  imagePath: string | undefined
): string | undefined => {
  if (!imagePath) return undefined;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  return getAbsoluteUrl(imagePath);
};

/**
 * Create a Person schema object
 */
export const createPersonSchema = (
  name: string,
  url?: string,
  image?: string
): object => {
  const person: any = {
    "@type": "Person",
    name,
  };

  if (url) {
    person.url = url;
  }

  if (image) {
    person.image = getImageUrl(image);
  }

  return person;
};

/**
 * Create an Organization schema object
 */
export const createOrganizationSchema = (
  name: string,
  url: string,
  logo?: string,
  sameAs?: string[]
): object => {
  const organization: any = {
    "@type": "Organization",
    name,
    url,
  };

  if (logo) {
    organization.logo = getImageUrl(logo);
  }

  if (sameAs && sameAs.length > 0) {
    organization.sameAs = sameAs;
  }

  return organization;
};
