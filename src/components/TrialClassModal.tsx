import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface TrialClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrialClassModal = ({ isOpen, onClose }: TrialClassModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus the modal
      modalRef.current?.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
        
        // Restore focus
        if (previousFocusRef.current) {
          previousFocusRef.current.focus();
        }
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFocusTrap = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={modalRef}
        className="bg-white text-primary rounded-2xl shadow-xl flex flex-col w-full max-w-4xl h-[90vh] md:h-[80vh] focus:outline-none"
        tabIndex={-1}
        onKeyDown={handleFocusTrap}
        aria-labelledby="trial-modal-title"
        aria-describedby="trial-modal-description"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-black/10 flex justify-between items-center">
          <h2 id="trial-modal-title" className="text-xl font-bold text-primary font-space">
            Clase de prueba (Yoga o Respiración Wim Hof)
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle */}
        <div className="px-5 pt-2 pb-4">
          <p id="trial-modal-description" className="text-sm text-muted-foreground font-inter">
            Para conocer la Nave puedes tomar una clase de <strong>Yoga</strong> (Yin · Yang · Integral) o una sesión de <strong>Respiración Wim Hof</strong>. El <strong>Ice Bath es opcional</strong> y solo está disponible si ya completaste previamente el <strong>Método Wim Hof</strong>.
          </p>
        </div>

        {/* Body - iframe */}
        <div className="px-0 flex-1 overflow-hidden">
          <iframe
            src="https://boxmagic.cl/sp/NaveStudio"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            scrolling="yes"
            loading="lazy"
            allow="fullscreen"
            referrerPolicy="no-referrer-when-downgrade"
            title="Formulario de clase de prueba"
          >
            Cargando información…
          </iframe>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 flex flex-col md:flex-row gap-3 md:justify-between items-center border-t border-black/10">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <a
              href="https://boxmagic.cl/sp/NaveStudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:text-primary underline-offset-4 hover:underline transition-colors"
            >
              Si no ves el formulario, ábrelo aquí
            </a>
            <a
              href="https://wa.me/56985273088"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-white rounded-lg py-2.5 px-5 hover:bg-primary transition-colors text-sm font-medium"
            >
              Prefiero WhatsApp
            </a>
          </div>
          <button
            onClick={onClose}
            className="border-2 border-accent text-accent rounded-lg py-2.5 px-5 hover:bg-accent hover:text-white transition-colors text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};