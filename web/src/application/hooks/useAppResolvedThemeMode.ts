import { useResolvedThemeMode } from "@yasserzakywafaa/client-core/web";

import { useApplicationContext } from "../store/Provider";

export const useAppResolvedThemeMode = () => {
  const {
    store: {
      state: { themePreference },
    },
  } = useApplicationContext();

  return useResolvedThemeMode(themePreference);
};
