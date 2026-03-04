import { getAbsoluteUrl } from "./schemaGenerators";

/**
 * Create WebPage schema for general pages
 */
export const createWebPageSchema = (
  name: string,
  description: string,
  url: string,
  datePublished?: Date | string,
): object => {
  const page: any = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url: getAbsoluteUrl(url),
    mainEntity: {
      "@type": "WebPage",
      "@id": getAbsoluteUrl(url),
    },
  };

  if (datePublished) {
    page.datePublished =
      typeof datePublished === "string"
        ? new Date(datePublished).toISOString()
        : datePublished.toISOString();
  }

  return page;
};

/**
 * Create Service schema for service pages (like Create Project)
 */
export const createServiceSchema = (
  name: string,
  description: string,
  url: string,
  serviceType?: string,
  provider?: string,
): object => {
  const service: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: getAbsoluteUrl(url),
    provider: {
      "@type": "Organization",
      name: provider || "Metriz",
      url: getAbsoluteUrl(""),
    },
  };

  if (serviceType) {
    service.serviceType = serviceType;
  }

  return service;
};
