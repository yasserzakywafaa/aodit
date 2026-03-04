import APP_CONSTANTS from "./app_constants";

const getPublicURL = (): string | undefined => {
  const {
    IS_LOCAL,
    IS_DEV,
    IS_PROD,
    DEV_SERVER_PORT,
    DEV_API_URL,
    PROD_API_URL,
  } = APP_CONSTANTS;

  if (!IS_LOCAL && IS_DEV && !IS_PROD) return DEV_API_URL; // DEV env
  if (!IS_LOCAL && !IS_DEV && IS_PROD) return PROD_API_URL; // PROD env

  return `http://localhost:${DEV_SERVER_PORT || "16002"}`; // LOCAL env
};

const publicApiUrl = getPublicURL();

const END_POINTS = {
  OPENAI: {
    GENERATE: {
      PROJECT: `${publicApiUrl}/api/v1/openai/create/project`,
      PROJECT_STREAM: `${publicApiUrl}/api/v1/openai/create/project-stream`,
    },
  },
  SCHEDULE: {
    TEST_SCHEDULE: `${publicApiUrl}api/v1/test-schedule`,
    GET_ALL_SCHEDULED_PROJECTS: `${publicApiUrl}/api/v1/scheduled-projects`,
  },
  CONTACT: {
    SUPPORT: `${publicApiUrl}/api/v1/contact-support`,
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
      GET_PROJECTS_COUNT: `${publicApiUrl}/api/v1/dashboard/overview/projects-count`,
    },
    ADMIN: {
      USERS: {
        GET_ALL_USERS: `${publicApiUrl}/api/v1/dashboard/admin/users`,
        BLOCK_USER: (userId: string) =>
          `${publicApiUrl}/api/v1/dashboard/users/block/${userId}`,
        UNBLOCK_USER: (userId: string) =>
          `${publicApiUrl}/api/v1/dashboard/users/unblock/${userId}`,
      },
      PROJECTS: {
        GET_ALL_PROJECTS: `${publicApiUrl}/api/v1/dashboard/admin/projects`,
      },
    },
    USERS: {
      GET_ALL_USERS: `${publicApiUrl}/api/v1/dashboard/users`,
      GET_USER_BY_ID: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/${userId}`,
      GET_USER_PROJECTS_COUNT: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/${userId}/projects/count`,
      UPDATE_USER_INFO: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/${userId}/info`,
      DELETE_USER: (userId: string) =>
        `${publicApiUrl}/api/v1/dashboard/users/delete/${userId}`,
    },
    PROJECTS: {
      CREATE_PROJECT: `${publicApiUrl}/api/v1/dashboard/projects/create`,
      GET_PROJECT_BY_ID: `${publicApiUrl}/api/v1/dashboard/projects/get-project-by-id`,
      GET_USER_PROJECTS: `${publicApiUrl}/api/v1/dashboard/projects/get-user-projects`,
      DELETE_PROJECT: (projectId: string) =>
        `${publicApiUrl}/api/v1/dashboard/projects/delete/${projectId}`,
    },
  },
};

export default END_POINTS;
