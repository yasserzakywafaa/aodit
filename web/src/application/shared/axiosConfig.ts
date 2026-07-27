import APP_CONSTANTS from "./app_constants";
import END_POINTS from "src/application/shared/endpoints";
import axios from "axios";
import { routes } from "../routes";
import { setupAuthAxios } from "@yasserzakywafaa/client-core/web";

const { AUTHENTICATED, USER, TOKEN } = APP_CONSTANTS.LOCAL_STORAGE;

setupAuthAxios({
  instance: axios,
  refreshUrl: END_POINTS.AUTH.REFRESH_TOKEN,
  logoutUrl: END_POINTS.AUTH.LOGOUT,
  loginUrl: routes.auth.login,
  storage: {
    clearAuth: () => {
      localStorage.setItem(AUTHENTICATED, "false");
      localStorage.setItem(USER, "null");
      localStorage.setItem(TOKEN, "null");
    },
  },
  preview: {
    secret: () => import.meta.env.REACT_APP_PREVIEW_SECRET as string | undefined,
  },
});

export default axios;
