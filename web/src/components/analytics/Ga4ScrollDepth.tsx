import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "src/shared/utils/ga4";

const SCROLL_MILESTONES = [25, 50, 75, 100] as const;

const Ga4ScrollDepth = () => {
  const location = useLocation();
  const firedMilestones = useRef<Set<number>>(new Set());

  useEffect(() => {
    firedMilestones.current = new Set();
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 0) return;

      const scrollPercent = Math.round((window.scrollY / maxScroll) * 100);

      for (const milestone of SCROLL_MILESTONES) {
        if (
          scrollPercent >= milestone &&
          !firedMilestones.current.has(milestone)
        ) {
          firedMilestones.current.add(milestone);
          trackEvent("scroll_depth", {
            percent: milestone,
            page_path: location.pathname + location.search,
          });
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname, location.search]);

  return null;
};

export default Ga4ScrollDepth;
