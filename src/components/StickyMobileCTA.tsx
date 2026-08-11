import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

type StickyMobileCTAProps = {
  /** Texto del botón principal */
  label?: string;
  /** Destino del botón principal */
  to?: string;
};

export const StickyMobileCTA = ({
  label = "Plan de prueba desde $9.900",
  to = "/plan-de-prueba",
}: StickyMobileCTAProps = {}) => {
  const [visible, setVisible] = useState(true);

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
      {/* pr-16 deja libre la esquina del botón flotante de WhatsApp */}
      <div className="flex items-center pr-16">
        <Link
          to={to}
          className="pointer-events-auto flex-1 text-center bg-accent hover:bg-accent/90 text-white font-inter font-semibold py-3.5 rounded-full shadow-lg transition-all duration-200 active:scale-95"
        >
          {label}
        </Link>
      </div>
    </div>
  );
};
