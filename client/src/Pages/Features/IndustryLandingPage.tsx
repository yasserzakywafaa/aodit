import FeaturesPage from "./FeaturesPage";
import type { LandingPageContent } from "src/application/shared/landingPages";

interface IndustryLandingPageProps {
  content: LandingPageContent;
}

/**
 * Thin wrapper around FeaturesPage that injects per-industry content.
 * All 25 industry/use-case landing pages render through this component so the
 * shared layout stays identical while copy, SEO metadata and demo defaults
 * vary per slug.
 */
const IndustryLandingPage = ({ content }: IndustryLandingPageProps) => (
  <FeaturesPage landingContent={content} />
);

export default IndustryLandingPage;
