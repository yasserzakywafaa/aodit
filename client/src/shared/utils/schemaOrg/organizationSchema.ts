import {
  ReviewData,
  createAggregateRatingSchema,
  createReviewListSchema,
} from "./reviewSchema";
import { getAbsoluteUrl, getImageUrl } from "./schemaGenerators";

/**
 * Create Organization schema for the company
 */
export const createOrganizationSchemaForSite = (aggregateRating?: {
  ratingValue: number;
  reviewCount: number;
}): object => {
  const baseUrl = getAbsoluteUrl("");

  const organization: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Swiss Lab of Intelligence (SwissLI AG)",
    url: baseUrl,
    logo: getImageUrl("/icons/icon_512x512.png"),
    description:
      "Independent AI agent evaluation platform for financial institutions.",
    sameAs: [
      // Add social media links if available
      // "https://twitter.com/aodit",
      // "https://www.linkedin.com/company/aodit",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Sales and Security Inquiries",
      url: getAbsoluteUrl("/contact"),
    },
  };

  // Add aggregate rating if provided
  if (aggregateRating) {
    organization.aggregateRating = createAggregateRatingSchema(
      aggregateRating.ratingValue,
      aggregateRating.reviewCount,
    );
  }

  return organization;
};

/**
 * Create SoftwareApplication schema for the Aodit platform
 */
export const createSoftwareApplicationSchema = (
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  },
  reviews?: ReviewData[],
): object => {
  const baseUrl = getAbsoluteUrl("");

  const application: any = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AODIT",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    description:
      "Independent AI agent evaluation platform for banks and financial institutions.",
    url: baseUrl,
    screenshot: getImageUrl("/icons/icon_512x512.png"),
  };

  // Add aggregate rating (use provided or default)
  if (aggregateRating) {
    application.aggregateRating = createAggregateRatingSchema(
      aggregateRating.ratingValue,
      aggregateRating.reviewCount,
    );
  } else {
    // Default rating if not provided
    application.aggregateRating = createAggregateRatingSchema(4.5, 8);
  }

  // Add reviews if provided
  if (reviews && reviews.length > 0) {
    application.review = createReviewListSchema(reviews);
  }

  return application;
};
