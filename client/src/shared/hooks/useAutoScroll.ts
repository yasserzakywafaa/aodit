import { useRef, useEffect, useCallback } from "react";

interface UseAutoScrollOptions {
  scrollContainerRef: React.RefObject<HTMLElement>; // Ref to the scrollable element
  scrollAmount: number; // How many pixels to scroll each time
  scrollIntervalMs?: number; // Interval between auto-scrolls
  pauseOnInteractionMs?: number; // How long to pause after manual interaction
  loop?: boolean; // Whether to loop back to the start
}

interface UseAutoScrollReturn {
  scrollNext: () => void;
  scrollPrev: () => void;
  pauseScroll: () => void;
  resumeScroll: () => void;
  handleInteraction: (scrollAction: () => void) => void;
}

const DEFAULT_SCROLL_INTERVAL_MS = 4000;
const DEFAULT_PAUSE_ON_INTERACTION_MS = 8000;

/**
 * Custom hook to manage auto-scrolling behavior for a horizontal container.
 * Handles auto-scroll interval, looping, pause on hover (via provided functions),
 * and pause on manual interaction (via handleInteraction).
 */
export const useAutoScroll = ({
  scrollContainerRef,
  scrollAmount,
  scrollIntervalMs = DEFAULT_SCROLL_INTERVAL_MS,
  pauseOnInteractionMs = DEFAULT_PAUSE_ON_INTERACTION_MS,
  loop = true,
}: UseAutoScrollOptions): UseAutoScrollReturn => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollNext = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    let newScrollLeft = container.scrollLeft + scrollAmount;

    // Loop back to the beginning if enabled and at the end
    // Add a small buffer (e.g., 10px) for rounding issues
    if (loop && container.scrollLeft + clientWidth >= scrollWidth - 10) {
      newScrollLeft = 0;
    } else {
      // Prevent scrolling beyond the actual end if not looping or calculation is off
      newScrollLeft = Math.min(newScrollLeft, scrollWidth - clientWidth);
    }

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  }, [scrollContainerRef, scrollAmount, loop]);

  const scrollPrev = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const newScrollLeft = Math.max(0, container.scrollLeft - scrollAmount);

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  }, [scrollContainerRef, scrollAmount]);

  // --- Auto-Scroll Management ---
  const stopAutoScroll = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
      interactionTimeoutRef.current = null;
    }
  }, []); // No dependencies needed

  const startAutoScroll = useCallback(
    (immediate = false) => {
      stopAutoScroll(); // Clear existing timers first
      if (immediate) {
        scrollNext();
      }
      intervalRef.current = setInterval(scrollNext, scrollIntervalMs);
    },
    [scrollNext, scrollIntervalMs, stopAutoScroll]
  );

  const pauseScroll = useCallback(() => {
    stopAutoScroll();
  }, [stopAutoScroll]);

  const resumeScroll = useCallback(() => {
    // Only resume if no interaction pause is currently active
    if (!interactionTimeoutRef.current) {
      startAutoScroll();
    }
  }, [startAutoScroll]); // interactionTimeoutRef is stable

  const handleInteraction = useCallback(
    (scrollAction: () => void) => {
      stopAutoScroll(); // Stop auto-scroll immediately
      scrollAction(); // Perform the manual scroll action provided

      // Set a timeout to restart auto-scroll after the pause duration
      interactionTimeoutRef.current = setTimeout(() => {
        interactionTimeoutRef.current = null; // Clear the ref once timeout finishes
        startAutoScroll();
      }, pauseOnInteractionMs);
    },
    [stopAutoScroll, startAutoScroll, pauseOnInteractionMs] // interactionTimeoutRef is stable
  );

  useEffect(() => {
    // Start scrolling when the hook mounts (or dependencies change)
    startAutoScroll();

    // Cleanup function to stop scrolling when the component unmounts
    return () => stopAutoScroll();
  }, [startAutoScroll, stopAutoScroll]); // Effect depends on the stable start/stop functions

  return {
    scrollNext,
    scrollPrev,
    pauseScroll,
    resumeScroll,
    handleInteraction,
  };
};
