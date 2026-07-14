import {
  Authentication,
  getApplicationInitialState,
  getThemePreference,
} from "./state";
import axios, { AxiosResponse } from "axios";

import APP_CONSTANTS from "../shared/app_constants";
import { ApplicationStore } from "./store";
import END_POINTS from "../shared/endpoints";
import { User } from "src/shared/types/user";
import { getClientIdFromGoogleAnalyticsCookie } from "@yasserzakywafaa/client-core/web";
import { getLocalStorageAuthItems } from "src/shared/utils/localstorage";

export interface ApplicationManager {
  handleIsFetching: (isFetching: boolean) => void;
  handleToggleThemeMode: () => void;
  handleSetAuthInfo: (authInfo: Authentication) => void;
  handleFetchUserInfo: (userId: string) => Promise<User | null>;
  handleInitialAuthentication: () => Promise<void>;
  handleUpdateUserInfoInApplication: (
    userInfoToUpdate: Partial<User>,
  ) => Promise<void>;
}

export const useApplicationManager = (
  store: ApplicationStore,
): ApplicationManager => {
  const handleIsFetching = (isFetching: boolean) => {
    store.handleIsFetching(isFetching);
  };

  const handleToggleThemeMode = async () => {
    store.toggleThemeMode();

    if (store.state.auth.isAuthenticated && store.state.auth.user) {
      await handleUpdateUserInfoInApplication({
        preferences: {
          ...store.state.auth.user.preferences,
          theme: store.state.themeMode === "dark" ? "light" : "dark",
        },
      });
    }
  };

  const handleSetAuthInfo = (authInfo: Authentication) => {
    const { USER, AUTHENTICATED: IS_AUTHENTICATED } =
      APP_CONSTANTS.LOCAL_STORAGE;
    localStorage.setItem(USER, JSON.stringify(authInfo.user));
    localStorage.setItem(IS_AUTHENTICATED, JSON.stringify(!!authInfo.user));
    store.updateAuthInfo(authInfo);
  };

  const handleFetchUserInfo = async (userId: string): Promise<User | null> => {
    try {
      const response: AxiosResponse<User, User> = await axios.get(
        END_POINTS.AUTH.USER_INFO,
        {
          params: {
            _id: userId,
          },
          withCredentials: true, // Include cookies in the request
        },
      );

      return response.data;
    } catch (error) {
      console.error("Failed to get User Information:", error);
      return null;
    }
  };

  const handleInitialAuthentication = async () => {
    const storedAuthInfo = getLocalStorageAuthItems();

    // Apply initial theme (will be updated if user is authenticated)
    const initialTheme = getThemePreference(storedAuthInfo.user);
    document.body.classList.remove(
      APP_CONSTANTS.APP_THEME_CLASS.DARK,
      APP_CONSTANTS.APP_THEME_CLASS.LIGHT,
    );
    document.body.classList.add(
      initialTheme === "dark"
        ? APP_CONSTANTS.APP_THEME_CLASS.DARK
        : APP_CONSTANTS.APP_THEME_CLASS.LIGHT,
    );

    // Check if localStorage says NOT authenticated
    // This prevents the fetch loop after logout
    if (!storedAuthInfo.isAuthenticated || storedAuthInfo.user === null) {
      // User is not logged in, set initial auth state
      handleSetAuthInfo(getApplicationInitialState().auth);
      store.handleIsFetchingUserInfo(false);
      return;
    }

    // User is already logged in, update auth state
    const userId = storedAuthInfo.user?._id;
    if (userId) {
      const fetchedUser = await handleFetchUserInfo(userId);
      if (fetchedUser) {
        handleSetAuthInfo({
          ...store.state.auth,
          isAuthenticated: true,
          user: fetchedUser,
        });

        localStorage.setItem(
          APP_CONSTANTS.LOCAL_STORAGE.USER,
          JSON.stringify(fetchedUser),
        );
      } else {
        // API failed but we have stored user - clear everything
        // This handles the case where cookies are invalid
        localStorage.setItem(
          APP_CONSTANTS.LOCAL_STORAGE.AUTHENTICATED,
          "false",
        );
        localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.USER, "null");
        handleSetAuthInfo(getApplicationInitialState().auth);
      }
    }

    store.handleIsFetchingUserInfo(false);

    // Google Analytics Tracking
    const gaClientId = getClientIdFromGoogleAnalyticsCookie();
    if (gaClientId) {
      store.setTrackingInfo({
        clientId: gaClientId,
      });
    }
  };

  const handleUpdateUserInfoInApplication = async (
    userInfoToUpdate: Partial<User>,
  ) => {
    if (!store.state.auth.user) return;

    try {
      const updatedUser: AxiosResponse<User, any> = await axios.post(
        END_POINTS.AUTH.UPDATE_USER_INFO,
        {
          userId: store.state.auth.user._id,
          userInfoToUpdate,
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": new Date().toISOString(),
          },
        },
        {
          withCredentials: true,
        },
      );

      store.updateAuthInfo({
        isAuthenticated: true,
        user: updatedUser.data,
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return {
    handleIsFetching,
    handleToggleThemeMode,
    handleSetAuthInfo,
    handleFetchUserInfo,
    handleInitialAuthentication,
    handleUpdateUserInfoInApplication,
  };
};
