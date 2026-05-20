import type { HeroContent } from "src/Pages/Features/features/Hero";
import type {
  LandingPageCtaCopy,
  LandingPageTrustBlockCopy,
} from "src/application/shared/landingPages";
import { routes } from "src/application/routes";

export type Region = "global" | "swiss";

export type RegionOverride = "ch" | "global";

export const REGION_COOKIE_NAME = "aodit-region";

export const DEFAULT_TRUST_BLOCK_COPY: LandingPageTrustBlockCopy = {
  title: "Data boundaries you can defend",
  line1:
    "can be deployed in controlled environments and does not require SwissLI AG to access your client data by default.",
  line2:
    "AI agent prompts, outputs, and evaluation artifacts remain under your governance and access controls.",
  line3:
    "Built to support security, risk, and compliance teams across regulated and non-regulated industries.",
};

export interface HomePageContent {
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
  canonicalPath: string;
}

export const HOME_CONTENT: Record<Region, HomePageContent> = {
  swiss: {
    pageTitle:
      "AI Agent Evaluation for Fintech & Insurers (FINMA & EU AI Act Ready) | aodit",
    metaDescription:
      "Independent AI agent evaluation for fintechs and insurers in Switzerland. On-premise deployment, FINMA-aligned evidence, and no client data access by default.",
    ogTitle: "AI Agent Evaluation for Fintechs and Insurers | aodit",
    ogDescription:
      "Independent AI agent evaluation for regulated fintechs and insurers. On-premise by design and built for FINMA-aligned environments.",
    hero: {
      titleLead: "How Does Your AI Agent Behave Under",
      titleHighlight: "Pressure?",
      subtitleLine1: "We break your AI Agent",
      subtitleLine2: "before Regulators do",
      bullets: [
        "Independent behavioral stress-testing with clear risk evidence",
        "Adversarial scenarios mapped to real business workflows",
        "Actionable findings for product, risk, and compliance teams",
      ],
    },
    trustBlock: DEFAULT_TRUST_BLOCK_COPY,
    cta: {
      title: "We break your AI before regulators do.",
      subtitle: "Independent evaluation delivered in 2–3 weeks. Fully on-premise.",
    },
    schemaName: "AI Agent Evaluation for Fintech & Insurers",
    schemaDescription:
      "Independent AI agent evaluation for fintechs and insurance companies with on-premise deployment and no client data access by default.",
    websiteSchemaDescription:
      "Independent AI agent evaluation for fintechs and insurers, deployed on-premise within client infrastructure.",
    regulatorySectionTitle: "Built for FINMA-regulated environments",
    regulatorySectionBody1:
      "FINMA Guidance 08/2024 and the EU AI Act require institutions to demonstrate effective governance, testing, and monitoring of AI systems.",
    regulatorySectionBody2:
      "Most institutions lack independent validation of how their AI behaves under stress.",
    regulatorySectionBody3: "provides that independent evidence layer.",
    canonicalPath: routes.featuresCh,
  },
  global: {
    pageTitle:
      "AI Customer Service Agent Testing & Risk Evaluation | aodit",
    metaDescription:
      "Stress-test your AI customer support agent before launch. Catch policy drift, refund mistakes, and escalation failures with independent 8-turn evaluation and audit-ready scores.",
    ogTitle: "AI Customer Service Agent Testing | aodit",
    ogDescription:
      "Independent evaluation for AI customer support agents. Adversarial stress tests for refunds, policies, and escalations — with deployment-ready evidence for CX and compliance teams.",
    hero: {
      titleLead: "Will Your Customer Support AI",
      titleHighlight: "Hold Up Under Pressure?",
      subtitleLine1: "8-turn adversarial stress tests",
      subtitleLine2: "before refunds, policies, and customer trust break",
      bullets: [
        "Catch unauthorized refunds, policy drift, and weak identity checks",
        "Simulate angry customers, edge cases, and escalation pressure",
        "Deployment verdicts and evidence CX, trust & safety, and compliance can act on",
      ],
    },
    trustBlock: {
      title: "Your customer conversations stay yours",
      line1:
        "can run on-premise or in your controlled cloud without SwissLI AG accessing production chat logs or customer data by default.",
      line2:
        "Prompts, agent responses, and evaluation artifacts stay under your governance and access controls.",
      line3:
        "Built for teams shipping AI in customer support, contact centers, and digital CX — from pilot to production.",
    },
    cta: {
      title: "Find where your support agent breaks—before customers do.",
      subtitle:
        "Independent evaluation in 2–3 weeks. Try the live demo now or request a full assessment.",
    },
    schemaName: "AI Customer Service Agent Evaluation",
    schemaDescription:
      "Independent behavioral evaluation for AI customer support agents — stress-testing refunds, policies, escalations, and trust risks with audit-ready evidence.",
    websiteSchemaDescription:
      "Independent AI customer support agent evaluation — adversarial stress testing, deployment verdicts, and audit-ready evidence for CX and compliance teams.",
    regulatorySectionTitle: "Built for customer-facing AI under scrutiny",
    regulatorySectionBody1:
      "Consumer-protection rules, the EU AI Act, and enterprise risk frameworks increasingly expect proof that customer-facing AI is tested—not just monitored after complaints.",
    regulatorySectionBody2:
      "Most support teams still lack independent evidence of how their agent behaves when users push for exceptions, refunds, or sensitive account changes.",
    regulatorySectionBody3:
      "closes that gap with structured stress tests—without needing access to your live support queue.",
    canonicalPath: routes.features,
  },
};

export interface FeaturedReportCopy {
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  reportOfInterest: string;
  message: string;
}

export const FEATURED_REPORT_CONTENT: Record<Region, FeaturedReportCopy> = {
  global: {
    title: "2026 Customer Support AI Risk Report",
    subtitle:
      "AODIT stress-tested leading models across refunds, policy edge cases, angry escalations, and identity-verification failures.",
    description:
      "Independent evaluation of AI customer support agents under adversarial pressure—built for CX, trust & safety, and compliance leaders.",
    ctaLabel: "Download Executive Summary",
    reportOfInterest: "Customer Support AI Risk Assessment - Executive Summary",
    message: "Executive summary download lead magnet",
  },
  swiss: {
    title: "2026 Banking AI Risk Report",
    subtitle:
      "AODIT evaluated leading AI systems across multi-turn adversarial scenarios covering customer interactions, fraud handling, and escalation behavior.",
    description:
      "Independent evaluation of AI agent behavior under adversarial banking scenarios aligned with FINMA expectations.",
    ctaLabel: "Download Executive Summary",
    reportOfInterest: "Banking AI Risk Assessment - Executive Summary",
    message: "Executive summary download lead magnet",
  },
};

/** Resolve region from URL pathname (client-side). */
export const getRegionFromPathname = (pathname: string): Region =>
  pathname === routes.featuresCh || pathname.startsWith(`${routes.featuresCh}/`)
    ? "swiss"
    : "global";

const SWISS_REGION_ALIASES = new Set(["ch", "swiss", "switzerland"]);
const GLOBAL_REGION_ALIASES = new Set(["global", "intl", "international"]);

/** Normalize ?region= query values (ch, switzerland, global, …). */
export const parseRegionOverride = (
  value: string | null | undefined,
): RegionOverride | undefined => {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  if (SWISS_REGION_ALIASES.has(normalized)) return "ch";
  if (GLOBAL_REGION_ALIASES.has(normalized)) return "global";
  return undefined;
};

function readRegionCookie(): RegionOverride | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${REGION_COOKIE_NAME}=`));
  if (!match) return undefined;
  const value = match.split("=")[1];
  return parseRegionOverride(value);
}

/** Persist region choice in the browser (used on localhost where Edge Middleware does not run). */
export const setRegionCookie = (target: RegionOverride): void => {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 180;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${REGION_COOKIE_NAME}=${target}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
};

const overrideToRegion = (override: RegionOverride): Region =>
  override === "ch" ? "swiss" : "global";

/**
 * Effective region for nav/footer/home: /ch path, then ?region=, then cookie, else global.
 */
export const getEffectiveRegion = (
  pathname: string,
  search = "",
): Region => {
  if (
    pathname === routes.featuresCh ||
    pathname.startsWith(`${routes.featuresCh}/`)
  ) {
    return "swiss";
  }

  const queryOverride = parseRegionOverride(
    new URLSearchParams(search).get("region"),
  );
  if (queryOverride) return overrideToRegion(queryOverride);

  const cookie = readRegionCookie();
  if (cookie) return overrideToRegion(cookie);

  return "global";
};

export const getHomeContent = (region: Region): HomePageContent =>
  HOME_CONTENT[region];

export const getHreflangAlternates = (
  baseUrl: string,
): { hreflang: string; href: string }[] => [
  { hreflang: "en", href: `${baseUrl}${routes.features}` },
  { hreflang: "en-CH", href: `${baseUrl}${routes.featuresCh}` },
  { hreflang: "x-default", href: `${baseUrl}${routes.features}` },
];

export const createWebsiteSchema = (region: Region): object => {
  const content = HOME_CONTENT[region];
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://www.aodit.ai";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "aodit",
    url: baseUrl,
    description: content.websiteSchemaDescription,
    mainEntity: {
      "@type": "Organization",
      name: "Swiss Lab of Intelligence (SwissLI AG)",
      url: baseUrl,
      logo: `${baseUrl}/icons/icon_512x512.png`,
      sameAs: [],
    },
  };
};
