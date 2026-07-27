import FeaturesPage from "./FeaturesPage";
import {
  getEffectiveRegion,
  parseRegionOverride,
  setRegionCookie,
} from "src/application/shared/regionContent";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Home route at `/` — region from ?region=, cookie, or default global.
 * Edge Middleware sets the cookie on Vercel; locally we rely on query + cookie.
 */
const FeaturesHomeRoute = () => {
  const { pathname, search } = useLocation();
  const region = getEffectiveRegion(pathname, search);

  useEffect(() => {
    const explicit = parseRegionOverride(
      new URLSearchParams(search).get("region"),
    );
    if (explicit) setRegionCookie(explicit);
  }, [search]);

  return <FeaturesPage region={region} />;
};

export default FeaturesHomeRoute;
