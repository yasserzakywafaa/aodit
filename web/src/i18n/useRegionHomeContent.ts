import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import type { HeroContent } from "src/Pages/Features/features/Hero";
import type {
  LandingPageCtaCopy,
  LandingPageTrustBlockCopy,
} from "src/application/shared/landingPages";
import type { Region } from "src/application/shared/regionContent";

export interface TranslatedHomePageContent {
  pageTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  hero: HeroContent;
  trustBlock: LandingPageTrustBlockCopy;
  cta: LandingPageCtaCopy;
  schemaName: string;
  schemaDescription: string;
  websiteSchemaDescription: string;
  regulatorySectionTitle: string;
  regulatorySectionBody1: string;
  regulatorySectionBody2: string;
  regulatorySectionBody3: string;
}

export interface TranslatedFeaturedReportCopy {
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  reportOfInterest: string;
  message: string;
}

const homeKey = (region: Region, suffix: string) =>
  `home.${region}.${suffix}`;

/** Translated HOME_CONTENT strings for Features pages (page.home.{region}.*). */
export const useRegionHomeContent = (
  region: Region,
): TranslatedHomePageContent => {
  const { t } = useTranslation("page");

  return useMemo(
    () => ({
      pageTitle: t(homeKey(region, "pageTitle")),
      metaDescription: t(homeKey(region, "metaDescription")),
      ogTitle: t(homeKey(region, "ogTitle")),
      ogDescription: t(homeKey(region, "ogDescription")),
      hero: {
        titleLead: t(homeKey(region, "hero.titleLead")),
        titleHighlight: t(homeKey(region, "hero.titleHighlight")),
        subtitleLine1: t(homeKey(region, "hero.subtitleLine1")),
        subtitleLine2: t(homeKey(region, "hero.subtitleLine2")),
        bullets: t(homeKey(region, "hero.bullets"), {
          returnObjects: true,
        }) as string[],
      },
      trustBlock: {
        title: t(homeKey(region, "trustBlock.title")),
        line1: t(homeKey(region, "trustBlock.line1")),
        line2: t(homeKey(region, "trustBlock.line2")),
        line3: t(homeKey(region, "trustBlock.line3")),
      },
      cta: {
        title: t(homeKey(region, "cta.title")),
        subtitle: t(homeKey(region, "cta.subtitle")),
      },
      schemaName: t(homeKey(region, "schemaName")),
      schemaDescription: t(homeKey(region, "schemaDescription")),
      websiteSchemaDescription: t(homeKey(region, "websiteSchemaDescription")),
      regulatorySectionTitle: t(homeKey(region, "regulatorySectionTitle")),
      regulatorySectionBody1: t(homeKey(region, "regulatorySectionBody1")),
      regulatorySectionBody2: t(homeKey(region, "regulatorySectionBody2")),
      regulatorySectionBody3: t(homeKey(region, "regulatorySectionBody3")),
    }),
    [region, t],
  );
};

/** Translated FEATURED_REPORT_CONTENT for DownloadReportSection. */
export const useFeaturedReportContent = (
  region: Region,
): TranslatedFeaturedReportCopy => {
  const { t } = useTranslation("page");

  return useMemo(
    () => ({
      title: t(`featuredReport.${region}.title`),
      subtitle: t(`featuredReport.${region}.subtitle`),
      description: t(`featuredReport.${region}.description`),
      ctaLabel: t(`featuredReport.${region}.ctaLabel`),
      reportOfInterest: t(`featuredReport.${region}.reportOfInterest`),
      message: t(`featuredReport.${region}.message`),
    }),
    [region, t],
  );
};
