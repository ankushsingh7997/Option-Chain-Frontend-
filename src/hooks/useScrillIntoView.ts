import { useEffect, RefObject } from "react";

const useScrollIntoViewOnVisible = (containerRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const isVisible = (element: HTMLElement): boolean => {
      const rect = element.getBoundingClientRect();
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;

      return rect.top >= 0 && rect.bottom <= viewportHeight;
    };

    const handleScroll = () => {
      if (container && !isVisible(container)) {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef]);
};

export default useScrollIntoViewOnVisible;
