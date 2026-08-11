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
    // bottom-6 + pr-[5.25rem] alinea el CTA con el botón flotante de WhatsApp (right-6, 56px)
    <div className="fixed bottom-6 inset-x-0 z-40 md:hidden px-4 pr-[5.25rem] pointer-events-none">
      <div className="flex items-center">
        <Link
          to={to}
          className="pointer-events-auto flex-1 h-14 flex items-center justify-center text-center bg-accent hover:bg-accent/90 text-white font-inter font-semibold rounded-full shadow-lg transition-all duration-200 active:scale-95"
        >
          {label}
        </Link>
      </div>
    </div>
  );
};
