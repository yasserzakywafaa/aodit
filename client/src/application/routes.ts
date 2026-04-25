import { landingPagesRoutes } from "./shared/landingPages";

export const routes = {
  ...landingPagesRoutes,
  features: `/`,
  industries: `/industries`,
  demo: `/demo`,
  methodology: `/ai-agent-testing-methodology`,
  security: `/security-on-premise-ai`,
  about: `/about-swissli`,
  pricing: `/pricing`,
  compliance: {
    // Keep legacy paths available for compatibility during migration.
    finma: `/compliance/finma-ai-guidance-switzerland`,
    euAiAct: `/compliance/eu-ai-act-europe`,
  },
  contact: `/contact`,
  privacyPolicy: `/privacy-policy`,
  termsAndConditions: `/terms-and-conditions`,
  dataProcessingAgreement: `/data-processing-agreement`,
  // Auth
  auth: {
    login: "/login",
    register: "/register",
  },

  // Industry / use-case SEO landing pages
  // Mirrors the spread above so callers can use either routes.<key>
  // or routes.landingPages.<key>.
  landingPages: landingPagesRoutes,

  // Dashboard (Admin)
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
    },
  },
};

export const prerenderPaths: string[] = [
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
  routes.privacyPolicy,
  routes.termsAndConditions,
  routes.dataProcessingAgreement,
  routes.auth.login,
  routes.auth.register,
  // Industry / use-case SEO landing pages
  ...Object.values(landingPagesRoutes),
];
