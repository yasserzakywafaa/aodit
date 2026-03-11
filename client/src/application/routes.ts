import APP_CONSTANTS from "./shared/app_constants";

export const externalLinks = {
  docs: APP_CONSTANTS.APP_DOCS_LINK,
};

export const routes = {
  features: `/`,
  pricing: `/pricing`,
  howItWorks: `/how-it-works`,

  contact: `/contact`,
  privacyPolicy: `/privacy-policy`,
  termsAndConditions: `/terms-and-conditions`,
  logout: `/logout`,
  unauthorized: `/unauthorized`,
  notfound: `/notfound`,
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
      profile: "/dashboard/users/profile",
      userById: (userId: string) => `/dashboard/users/${userId}`,
      userReports: (userId: string) => `/dashboard/users/${userId}/reports`,
    },
    profile: "/dashboard/profile",
    reports: {
      base: "/dashboard/reports",
      create: "/dashboard/reports/create",
      reportById: (reportId: string) => `/dashboard/reports/${reportId}`,
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
