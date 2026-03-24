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
    name: "Contact SwissLI AG",
    description:
      "Contact SwissLI AG for independent AI agent evaluation inquiries in regulated financial environments.",
    url: contactUrl,
    mainEntity: {
      "@type": "Organization",
      name: "Swiss Lab of Intelligence (SwissLI AG)",
      url: getAbsoluteUrl(""),
    },
  };
};
