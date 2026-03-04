const END_POINTS = {
  TESTING: {
    HELLO: "/api/v1/hello",
  },
  OPENAI: {
    CREATE: {
      test: "/api/v1/openai/create/test",
      test_STREAM: "/api/v1/openai/create/test-stream",
    },
  },
  SCHEDULE: {
    TEST_SCHEDULE: "api/v1/test-schedule",
    GET_ALL_SCHEDULED_PROJECTS: "/api/v1/scheduled-projects",
  },
  CONTACT: {
    SUPPORT: "/api/v1/contact-support",
  },
  AUTH: {
    USER_INFO: `/api/v1/auth/user-info`,
    UPDATE_USER_INFO: `/api/v1/auth/update-user-info`,
    LOGOUT: `/api/v1/auth/logout`,
    // OAuth
    GOOGLE: `/api/v1/auth/google`,
    GOOGLE_CALLBACK: `/api/v1/auth/google/callback`,
    LINKEDIN: `/api/v1/auth/linkedin`,
    LINKEDIN_CALLBACK: `/api/v1/auth/linkedin/callback`,
    REFRESH_TOKEN: `/api/v1/auth/refresh-token`,
    PHONE_REGISTER_SEND_OTP: `/api/v1/auth/phone/register/send-otp`,
    PHONE_REGISTER_VERIFY_OTP: `/api/v1/auth/phone/register/verify-otp`,
    PHONE_LOGIN_SEND_OTP: `/api/v1/auth/phone/login/send-otp`,
    PHONE_LOGIN_VERIFY_OTP: `/api/v1/auth/phone/login/verify-otp`,
  },
  PAYMENTS: {
    CONFIG: `/api/v1/payments/config`,
    WEBHOOK: `/api/v1/payments/webhook`,
    GET_PRICES_LIST: `/api/v1/payments/prices-list`,
    GET_PRODUCTS_LIST_WITH_PRICES: `/api/v1/payments/products-list-with-prices`,
    CREATE_CHECKOUT_SESSION: `/api/v1/payments/create-checkout-session`,
    GET_CHECKOUT_SESSION_DATA: `/api/v1/payments/checkout-session-data`,
    GET_SUBSCRIPTION_DETAILS: `/api/v1/auth/get-subscription-details`,
    CANCEL_SUBSCRIPTION: `/api/v1/payments/cancel-subscription`,
  },
  WEBHOOKS: {
    N8N: {
      NEW_PROJECT_ADDED:
        "https://n8n.yasserzaky.com/webhook/metriz-new-project-added",
    },
  },
  DASHBOARD: {
    OVERVIEW: {
      GET_USERS_COUNT: "/api/v1/dashboard/overview/users-count",
      GET_PROJECTS_COUNT: "/api/v1/dashboard/overview/projects-count",
      GET_CAMPAIGNS_COUNT: "/api/v1/dashboard/overview/campaigns-count",
    },
    ADMIN: {
      USERS: {
        GET_ALL_USERS: `/api/v1/dashboard/admin/users`,
        BLOCK_USER: (userId: string) =>
          `/api/v1/dashboard/users/block/${userId}`,
        UNBLOCK_USER: (userId: string) =>
          `/api/v1/dashboard/users/unblock/${userId}`,
      },
      PROJECTS: {
        GET_ALL_PROJECTS: `/api/v1/dashboard/admin/projects`,
      },
    },
    USERS: {
      GET_ALL_USERS: `/api/v1/dashboard/users`,
      GET_USER_BY_ID: (userId: string) => `/api/v1/dashboard/users/${userId}`,
      GET_USER_PROJECTS_COUNT: (userId: string) =>
        `/api/v1/dashboard/users/${userId}/projects/count`,
      UPDATE_USER_INFO: (userId: string) =>
        `/api/v1/dashboard/users/${userId}/info`,
      DELETE_USER: (userId: string) =>
        `/api/v1/dashboard/users/delete/${userId}`,
    },
    // Projects
    PROJECTS: {
      CREATE_PROJECT: `/api/v1/dashboard/projects/create`,
      GET_USER_PROJECTS: `/api/v1/dashboard/projects/get-user-projects`,
      GET_PROJECT_BY_ID: `/api/v1/dashboard/projects/get-project-by-id`,
      DELETE_PROJECT: (projectId: string) =>
        `/api/v1/dashboard/projects/delete/${projectId}`,
    },
  },
};

export default END_POINTS;
