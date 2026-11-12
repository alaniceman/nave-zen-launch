import { MessageCircle } from "lucide-react";
import { trackConversion } from "@/lib/gtagConversions";

const PHONE = "56946120426";

type Props = {
  /** Pre-filled WhatsApp message. */
  message?: string;
  /** Raise the button above the festival page's fixed mobile bottom bar. */
  aboveBottomBar?: boolean;
};

/** Floating WhatsApp button (same style as the Nave Studio one, no AI option). */
export function IcefestWhatsAppFab({
  message = "Hola, tengo una consulta sobre Icefest Santiago",
  aboveBottomBar = false,
}: Props) {
  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      onClick={() => trackConversion("whatsapp_click")}
      className={`fixed right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg hover:bg-[#128c7e] hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-hidden focus:ring-4 focus:ring-[#25d366]/30 ${
        aboveBottomBar ? "bottom-24 sm:bottom-6" : "bottom-6"
      }`}
    >
      <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
    </a>
  );
}
