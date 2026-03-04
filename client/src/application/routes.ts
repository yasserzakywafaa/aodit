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
      userProjects: (userId: string) => `/dashboard/users/${userId}/projects`,
    },
    profile: "/dashboard/profile",
    projects: {
      base: "/dashboard/projects",
      create: "/dashboard/projects/create",
      projectById: (projectId: string) => `/dashboard/projects/${projectId}`,
      projectsByUserId: (userId: string) =>
        `/dashboard/users/${userId}/projects/`,
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
        userProjects: (userId: string) => `/dashboard/users/${userId}/projects`,
      },
      projects: {
        base: "/dashboard/admin/projects",
        create: "/dashboard/admin/projects/create",
        projectById: (projectId: string) =>
          `/dashboard/admin/projects/${projectId}`,
        projectsByUserId: (userId: string) =>
          `/dashboard/admin/users/${userId}/projects/`,
      },
    },
  },
};
