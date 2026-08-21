import APP_CONSTANTS from "../shared/app_constants";
import {
  getInitialThemePreference,
  getThemePreferenceFromUser,
  type ThemePreference,
} from "@yasserzakywafaa/client-core";
import { User } from "src/shared/types/user";

export interface ApplicationInitialState {
  isFetching: boolean;
  isFetchingUserInfo: boolean;
  themePreference: ThemePreference;
  auth: Authentication;
  previousUrl: string;
  trackingInfo: TrackingInfo;
  userType: UserType;
}

export interface UserType {
  isFreeUser: boolean;
  isPaidUser: boolean;
  isLiteUser: boolean;
  isBasicUser: boolean;
  isEssentialUser: boolean;
  isPremiumUser: boolean;
}

export interface TrackingInfo {
  clientId: string;
}

export interface Authentication {
  isAuthenticated: boolean;
  user: AuthenticateUser | null;
}

export type AuthenticateUser = User;

const themePreferenceConfig = {
  storageKey: APP_CONSTANTS.DESIGN.LOCAL_STORAGE_APP_THEME,
};

export const resolveThemePreferenceForUser = (
  user?: User | null,
): ThemePreference => {
  return (
    getThemePreferenceFromUser(user) ??
    getInitialThemePreference(user, themePreferenceConfig)
  );
};

/** @deprecated Use resolveThemePreferenceForUser */
export const getThemePreference = resolveThemePreferenceForUser;

export const getApplicationInitialState = (): ApplicationInitialState => {
  const storedUser = localStorage.getItem(APP_CONSTANTS.LOCAL_STORAGE.USER);
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  return {
    isFetching: false,
    isFetchingUserInfo: true,
    themePreference: resolveThemePreferenceForUser(parsedUser),
    previousUrl: "",
    auth: {
      user: null,
      isAuthenticated: false,
    },
    userType: {
      isFreeUser: true,
      isPaidUser: false,
      isLiteUser: false,
      isBasicUser: false,
      isEssentialUser: false,
      isPremiumUser: false,
    },
    trackingInfo: {
      clientId: "",
    },
  };
};
