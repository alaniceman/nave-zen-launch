import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL = `https://wa.me/56946120426?text=${encodeURIComponent(
  "Hola! Quiero información sobre las clases de Nave Studio."
)}`;

type StickyMobileCTAProps = {
  /** Texto del botón principal */
  label?: string;
  /** Destino del botón principal */
  to?: string;
  /** Mensaje precargado de WhatsApp */
  whatsappMessage?: string;
};

export const StickyMobileCTA = ({
  label = "Plan de prueba desde $9.900",
  to = "/plan-de-prueba",
  whatsappMessage,
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

  const waUrl = whatsappMessage
    ? `https://wa.me/56946120426?text=${encodeURIComponent(whatsappMessage)}`
    : WHATSAPP_URL;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 md:hidden p-3 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <div className="flex items-center gap-2">
        <Link
          to={to}
          className="pointer-events-auto flex-1 text-center bg-accent hover:bg-accent/90 text-white font-inter font-semibold py-3.5 rounded-full shadow-lg transition-all duration-200 active:scale-95"
        >
          {label}
        </Link>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir por WhatsApp"
          className="pointer-events-auto flex-shrink-0 w-[52px] h-[52px] rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-200 active:scale-95"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};
