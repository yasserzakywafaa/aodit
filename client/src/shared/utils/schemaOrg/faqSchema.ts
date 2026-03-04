import { getAbsoluteUrl } from "./schemaGenerators";

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Create FAQPage schema with Question and Answer pairs
 */
export const createFAQPageSchema = (faqs: FAQItem[], url?: string): object => {
  const mainEntity = faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
    ...(url && { url: getAbsoluteUrl(url) }),
  };
};
