import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackGa4PageView } from "src/shared/utils/ga4";

const Ga4PageView = () => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    trackGa4PageView({
      page_path: location.pathname + location.search,
      page_title: document.title,
      page_location: window.location.href,
    });
  }, [location.pathname, location.search]);

  return null;
};

export default Ga4PageView;
