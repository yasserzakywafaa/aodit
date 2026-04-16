import React, {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";
import END_POINTS from "../shared/endpoints";

interface AppConfig {
  isOnPrem: boolean;
  isLoading: boolean;
}

const LS_KEY = "app_config";

/**
 * Read the cached config from localStorage synchronously so the first render
 * already has the correct value — prevents a flash of social/phone auth buttons
 * on subsequent page loads.
 */
const getInitialConfig = (): AppConfig => {
  try {
    const cached = localStorage.getItem(LS_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return { isOnPrem: !!parsed.isOnPrem, isLoading: false };
    }
  } catch {
    // Ignore JSON parse errors
  }
  return { isOnPrem: false, isLoading: true };
};

const AppConfigContext = createContext<AppConfig>({
  isOnPrem: false,
  isLoading: true,
});

export const useAppConfig = (): AppConfig => useContext(AppConfigContext);

export const AppConfigProvider: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [config, setConfig] = useState<AppConfig>(getInitialConfig);

  useEffect(() => {
    axios
      .get<{ onPrem: boolean }>(END_POINTS.CONFIG)
      .then((response) => {
        const isOnPrem = !!response.data.onPrem;
        const resolved: AppConfig = { isOnPrem, isLoading: false };
        setConfig(resolved);
        localStorage.setItem(LS_KEY, JSON.stringify({ isOnPrem }));
      })
      .catch(() => {
        // Network error or server not ready — use cached/default, mark as loaded
        setConfig((prev) => ({ ...prev, isLoading: false }));
      });
  }, []);

  return (
    <AppConfigContext.Provider value={config}>
      {children}
    </AppConfigContext.Provider>
  );
};
