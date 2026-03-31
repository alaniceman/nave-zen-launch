import { MessageCircle, Bot, X } from "lucide-react";
import { useState } from "react";

interface WhatsAppWidgetProps {
  onOpenChat?: () => void;
}

const WhatsAppWidget = ({ onOpenChat }: WhatsAppWidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleWhatsAppClick = () => {
    const phoneNumber = "56946120426";
    const message = "¡Hola! Me interesa conocer más sobre las clases en Nave Studio";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setIsExpanded(false);
  };

  const handleAIClick = () => {
    onOpenChat?.();
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Expanded options */}
      {isExpanded && (
        <div className="flex flex-col gap-2 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* AI option */}
          <button
            onClick={handleAIClick}
            className="flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 whitespace-nowrap"
          >
            <Bot className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Preguntarle a Nave AI</span>
          </button>

          {/* WhatsApp option */}
          <button
            onClick={handleWhatsAppClick}
            className="flex items-center gap-3 bg-[#25d366] hover:bg-[#128c7e] text-white pl-4 pr-5 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 whitespace-nowrap"
          >
            <MessageCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Hablar con un humano</span>
          </button>
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`${
          isExpanded
            ? "bg-gray-700 hover:bg-gray-800"
            : "bg-[#25d366] hover:bg-[#128c7e]"
        } text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#25d366]/30`}
        aria-label={isExpanded ? "Cerrar menú" : "Abrir menú de contacto"}
      >
        {isExpanded ? (
          <X className="w-6 h-6 md:w-7 md:h-7" />
        ) : (
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
        )}
      </button>
    </div>
  );
};

export { WhatsAppWidget };
