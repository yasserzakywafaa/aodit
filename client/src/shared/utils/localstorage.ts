import { createAuthStorage } from "@yasserzakywafaa/client-core/web";
import APP_CONSTANTS from "src/application/shared/app_constants";

export const { getLocalStorageAuthItems, removeLocalStorageAuthItems } =
  createAuthStorage(APP_CONSTANTS.LOCAL_STORAGE);
