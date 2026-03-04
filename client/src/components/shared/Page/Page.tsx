import "./Page.scss";

import { CSSProperties, useEffect } from "react";
import { Container, ContainerTypeMap, Divider } from "@mui/material";
import {
  black,
  darkTheme,
  lightTheme,
  white,
} from "src/application/shared/themes";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import APP_CONSTANTS from "src/application/shared/app_constants";
import ApplicationBar from "../ApplicationBar/ApplicationBar";
import Footer from "../Footer/Footer";
import LoaderSpinner from "../Loader/LoaderSpinner";
import { Notification } from "../Notification/Notification";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import ScrollToTopButton from "../ScrollToTopButton";
import classNames from "classnames";
import { routes } from "src/application/routes";
import { scrollToTop } from "src/shared/utils/scrollTo";
import { useApplicationContext } from "src/application/store/Provider";

export interface PageProps {
  title: string;
  id?: string;
  className?: string;
  isLoading?: boolean;
  style?: CSSProperties;
  children?: React.ReactNode;
  containerProps?: OverridableComponent<ContainerTypeMap<{}, "div">>;
}

const Page = (params: PageProps) => {
  const {
    id,
    title,
    style,
    children,
    isLoading,
    className = "",
    containerProps = {},
  } = params;
  const {
    store: {
      state: { isFetching, themeMode },
      setPreviousUrl,
    },
    manager: { handleFetchUserInfo, handleSetAuthInfo },
  } = useApplicationContext();

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authStatus = searchParams.get("authStatus");
  const provider = searchParams.get("provider");
  const userId = searchParams.get("userId");
  // const hasCallback = sessionStorage.getItem("oauthCallback");

  const isPageLoading = isLoading || isFetching;
  const pageClassNames = classNames({
    container: true,
    [className]: className,
  });

  const handleAuthSuccess = async () => {
    console.log("🔐 GoogleAuth: OAuth successful, executing callback");

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Set authentication state immediately - cookies are already set by server
    localStorage.setItem(APP_CONSTANTS.LOCAL_STORAGE.AUTHENTICATED, "true");

    // Fetch user info using the authenticated endpoint (which uses cookies)
    try {
      const fetchedUser = await handleFetchUserInfo(userId);
      handleSetAuthInfo({
        isAuthenticated: true,
        user: fetchedUser,
      });
      navigate(routes.dashboard.base);
    } catch (error) {
      console.error("❌ Failed to fetch user info after OAuth:", error);
      // Still set authenticated state but with null user
      handleSetAuthInfo({
        isAuthenticated: true,
        user: null,
      });
    }

    // Clean up
    window.history.replaceState({}, "", window.location.pathname);
  };

  useEffect(() => {
    // Update page color
    localStorage.setItem(
      APP_CONSTANTS.DESIGN.LOCAL_STORAGE_APP_THEME,
      themeMode,
    );
    const themeColorMetaTag = document.getElementById("theme-color");
    themeColorMetaTag &&
      themeColorMetaTag.setAttribute(
        "content",
        themeMode === "dark" ? black : white,
      );

    if (!location.hash) scrollToTop();

    return () => {
      setPreviousUrl(location.pathname);
    };
  }, []);

  useEffect(() => {
    if (authStatus && provider && userId) {
      handleAuthSuccess();
    }
  }, [authStatus, provider, userId]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    }
  }, [location.hash]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    // Prevent scrolling while page is loading
    const htmlNode = document.getElementsByTagName("html")[0];
    if (isPageLoading) htmlNode.style.overflow = "hidden";
    else htmlNode.removeAttribute("style");
  }, [isPageLoading]);

  return (
    <>
      <div
        style={{
          background:
            themeMode === "dark"
              ? darkTheme.palette.background.default
              : lightTheme.palette.background.default,
        }}
      />

      <Container
        // maxWidth={false}
        id={id}
        style={style}
        className={pageClassNames}
        {...containerProps}
      >
        <Notification />

        <ApplicationBar />

        <ScrollToTopButton />

        <>{children}</>

        {isPageLoading && <LoaderSpinner position="fixed" />}

        <Divider sx={{ my: 4 }} />
        <Footer />
      </Container>
    </>
  );
};

export default Page;
