import { getAbsoluteUrl, getImageUrl } from "./schemaHelpers";

import { Product } from "@yasserzakywafaa/client-core";
import { SubscriptionPlanEnum } from "src/shared/types/user";
import { createAggregateRatingSchema } from "./reviewSchema";
import { getCurrencyCode } from "@yasserzakywafaa/client-core";
import { routes } from "src/application/routes";
import { testimonials } from "src/shared/mockedData/Testimonials";

interface PricingPlan {
  title: SubscriptionPlanEnum;
  product?: Product;
  price?: number;
  currency?: string;
  interval?: "month" | "year";
}

/**
 * Create Product schema with Offer for a pricing plan
 */
export const createProductOfferSchema = (plan: PricingPlan): object => {
  const productName = `Aodit ${plan.title} Plan`;

  const offer: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: `Aodit ${plan.title} subscription plan`,
    category: "Software Subscription",
    image: getImageUrl("/icons/icon_512x512.png"),
    brand: {
      "@type": "Brand",
      name: "Aodit",
    },
  };

  if (plan.product) {
    offer.sku = plan.product.id;
  }

  // Calculate aggregate rating from actual testimonials
  const averageRating =
    testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) /
    testimonials.length;
  const reviewCount = testimonials.length;

  // Add aggregateRating (required for Product snippets)
  offer.aggregateRating = createAggregateRatingSchema(
    averageRating,
    reviewCount
  );

  // Add review(s) (required for Product snippets)
  // Note: Reviews nested in Product should not have @context
  offer.review = testimonials.map((review) => {
    // Create review without @context for nested use
    const reviewSchema: any = {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      reviewBody: review.reviewBody,
      itemReviewed: {
        "@type": "Product",
        name: productName,
        url: getAbsoluteUrl("/pricing"),
      },
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

    return reviewSchema;
  });

  // Convert currency symbol/code to ISO 4217 code
  const currencyCode = getCurrencyCode(plan.currency);

  // Add offer details
  if (plan.price !== undefined && plan.price !== null) {
    offer.offers = {
      "@type": "Offer",
      price: plan.price.toString(),
      priceCurrency: currencyCode,
      availability: "https://schema.org/InStock",
      url: getAbsoluteUrl("/pricing"),
      priceValidUntil: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
    };

    if (plan.interval) {
      offer.offers.priceSpecification = {
        "@type": "UnitPriceSpecification",
        price: plan.price.toString(),
        priceCurrency: currencyCode,
        billingDuration: `P1${
          plan.interval.charAt(0).toUpperCase() + plan.interval.slice(1)
        }`,
      };
    }

    // Add hasMerchantReturnPolicy (required for Merchant listings)
    // No returns for digital subscription service
    offer.offers.hasMerchantReturnPolicy = {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "CH", // Switzerland
      returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
      url: getAbsoluteUrl(routes.termsAndConditions),
    };

    // Add shippingDetails (required for Merchant listings)
    offer.offers.shippingDetails = {
      "@type": "OfferShippingDetails",
      shippingRate: {
        "@type": "MonetaryAmount",
        value: "0",
        currency: currencyCode,
      },
      shippingDestination: {
        "@type": "DefinedRegion",
        addressCountry: "CH", // Switzerland
      },
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 0,
          unitCode: "DAY",
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 0,
          unitCode: "DAY",
        },
        cutoffTime: "00:00",
        businessDays: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
      },
    };
  } else {
    // Free plan
    offer.offers = {
      "@type": "Offer",
      price: "0",
      priceCurrency: currencyCode,
      availability: "https://schema.org/InStock",
      url: getAbsoluteUrl("/pricing"),
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "CH", // Switzerland
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
        url: getAbsoluteUrl(routes.termsAndConditions),
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: currencyCode,
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "CH", // Switzerland
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY",
          },
          cutoffTime: "00:00",
          businessDays: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
          },
        },
      },
    };
  }

  return offer;
};

/**
 * Create a combined schema with all products in an ItemList
 */
export const createProductListSchema = (plans: PricingPlan[]): object => {
  const products = plans.map((plan) => createProductOfferSchema(plan));

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: product,
    })),
  };
};
