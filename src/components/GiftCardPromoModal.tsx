import { useEffect, useRef } from "react";
import { X, Gift, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface GiftCardPromoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GiftCardPromoModal = ({ isOpen, onClose }: GiftCardPromoModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
      document.body.style.overflow = "hidden";

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };

      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  const handleGoToGiftCards = () => {
    onClose();
    navigate("/giftcards");
  };

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-background via-background to-primary/10 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden animate-scale-in border border-primary/30"
        tabIndex={-1}
        aria-labelledby="giftcard-promo-title"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/30 to-transparent rounded-full -translate-y-20 translate-x-20" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent/30 to-transparent rounded-full translate-y-16 -translate-x-16" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted/50 rounded-full transition-colors z-10"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="relative p-8 text-center">
          {/* Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/30">
            <Gift className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 animate-pulse">
            <Sparkles className="w-4 h-4" />
            PROMO NAVIDAD 🎄
          </div>

          {/* Title */}
          <h2 id="giftcard-promo-title" className="text-2xl font-bold text-foreground mb-3 leading-tight">
            Regala una experiencia única
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-muted-foreground mb-4">
            Gift Cards Nave Studio
          </p>

          {/* Discount code */}
          <div className="bg-muted/50 border-2 border-dashed border-primary/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-muted-foreground mb-1">Usa el código</p>
            <p className="text-3xl font-bold text-primary tracking-wider">NAVIDAD</p>
            <p className="text-lg font-semibold text-foreground mt-1">
              y obtén un <span className="text-primary">25% de descuento</span>
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-6">
            Regala bienestar: sesiones de agua fría, yoga y más experiencias transformadoras.
          </p>

          {/* CTA Button */}
          <Button
            onClick={handleGoToGiftCards}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300 shadow-lg shadow-primary/30"
          >
            <Gift className="w-5 h-5 mr-2" />
            Ver Gift Cards
          </Button>

          {/* Close link */}
          <div className="mt-5">
            <button
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Quizás más tarde
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
