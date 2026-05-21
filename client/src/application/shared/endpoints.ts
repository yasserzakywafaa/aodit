import APP_CONSTANTS from "./app_constants";

const getPublicURL = (): string => {
  const {
    IS_LOCAL,
    IS_DEV,
    IS_PROD,
    DEV_SERVER_PORT,
    DEV_API_URL,
    PROD_API_URL,
  } = APP_CONSTANTS;

  if (!IS_LOCAL && IS_DEV && !IS_PROD && DEV_API_URL) return DEV_API_URL; // DEV env
  if (!IS_LOCAL && !IS_DEV && IS_PROD && PROD_API_URL) return PROD_API_URL; // PROD env
  if (!IS_LOCAL && !IS_DEV && IS_PROD && !PROD_API_URL) return ""; // on-prem: same-origin, use relative URLs

  return `http://localhost:${DEV_SERVER_PORT || "16002"}`; // LOCAL env
};

const publicApiUrl = getPublicURL();

const END_POINTS = {
  PUBLIC_DEMO: {
    START: `${publicApiUrl}/api/v1/public/demo/start`,
    STATUS: (sessionId: string) =>
      `${publicApiUrl}/api/v1/public/demo/${sessionId}/status`,
    STOP: (sessionId: string) =>
      `${publicApiUrl}/api/v1/public/demo/${sessionId}/stop`,
  },
  // Runtime config — fetched once at startup; no auth required
  CONFIG: `${publicApiUrl}/api/config`,

  OPENAI: {
    GENERATE: {
      PROJECT: `${publicApiUrl}/api/v1/openai/create/project`,
      PROJECT_STREAM: `${publicApiUrl}/api/v1/openai/create/project-stream`,
    },
  },
  SCHEDULE: {
    TEST_SCHEDULE: `${publicApiUrl}api/v1/test-schedule`,
    GET_ALL_SCHEDULED_REPORTS: `${publicApiUrl}/api/v1/scheduled-reports`,
  },
  CONTACT: {
    SUPPORT: `${publicApiUrl}/api/v1/contact-support`,
  },
  LEAD_MAGNET: {
    SUBSCRIBE: `${publicApiUrl}/api/v1/lead-magnet/subscribe`,
  },
  AUTH: {
    USER_INFO: `${publicApiUrl}/api/v1/auth/user-info`,
    UPDATE_USER_INFO: `${publicApiUrl}/api/v1/auth/update-user-info`,
    REFRESH_TOKEN: `${publicApiUrl}/api/v1/auth/refresh-token`,
    LOGOUT: `${publicApiUrl}/api/v1/auth/logout`,
    // OAuth
    GOOGLE: `${publicApiUrl}/api/v1/auth/google`,
    LINKEDIN: `${publicApiUrl}/api/v1/auth/linkedin`,
    PHONE_REGISTER_SEND_OTP: `${publicApiUrl}/api/v1/auth/phone/register/send-otp`,
    PHONE_REGISTER_VERIFY_OTP: `${publicApiUrl}/api/v1/auth/phone/register/verify-otp`,
    PHONE_LOGIN_SEND_OTP: `${publicApiUrl}/api/v1/auth/phone/login/send-otp`,
    PHONE_LOGIN_VERIFY_OTP: `${publicApiUrl}/api/v1/auth/phone/login/verify-otp`,
    // Email + password auth
    EMAIL_REGISTER: `${publicApiUrl}/api/v1/auth/register/email`,
    EMAIL_LOGIN: `${publicApiUrl}/api/v1/auth/login/email`,
  },
  PAYMENTS: {
    CONFIG: `${publicApiUrl}/api/v1/payments/config`,
    WEBHOOK: `${publicApiUrl}/api/v1/payments/webhook`,
    GET_PRICES_LIST: `${publicApiUrl}/api/v1/payments/prices-list`,
    GET_PRODUCTS_LIST_WITH_PRICES: `${publicApiUrl}/api/v1/payments/products-list-with-prices`,
    CREATE_CHECKOUT_SESSION: `${publicApiUrl}/api/v1/payments/create-checkout-session`,
    GET_CHECKOUT_SESSION_DATA: `${publicApiUrl}/api/v1/payments/checkout-session-data`,
    GET_SUBSCRIPTION_DETAILS: `${publicApiUrl}/api/v1/auth/get-subscription-details`,
    CANCEL_SUBSCRIPTION: `${publicApiUrl}/api/v1/payments/cancel-subscription`,
  },
  DASHBOARD: {
    OVERVIEW: {
      GET_USERS_COUNT: `${publicApiUrl}/api/v1/dashboard/overview/users-count`,
      GET_REPORTS_COUNT: `${publicApiUrl}/api/v1/dashboard/overview/reports-count`,
      GET_DEMOS_COUNT: `${publicApiUrl}/api/v1/dashboard/overview/demos-count`,
    },
    ADMIN: {
      USERS: {
        GET_ALL_USERS: `${publicApiUrl}/api/v1/dashboard/admin/users`,
        CREATE_USER: `${publicApiUrl}/api/v1/dashboard/admin/users/create`,
        BLOCK_USER: (userId: string) =>
          `${publicApiUrl}/api/v1/dashboard/users/block/${userId}`,
        UNBLOCK_USER: (userId: string) =>
          `${publicApiUrl}/api/v1/dashboard/users/unblock/${userId}`,
      },
      REPORTS: {
        GET_ALL_REPORTS: `${publicApiUrl}/api/v1/dashboard/admin/reports`,
      },
      AGENTS: {
        GET_ALL_AGENTS: `${publicApiUrl}/api/v1/dashboard/admin/agents`,
      },
      DEMOS: {
        GET_ALL_DEMOS: `${publicApiUrl}/api/v1/dashboard/admin/demos`,
        GET_DEMO_BY_ID: (demoId: string) =>
          `${publicApiUrl}/api/v1/dashboard/admin/demos/${demoId}`,
        DELETE_DEMO: (demoId: string) =>
          `${publicApiUrl}/api/v1/dashboard/admin/demos/delete/${demoId}`,
      },
    },
    USERS: {
      GET_ALL_USERS: `${publicApiUrl}/api/v1/dashboard/users`,
      GET_USER_BY_ID: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/${userId}`,
      GET_USER_REPORTS_COUNT: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/${userId}/reports/count`,
      UPDATE_USER_INFO: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/${userId}/info`,
      DELETE_USER: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/delete/${userId}`,
    },
    AGENTS: {
      CREATE_AGENT: `${publicApiUrl}/api/v1/dashboard/agents/create`,
      GET_USER_AGENTS: `${publicApiUrl}/api/v1/dashboard/agents/get-user-agents`,
      GET_AGENT_BY_ID: `${publicApiUrl}/api/v1/dashboard/agents/get-agent-by-id`,
      UPDATE_AGENT: (agentId: string) =>
        `${publicApiUrl}/api/v1/dashboard/agents/update/${agentId}`,
      DELETE_AGENT: (agentId: string) =>
        `${publicApiUrl}/api/v1/dashboard/agents/delete/${agentId}`,
      GET_REPORTS_BY_AGENT_ID: (agentId: string) =>
        `${publicApiUrl}/api/v1/dashboard/agents/${agentId}/reports`,
      TEST_EVALUATOR_CONNECTION: (agentId: string) =>
        `${publicApiUrl}/api/v1/dashboard/agents/${agentId}/test-evaluator-connection`,
      GET_EVALUATOR_MODELS: (agentId: string) =>
        `${publicApiUrl}/api/v1/dashboard/agents/${agentId}/evaluator-models`,
    },
    REPORTS: {
      CREATE_REPORT: `${publicApiUrl}/api/v1/dashboard/reports/create`,
      GET_REPORT_BY_ID: `${publicApiUrl}/api/v1/dashboard/reports/get-report-by-id`,
      GET_USER_REPORTS: `${publicApiUrl}/api/v1/dashboard/reports/get-user-reports`,
      UPDATE_REPORT: (reportId: string) =>
        `${publicApiUrl}/api/v1/dashboard/reports/update/${reportId}`,
      DELETE_REPORT: (reportId: string) =>
        `${publicApiUrl}/api/v1/dashboard/reports/delete/${reportId}`,
      LAUNCH_REPORT: (reportId: string) =>
        `${publicApiUrl}/api/v1/dashboard/reports/launch/${reportId}`,
      TEST_AGENT_CONNECTION: (reportId: string) =>
        `${publicApiUrl}/api/v1/dashboard/reports/${reportId}/test-agent-connection`,
      GET_REPORT_RUNS: (reportId: string) =>
        `${publicApiUrl}/api/v1/dashboard/reports/${reportId}/runs`,
      GET_RUN_STATUS: (reportId: string) =>
        `${publicApiUrl}/api/v1/dashboard/reports/${reportId}/run-status`,
      GET_SCENARIO_RESULTS: (reportId: string, runId?: string) =>
        `${publicApiUrl}/api/v1/dashboard/reports/${reportId}/scenario-results${runId ? `?runId=${runId}` : ""}`,
      STOP_REPORT: (reportId: string) =>
        `${publicApiUrl}/api/v1/dashboard/reports/${reportId}/stop`,
    },
  },
};

export default END_POINTS;
