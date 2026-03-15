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
    GET_ALL_SCHEDULED_REPORTS: "/api/v1/scheduled-reports",
  },
  CONTACT: {
    SUPPORT: "/api/v1/contact-support",
  },
  LEAD_MAGNET: {
    SUBSCRIBE: "/api/v1/lead-magnet/subscribe",
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
      NEW_REPORT_ADDED:
        "https://n8n.yasserzaky.com/webhook/aodit-new-report-added",
    },
  },
  DASHBOARD: {
    OVERVIEW: {
      GET_USERS_COUNT: "/api/v1/dashboard/overview/users-count",
      GET_REPORTS_COUNT: "/api/v1/dashboard/overview/reports-count",
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
      REPORTS: {
        GET_ALL_REPORTS: `/api/v1/dashboard/admin/reports`,
      },
    },
    USERS: {
      GET_ALL_USERS: `/api/v1/dashboard/users`,
      GET_USER_BY_ID: (userId: string) => `/api/v1/dashboard/users/${userId}`,
      GET_USER_REPORTS_COUNT: (userId: string) =>
        `/api/v1/dashboard/users/${userId}/reports/count`,
      UPDATE_USER_INFO: (userId: string) =>
        `/api/v1/dashboard/users/${userId}/info`,
      DELETE_USER: (userId: string) =>
        `/api/v1/dashboard/users/delete/${userId}`,
    },
    // Reports
    REPORTS: {
      CREATE_REPORT: `/api/v1/dashboard/reports/create`,
      GET_USER_REPORTS: `/api/v1/dashboard/reports/get-user-reports`,
      GET_REPORT_BY_ID: `/api/v1/dashboard/reports/get-report-by-id`,
      UPDATE_REPORT: (reportId: string) =>
        `/api/v1/dashboard/reports/update/${reportId}`,
      DELETE_REPORT: (reportId: string) =>
        `/api/v1/dashboard/reports/delete/${reportId}`,
      LAUNCH_REPORT: (reportId: string) =>
        `/api/v1/dashboard/reports/launch/${reportId}`,
      GET_REPORT_RUNS: (reportId: string) =>
        `/api/v1/dashboard/reports/${reportId}/runs`,
      GET_RUN_STATUS: (reportId: string) =>
        `/api/v1/dashboard/reports/${reportId}/run-status`,
    },
  },
};

export default END_POINTS;
