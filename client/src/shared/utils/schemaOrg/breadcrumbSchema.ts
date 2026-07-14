import { getAbsoluteUrl } from "./schemaHelpers";

interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Create BreadcrumbList schema for navigation
 */
export const createBreadcrumbSchema = (items: BreadcrumbItem[]): object => {
  const itemListElement = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: getAbsoluteUrl(item.url),
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };
};

