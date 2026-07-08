import APP_CONSTANTS from "./app_constants";
import END_POINTS from "src/application/shared/endpoints";
import axios from "axios";
import { routes } from "../routes";

// Send cookies (HTTP-only JWT) with every request globally.
// All backend routes are on the same origin, so this is safe and required.
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  if (window.location.hostname.includes(".vercel.app")) {
    const previewSecret = import.meta.env.REACT_APP_PREVIEW_SECRET;
    if (previewSecret) {
      config.headers = config.headers ?? {};
      config.headers["X-Preview-Secret"] = previewSecret;
    }
  }
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<() => void> = [];
let isLoggingOut = false;

const processQueue = () => {
  refreshQueue.forEach((cb) => cb());
  refreshQueue = [];
};

const clearAuthAndRedirect = () => {
  // Prevent multiple logout attempts
  if (isLoggingOut) return;
  isLoggingOut = true;

  // Clear any pending requests FIRST
  refreshQueue = [];
  isRefreshing = false;

  // Clear authentication state SYNCHRONOUSLY
  localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.AUTHENTICATED, "false");
  localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.USER, "null");
  localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.TOKEN, "null");

  // Use replace to navigate WITHOUT reloading
  // This works because we've already cleared localStorage
  // So when Login.tsx checks localStorage, it will see "false" and not redirect
  window.location.replace(routes.auth.login);
};

// Add interceptor to the default axios instance
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If we're already logging out, reject everything immediately
    if (isLoggingOut) {
      return Promise.reject(new Error("Logging out"));
    }

    const originalRequest = error.config;

    // Don't intercept refresh token or logout calls
    if (
      originalRequest.url === END_POINTS.AUTH.REFRESH_TOKEN ||
      originalRequest.url === END_POINTS.AUTH.LOGOUT
    ) {
      return Promise.reject(error);
    }

    // Only handle 401 errors
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Already tried refreshing - logout if retry also failed
    if (originalRequest._retry) {
      clearAuthAndRedirect();
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push(() => {
          if (isLoggingOut) {
            reject(new Error("Logging out"));
          } else {
            axios(originalRequest).then(resolve).catch(reject);
          }
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Try to refresh the token
      await axios.post(
        END_POINTS.AUTH.REFRESH_TOKEN,
        {},
        { withCredentials: true },
      );

      // Success - process queued requests
      isRefreshing = false;
      processQueue();
      return axios(originalRequest);
    } catch (refreshError) {
      // Refresh failed - clear everything and redirect
      isRefreshing = false;
      refreshQueue = [];
      clearAuthAndRedirect();
      return Promise.reject(refreshError);
    }
  },
);

export default axios;
