import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Returns false while the user is still looking at the hero (top of the page),
 * true once they scroll down. Used to keep floating bottom-bar buttons from
 * covering the hero CTAs.
 */
export function useScrolledPastHero(ratio = 0.55) {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const threshold = () => Math.max(160, window.innerHeight * ratio);

    const evaluate = () => setScrolled(window.scrollY > threshold());

    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    window.addEventListener("resize", evaluate);
    return () => {
      window.removeEventListener("scroll", evaluate);
      window.removeEventListener("resize", evaluate);
    };
  }, [ratio, pathname]);

  return scrolled;
}
