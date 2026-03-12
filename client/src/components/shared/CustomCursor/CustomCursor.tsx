import { useEffect, useRef } from "react";

import { primaryColor } from "src/application/shared/themes";

const CURSOR_SIZE = 8;
const RING_SIZE = 32;
const LERP = 0.12;
const HOVER_SCALE = 3;

const hoverSelectors =
  "button, a, [role='button'], .report-card, .nav-link, .MuiButton-root, .MuiMenuItem-root, .MuiLink-root, [data-cursor-hover]";

// Elements over which the cursor gets contrast (invert) for visibility on both light and dark content
const contrastSelectors =
  `${hoverSelectors}, h1, h2, h3, h4, h5, h6, p, li, label, td, th`;

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mx = useRef(0);
  const my = useRef(0);
  const rx = useRef(0);
  const ry = useRef(0);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const handleMouseMove = (e: MouseEvent) => {
      mx.current = e.clientX;
      my.current = e.clientY;
      dot.style.left = `${mx.current - CURSOR_SIZE / 2}px`;
      dot.style.top = `${my.current - CURSOR_SIZE / 2}px`;
    };

    const applyContrast = (on: boolean) => {
      if (on) {
        dot.style.background = "#fff";
        dot.style.mixBlendMode = "difference";
        ring.style.borderColor = "#fff";
        ring.style.mixBlendMode = "difference";
      } else {
        dot.style.background = primaryColor;
        dot.style.mixBlendMode = "unset";
        ring.style.borderColor = primaryColor;
        ring.style.mixBlendMode = "unset";
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      const hoverable = target.closest?.(hoverSelectors);
      const overContrast = target.closest?.(contrastSelectors);
      if (hoverable) {
        dot.style.transform = `scale(${HOVER_SCALE})`;
      }
      if (overContrast) {
        applyContrast(true);
      }
    };
    const handleMouseOut = (e: MouseEvent) => {
      const related = (e as MouseEvent & { relatedTarget: Node }).relatedTarget;
      const fromHover = (e.target as Element).closest?.(hoverSelectors);
      const toHover = related && (related as Element).closest?.(hoverSelectors);
      const fromContrast = (e.target as Element).closest?.(contrastSelectors);
      const toContrast = related && (related as Element).closest?.(contrastSelectors);
      if (fromHover && !toHover) {
        dot.style.transform = "scale(1)";
      }
      if (fromContrast && !toContrast) {
        applyContrast(false);
      }
    };

    const animate = () => {
      rx.current += (mx.current - rx.current - RING_SIZE / 2) * LERP;
      ry.current += (my.current - ry.current - RING_SIZE / 2) * LERP;
      ring.style.left = `${rx.current}px`;
      ring.style.top = `${ry.current}px`;
      requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    document.body.style.cursor = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      <div
        className="custom-cursor-dot"
        ref={dotRef}
        aria-hidden
        style={{
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          background: primaryColor,
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "transform 0.15s ease, background 0.2s ease",
        }}
      />
      <div
        className="custom-cursor-ring"
        ref={ringRef}
        aria-hidden
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          border: `1px solid ${primaryColor}`,
          position: "fixed",
          pointerEvents: "none",
          zIndex: 9998,
          transition: "transform 0.1s ease, border-color 0.2s ease",
          opacity: 0.5,
        }}
      />
    </>
  );
};

export default CustomCursor;
