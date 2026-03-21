import "./FeaturesPage.scss";

import {
  FAQItem,
  createFAQPageSchema,
  createOrganizationSchemaForSite,
  createSoftwareApplicationSchema,
  useSchemaOrg,
} from "src/shared/utils/schemaOrg";

import AboutSection from "./features/AboutSection";
import ContactSection from "./features/ContactSection";
import DownloadReportSection from "./features/DownloadReportSection";
import Hero from "./features/Hero";
import MethodologySection from "./features/MethodologySection";
import Page from "src/components/shared/Page/Page";
import ReportsSection from "./features/ReportsSection";
import SubscribeSection from "./features/SubscribeSection";
import { Testimonial } from "src/shared/types/types";
import { routes } from "src/application/routes";
import { testimonials } from "src/shared/mockedData/Testimonials";
import { useApplicationContext } from "src/application/store/Provider";
import { useMemo } from "react";

const FeaturesPage = () => {
  const {
    store: {
      state: { isFetching },
    },
  } = useApplicationContext();

  // Testimonials data for reviews
  const testimonialsData: Testimonial[] = useMemo(() => testimonials, []);

  // Calculate aggregate rating (all testimonials are 5 stars)
  const aggregateRating = useMemo(() => {
    const totalReviews = testimonialsData.length;
    const averageRating =
      testimonialsData.reduce(
        (acc, testimonial) => acc + testimonial.rating,
        0,
      ) / totalReviews;
    return {
      ratingValue: averageRating,
      reviewCount: totalReviews,
    };
  }, [testimonialsData]);

  // Generate Organization and SoftwareApplication schemas with ratings and reviews
  const organizationSchema = useMemo(
    () => createOrganizationSchemaForSite(aggregateRating),
    [aggregateRating],
  );
  const softwareApplicationSchema = useMemo(
    () => createSoftwareApplicationSchema(aggregateRating, testimonials),
    [aggregateRating, testimonials],
  );

  // FAQ data for schema
  const faqData: FAQItem[] = useMemo(
    () => [
      {
        question: "What is aodit.ai?",
        answer:
          "Aodit is a smart tendering and BOQ (Bill of Quantity) management tool for marketing agencies.",
      },
    ],
    [],
  );

  // Generate FAQ schema
  const faqSchema = useMemo(() => {
    return createFAQPageSchema(faqData, routes.features);
  }, [faqData]);

  // Inject Schema.org structured data
  useSchemaOrg(organizationSchema, "organization-schema");
  useSchemaOrg(softwareApplicationSchema, "software-application-schema");
  useSchemaOrg(faqSchema, "faq-page-schema");

  return (
    <Page
      title="Aodit — AI-Powered Agent Risk Index"
      className="features-page"
      isLoading={isFetching}
    >
      <Hero />
      <SubscribeSection variant="compact" />
      <DownloadReportSection />
      <ReportsSection />
      <MethodologySection />
      <AboutSection />
      <SubscribeSection />
      <ContactSection />
    </Page>
  );
};

export default FeaturesPage;
