import { RefObject, useEffect } from "react";

interface Options {
  axis: "x" | "y";
  navbarHeight?: number;
  paddingBuffer?: number;
}

export function useScaleToFit<T extends HTMLElement>(
  ref: RefObject<T | null>,
  { axis, navbarHeight = 64, paddingBuffer = 32 }: Options
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      if (window.innerWidth < 1024) {
        el.style.transform = "";
        return;
      }

      el.style.transform = "none";
      void el.offsetWidth;

      let scale: number;

      if (axis === "y") {
        const naturalHeight = el.scrollHeight;
        const outer = el.parentElement as HTMLElement;
        const outerStyles = window.getComputedStyle(outer);
        const paddingTop = parseFloat(outerStyles.paddingTop);
        const paddingBottom = parseFloat(outerStyles.paddingBottom);
        const available = window.innerHeight - navbarHeight - paddingTop - paddingBottom - paddingBuffer;
        scale = Math.min(0.95, available / naturalHeight);
        el.style.transformOrigin = "center center";
      } else {
        const rect = el.getBoundingClientRect();
        let maxRight = rect.left;
        for (const child of Array.from(el.children)) {
          const childRect = child.getBoundingClientRect();
          if (childRect.right > maxRight) maxRight = childRect.right;
        }
        const contentWidth = maxRight - rect.left;
        const available = rect.width;
        scale = Math.min(0.95, available / contentWidth);
        el.style.transformOrigin = "top left";
      }

      el.style.transform = `scale(${scale})`;
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref, axis, navbarHeight, paddingBuffer]);
}
