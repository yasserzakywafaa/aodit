import {
  ApplicationInitialState,
  Authentication,
  TrackingInfo,
  getApplicationInitialState,
  resolveThemePreferenceForUser,
} from "./state";
import { black, white } from "../shared/themes";

import APP_CONSTANTS from "../shared/app_constants";
import type { ThemePreference } from "@yasserzakywafaa/client-core";
import { SubscriptionPlanEnum } from "src/shared/types/user";
import { useState } from "react";

export const applyThemeToDOM = (theme: "light" | "dark") => {
  const themeColorMetaTag = document.getElementById("theme-color");

  document.documentElement.style.colorScheme = theme;

  switch (theme) {
    case "light":
      themeColorMetaTag && themeColorMetaTag.setAttribute("content", white);
      document.body.classList.remove(APP_CONSTANTS.APP_THEME_CLASS.DARK);
      document.body.classList.add(APP_CONSTANTS.APP_THEME_CLASS.LIGHT);
      break;

    case "dark":
      themeColorMetaTag && themeColorMetaTag.setAttribute("content", black);
      document.body.classList.remove(APP_CONSTANTS.APP_THEME_CLASS.LIGHT);
      document.body.classList.add(APP_CONSTANTS.APP_THEME_CLASS.DARK);
      break;
  }
};

export interface ApplicationStore {
  state: ApplicationInitialState;
  updateState: (newState: ApplicationInitialState) => void;
  handleIsFetching: (handleIsFetching: boolean) => void;
  setPreviousUrl: (previousUrl: string) => void;
  setTrackingInfo: (trackingInfo: TrackingInfo) => void;
  handleIsFetchingUserInfo: (isFetchingUserInfo: boolean) => void;
  setThemePreference: (themePreference: ThemePreference) => void;
  updateAuthInfo: (authInfo?: Authentication) => void;
}

const useApplicationStore = (): ApplicationStore => {
  const [state, setState] = useState<ApplicationInitialState>(
    getApplicationInitialState(),
  );

  const updateState = (newState: ApplicationInitialState) => {
    setState(newState);
  };

  const handleIsFetching = (isFetching: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetching,
    }));
  };

  const setPreviousUrl = (previousUrl: string) => {
    setState((prev) => ({
      ...prev,
      previousUrl,
    }));
  };

  const setTrackingInfo = (trackingInfo: TrackingInfo) => {
    setState((prev) => ({
      ...prev,
      trackingInfo,
    }));
  };

  const handleIsFetchingUserInfo = (isFetchingUserInfo: boolean) => {
    setState((prev) => ({
      ...prev,
      isFetchingUserInfo,
    }));
  };

  const setThemePreference = (themePreference: ThemePreference) => {
    setState((prev) => ({
      ...prev,
      themePreference,
    }));

    localStorage.setItem(
      APP_CONSTANTS.DESIGN.LOCAL_STORAGE_APP_THEME,
      themePreference,
    );
  };

  const updateAuthInfo = (authInfo?: Authentication) => {
    if (authInfo) {
      const themePreference = resolveThemePreferenceForUser(authInfo.user);

      setState((prev) => ({
        ...prev,
        themePreference,
        auth: {
          isAuthenticated: authInfo.isAuthenticated,
          user: authInfo.user,
        },
        userType: {
          isFreeUser:
            authInfo.user?.subscription.type === SubscriptionPlanEnum.Free,
          isPaidUser:
            authInfo.user?.subscription.type !== SubscriptionPlanEnum.Free,
          isLiteUser:
            authInfo.user?.subscription.type === SubscriptionPlanEnum.Lite,
          isBasicUser:
            authInfo.user?.subscription.type === SubscriptionPlanEnum.Basic,
          isEssentialUser:
            authInfo.user?.subscription.type === SubscriptionPlanEnum.Essential,
          isPremiumUser:
            authInfo.user?.subscription.type === SubscriptionPlanEnum.Premium,
        },
      }));
    } else {
      const {
        AUTHENTICATED: IS_AUTHENTICATION,
        TOKEN,
        USER,
      } = APP_CONSTANTS.LOCAL_STORAGE;
      const storedToken = localStorage.getItem(TOKEN) || "";
      const storedUser = localStorage.getItem(USER) ?? null;
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const storedIsAuthenticated = localStorage.getItem(IS_AUTHENTICATION);
      const themePreference = resolveThemePreferenceForUser(parsedUser);

      setState((prev) => ({
        ...prev,
        themePreference,
        auth: {
          token: storedToken,
          isAuthenticated: storedIsAuthenticated === "true" ? true : false,
          user: parsedUser,
        },
        userType: {
          isFreeUser:
            parsedUser?.subscription.type === SubscriptionPlanEnum.Free,
          isPaidUser:
            parsedUser?.subscription.type !== SubscriptionPlanEnum.Free,
          isLiteUser:
            parsedUser?.subscription.type === SubscriptionPlanEnum.Basic,
          isBasicUser:
            parsedUser?.subscription.type === SubscriptionPlanEnum.Basic,
          isEssentialUser:
            parsedUser?.subscription.type === SubscriptionPlanEnum.Essential,
          isPremiumUser:
            parsedUser?.subscription.type === SubscriptionPlanEnum.Premium,
        },
      }));
    }
  };

  return {
    state,
    updateState,
    handleIsFetching,
    setPreviousUrl,
    setTrackingInfo,
    handleIsFetchingUserInfo,
    setThemePreference,
    updateAuthInfo,
  };
};

export default useApplicationStore;
