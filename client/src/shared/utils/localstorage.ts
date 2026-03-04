import APP_CONSTANTS from "src/application/shared/app_constants";

export const getLocalStorageAuthItems = () => {
  return {
    isAuthenticated:
      localStorage.getItem(APP_CONSTANTS.LOCAL_STORAGE.AUTHENTICATED) ===
      "true",
    user: JSON.parse(
      localStorage.getItem(APP_CONSTANTS.LOCAL_STORAGE.USER) ?? "null"
    ),
  };
};

export const removeLocalStorageAuthItems = () => {
  Object.keys(APP_CONSTANTS.LOCAL_STORAGE).forEach((item) => {
    localStorage.removeItem(item);
  });
};
