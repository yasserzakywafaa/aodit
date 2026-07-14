import "./Page.scss";

import { CSSProperties, useEffect } from "react";
import { Container, ContainerTypeMap } from "@mui/material";
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
import { scrollToTop } from "@yasserzakywafaa/client-core/web";
import { trackEvent } from "src/shared/utils/ga4";
import { useApplicationContext } from "src/application/store/Provider";

export interface HreflangAlternate {
  hreflang: string;
  href: string;
}

export interface PageProps {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  hreflangAlternates?: HreflangAlternate[];
  id?: string;
  className?: string;
  isLoading?: boolean;
  noIndex?: boolean;
  style?: CSSProperties;
  children?: React.ReactNode;
  containerProps?: OverridableComponent<ContainerTypeMap<{}, "div">>;
}

const Page = (params: PageProps) => {
  const {
    id,
    title,
    description,
    ogTitle,
    ogDescription,
    hreflangAlternates,
    style,
    children,
    isLoading,
    noIndex = false,
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
      trackEvent("login", {
        method: provider ?? "oauth",
        auth_type: "oauth",
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
  }, [themeMode, location.pathname]);

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
    let robotsMeta = document.querySelector(
      "meta[name='robots']",
    ) as HTMLMetaElement | null;
    if (!robotsMeta) {
      robotsMeta = document.createElement("meta");
      robotsMeta.setAttribute("name", "robots");
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute(
      "content",
      noIndex ? "noindex, follow" : "index, follow",
    );
  }, [noIndex]);

  useEffect(() => {
    const baseUrl = APP_CONSTANTS.APP_URL || window.location.origin;
    const canonicalUrl = `${baseUrl}${location.pathname}`;

    const canonicalLink = document.querySelector(
      "link[rel='canonical']",
    ) as HTMLLinkElement | null;
    if (canonicalLink) {
      canonicalLink.setAttribute("href", canonicalUrl);
    }

    const ogUrlMeta = document.querySelector(
      "meta[property='og:url']",
    ) as HTMLMetaElement | null;
    if (ogUrlMeta) {
      ogUrlMeta.setAttribute("content", canonicalUrl);
    }
  }, [location.pathname]);

  useEffect(() => {
    const setMetaContent = (
      selector: string,
      attribute: "name" | "property",
      attrValue: string,
      content: string | undefined,
    ) => {
      if (content === undefined) return;
      let el = document.querySelector(
        `meta[${attribute}='${attrValue}']`,
      ) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attribute, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMetaContent("", "name", "description", description);
    setMetaContent("", "property", "og:title", ogTitle ?? title);
    setMetaContent("", "property", "og:description", ogDescription ?? description);

    const twitterTitle = document.querySelector(
      "meta[name='twitter:title']",
    ) as HTMLMetaElement | null;
    if (twitterTitle && (ogTitle ?? title)) {
      twitterTitle.setAttribute("content", ogTitle ?? title);
    }

    const twitterDesc = document.querySelector(
      "meta[name='twitter:description']",
    ) as HTMLMetaElement | null;
    if (twitterDesc && (ogDescription ?? description)) {
      twitterDesc.setAttribute("content", ogDescription ?? description ?? "");
    }
  }, [title, description, ogTitle, ogDescription]);

  useEffect(() => {
    const existing = document.querySelectorAll(
      "link[data-aodit-hreflang='true']",
    );
    existing.forEach((el) => el.remove());

    if (!hreflangAlternates?.length) return;

    hreflangAlternates.forEach(({ hreflang, href }) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = hreflang;
      link.href = href;
      link.setAttribute("data-aodit-hreflang", "true");
      document.head.appendChild(link);
    });

    return () => {
      document
        .querySelectorAll("link[data-aodit-hreflang='true']")
        .forEach((el) => el.remove());
    };
  }, [hreflangAlternates]);

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

        <Footer />
      </Container>
    </>
  );
};

export default Page;
