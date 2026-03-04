import { getAbsoluteUrl } from "./schemaGenerators";

/**
 * Create ContactPage schema
 * Note: ContactPage is not a Google Rich Result type, but it provides structured data for SEO
 */
export const createContactPageSchema = (): object => {
  const contactUrl = getAbsoluteUrl("/contact");

  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Us",
    description:
      "Get in touch with Metriz team. We're here to help you with any questions about our AI-powered project creation platform.",
    url: contactUrl,
    mainEntity: {
      "@type": "Organization",
      name: "Metriz",
      url: getAbsoluteUrl(""),
    },
  };
};
