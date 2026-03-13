import APP_CONSTANTS from "../shared/app_constants";
import { PaletteMode } from "@mui/material";
import { User } from "src/shared/types/user";
import { primaryColor } from "../shared/themes";

export interface ApplicationInitialState {
  isFetching: boolean;
  isFetchingUserInfo: boolean;
  themeMode: PaletteMode;
  /** Current primary accent color for the MUI theme */
  themePrimaryColor: string;
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

/**
 * Gets the theme preference, prioritizing user preferences over localStorage
 * @param user - Optional user object to check for theme preference
 * @returns The theme mode ("light" or "dark")
 */
export const getThemePreference = (user?: User | null): PaletteMode => {
  // First, check user preferences if user is available
  if (user?.preferences?.theme) {
    return user.preferences.theme as PaletteMode;
  }

  // Fall back to localStorage
  const storedTheme = localStorage.getItem(
    APP_CONSTANTS.DESIGN.LOCAL_STORAGE_APP_THEME
  ) as PaletteMode;

  // Default to "dark" if nothing is found
  return storedTheme || "dark";
};

/**
 * Gets the stored primary accent color from localStorage.
 * Falls back to the default gold if nothing is saved.
 */
export const getPrimaryColorPreference = (): string => {
  return (
    localStorage.getItem(APP_CONSTANTS.DESIGN.LOCAL_STORAGE_APP_PRIMARY_COLOR) ||
    primaryColor
  );
};

export const getApplicationInitialState = (): ApplicationInitialState => {
  // Check if there's a user in localStorage first
  const storedUser = localStorage.getItem(APP_CONSTANTS.LOCAL_STORAGE.USER);
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;

  const appThemMode = getThemePreference(parsedUser);
  const appPrimaryColor = getPrimaryColorPreference();

  return {
    isFetching: false,
    isFetchingUserInfo: true,
    themeMode: appThemMode,
    themePrimaryColor: appPrimaryColor,
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
