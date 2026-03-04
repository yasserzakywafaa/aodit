import { Fab, Zoom } from "@mui/material";
import { useEffect, useState } from "react";

import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { buttonStyle } from "src/application/shared/themes";
import { scrollToTop } from "src/shared/utils/scrollTo";
import useDetectScroll from "src/shared/hooks/useDetectScroll";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isScrolledFromTop } = useDetectScroll();

  const toggleVisibility = () => {
    setIsVisible(isScrolledFromTop);
  };

  useEffect(() => {
    toggleVisibility();
  }, [isScrolledFromTop]);

  return (
    <Zoom in={isVisible}>
      <Fab
        size="small"
        color="primary"
        onClick={scrollToTop}
        aria-label="scroll back to top"
        sx={{
          position: "fixed",
          bottom: (theme) => theme.spacing(6),
          right: (theme) => theme.spacing(4),
          ...buttonStyle,
        }}
      >
        <KeyboardArrowUpIcon />
      </Fab>
    </Zoom>
  );
};

export default ScrollToTopButton;
