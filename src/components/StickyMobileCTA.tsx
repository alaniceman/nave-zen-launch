import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export const StickyMobileCTA = () => {
  const [visible, setVisible] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden p-3 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <Link
        to="/clase-de-prueba/agendar"
        className="pointer-events-auto block w-full text-center bg-accent hover:bg-accent/90 text-white font-inter font-semibold py-3.5 rounded-full shadow-lg transition-all duration-200 active:scale-95"
      >
        Clase de prueba gratis
      </Link>
    </div>
  );
};
