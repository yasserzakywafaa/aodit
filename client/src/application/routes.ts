import { getPrerenderPaths } from "@yasserzakywafaa/client-core/web/i18n";

import {
  LANDING_PAGES,
  landingPagesRoutes,
} from "./shared/landingPages";

/** Strip leading slashes for locale route segments and prerender lists. */
export const toPublicSegment = (pathOrSegment: string): string =>
  pathOrSegment.replace(/^\/+|\/+$/g, "");

const landingPageSegments = LANDING_PAGES.map((page) =>
  toPublicSegment(page.slug),
);

/**
 * Public marketing pages as URL segments (no locale, no leading slash).
 * Build navigable paths with localizedPath()/useLocalizedPath().
 */
const publicPages = {
  features: "",
  industries: "industries",
  demo: "demo",
  methodology: "ai-agent-testing-methodology",
  security: "security-on-premise-ai",
  about: "about-swissli",
  pricing: "pricing",
  contact: "contact",
  privacyPolicy: "privacy-policy",
  termsAndConditions: "terms-and-conditions",
  dataProcessingAgreement: "data-processing-agreement",
} as const;

const complianceSegments = {
  finma: "compliance/finma-ai-guidance-switzerland",
  euAiAct: "compliance/eu-ai-act-europe",
} as const;

export type PublicPageSegment =
  | (typeof publicPages)[keyof typeof publicPages]
  | (typeof complianceSegments)[keyof typeof complianceSegments]
  | (typeof landingPageSegments)[number];

export const routes = {
  /** Root path redirects to the active locale via LocaleRedirect. */
  root: "/",
  /** Swiss marketing home (flat, not locale-prefixed). */
  featuresCh: "/ch",
  ...publicPages,
  compliance: complianceSegments,
  landingPages: landingPagesRoutes,
  auth: {
    login: "/login",
    register: "/register",
  },
  dashboard: {
    base: "/dashboard",
    user: {
      base: "/dashboard/users",
      profile: "/dashboard/profile",
      userById: (userId: string) => `/dashboard/users/${userId}`,
      userReports: (userId: string) => `/dashboard/users/${userId}/reports`,
    },
    profile: "/dashboard/profile",
    agents: {
      base: "/dashboard/agents",
      create: "/dashboard/agents/create",
      agentById: (agentId: string) => `/dashboard/agents/${agentId}`,
    },
    reports: {
      base: "/dashboard/reports",
      create: "/dashboard/reports/create",
      reportById: (reportId: string) => `/dashboard/reports/${reportId}`,
      reportLiveFeed: (reportId: string) =>
        `/dashboard/reports/${reportId}/live-feed`,
      reportsByUserId: (userId: string) =>
        `/dashboard/users/${userId}/reports/`,
    },
    billing: {
      base: "/dashboard/billing",
      paymentStatus: (sessionId: string) =>
        `/dashboard/billing/payment-status/${sessionId}`,
    },
    admin: {
      base: "/dashboard/admin",
      overview: "/dashboard/admin/overview",
      users: {
        base: "/dashboard/admin/users",
        userById: (userId: string) => `/dashboard/admin/users/${userId}`,
        userReports: (userId: string) => `/dashboard/users/${userId}/reports`,
      },
      agents: {
        base: "/dashboard/admin/agents",
      },
      reports: {
        base: "/dashboard/admin/reports",
        create: "/dashboard/admin/reports/create",
        reportById: (reportId: string) =>
          `/dashboard/admin/reports/${reportId}`,
        reportsByUserId: (userId: string) =>
          `/dashboard/admin/users/${userId}/reports/`,
      },
      demos: {
        base: "/dashboard/admin/demos",
        demoById: (demoId: string) => `/dashboard/admin/demos/${demoId}`,
      },
    },
  },
};

export const ALL_PUBLIC_SEGMENTS: PublicPageSegment[] = [
  ...Object.values(publicPages),
  ...Object.values(complianceSegments),
  ...landingPageSegments,
];

/** Indexed in sitemap + hreflang (excludes legal/DPA). */
export const INDEXABLE_SEGMENTS: PublicPageSegment[] = [
  routes.features,
  routes.industries,
  routes.demo,
  routes.methodology,
  routes.security,
  routes.about,
  routes.pricing,
  routes.compliance.finma,
  routes.compliance.euAiAct,
  routes.contact,
  ...landingPageSegments,
];

const localePrerenderPaths = getPrerenderPaths(ALL_PUBLIC_SEGMENTS);
const localeSitemapPaths = getPrerenderPaths(INDEXABLE_SEGMENTS);

/** Prerender locale marketing pages + flat Swiss home once. */
export const prerenderPaths: string[] = [
  ...localePrerenderPaths,
  routes.featuresCh,
];

/** Sitemap URLs (locale indexable + flat /ch). */
export const sitemapPaths: string[] = [
  ...localeSitemapPaths,
  routes.featuresCh,
];
