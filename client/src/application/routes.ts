import APP_CONSTANTS from "./shared/app_constants";

export const externalLinks = {
  docs: APP_CONSTANTS.APP_DOCS_LINK,
};

export const routes = {
  features: `/`,
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
  logout: `/logout`,
  // Auth
  auth: {
    login: "/login",
    register: "/register",
    logout: `/logout`,
  },
  // Documentation
  documentation: {
    base: `${externalLinks.docs}`,
  },
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
