import { Testimonial } from "src/shared/types/types";
import { createPersonSchema } from "./schemaHelpers";

export type ReviewData = Testimonial;

/**
 * Create a Review schema for a single review/testimonial
 */
export const createReviewSchema = (
  review: ReviewData,
  itemReviewed?: {
    "@type": string;
    name: string;
    url?: string;
  }
): object => {
  const reviewSchema: any = {
    "@context": "https://schema.org",
    "@type": "Review",
    author: createPersonSchema(review.author),
    reviewBody: review.reviewBody,
  };

  if (review.rating !== undefined && review.rating !== null) {
    reviewSchema.reviewRating = {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (review.datePublished) {
    reviewSchema.datePublished =
      typeof review.datePublished === "string"
        ? new Date(review.datePublished).toISOString()
        : review.datePublished.toISOString();
  }

  if (itemReviewed) {
    reviewSchema.itemReviewed = itemReviewed;
  }

  return reviewSchema;
};

/**
 * Create AggregateRating schema
 */
export const createAggregateRatingSchema = (
  ratingValue: number,
  reviewCount: number,
  bestRating: number = 5,
  worstRating: number = 1
): object => {
  return {
    "@type": "AggregateRating",
    ratingValue: ratingValue.toString(),
    reviewCount: reviewCount.toString(),
    bestRating: bestRating.toString(),
    worstRating: worstRating.toString(),
  };
};

/**
 * Create multiple Review schemas from an array of reviews
 */
export const createReviewListSchema = (
  reviews: ReviewData[],
  itemReviewed?: {
    "@type": string;
    name: string;
    url?: string;
  }
): object[] => {
  return reviews.map((review) => createReviewSchema(review, itemReviewed));
};

/**
 * Create a single schema containing all reviews (for use with multiple schema injection)
 */
export const createReviewCollectionSchema = (
  reviews: ReviewData[],
  itemReviewed?: {
    "@type": string;
    name: string;
    url?: string;
  }
): object => {
  const reviewSchemas = reviews.map((review) =>
    createReviewSchema(review, itemReviewed)
  );

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: reviewSchemas.map((review, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: review,
    })),
  };
};
