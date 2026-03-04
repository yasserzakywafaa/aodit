import { useEffect, useState } from "react";

export interface UseDetectScrollResult {
  scrollY: number;
  isScrolledFromTop: boolean;
}

const useDetectScroll = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const [isScrolledFromTop, setIsScrolledFromTop] = useState<boolean>(false);

  const handleSetScrollY = () => {
    if (window.scrollY > 200) {
      setIsScrolledFromTop(true);
    } else {
      setIsScrolledFromTop(false);
    }

    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleSetScrollY);
    return () => {
      window.removeEventListener("scroll", handleSetScrollY);
    };
  }, []);

  return {
    scrollY,
    isScrolledFromTop,
  };
};

export default useDetectScroll;
