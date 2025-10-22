import { useEffect, useRef, useState } from "react";
import { X, Mail, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmailCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailCaptureModal = ({ isOpen, onClose }: EmailCaptureModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Email requerido",
        description: "Por favor ingresa tu email",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean WhatsApp number for submission (remove spaces, keep +56 prefix)
      const cleanWhatsApp = whatsapp.replace(/\s/g, "");
      
      const { data, error } = await supabase.functions.invoke("subscribe-mailerlite", {
        body: {
          email,
          whatsapp: whatsapp ? cleanWhatsApp : "",
          tags: ["Comunidad-Nave-Studio", "Modal-Capture"],
          groups: ["168517368312498017"], // Reemplaza con tu Group ID de MailerLite
          source: "email-capture-modal-community",
        },
      });

      if (error) throw error;

      // Store in localStorage to prevent showing again
      localStorage.setItem("email-capture-subscribed", "true");
      localStorage.setItem("email-capture-email", email);

      toast({
        title: "¡Bienvenido a la comunidad! 🎉",
        description: "Revisa tu email para confirmar tu suscripción",
      });

      // Close modal after short delay
      setTimeout(onClose, 2000);
    } catch (error) {
      toast({
        title: "Error al suscribirse",
        description: "Por favor intenta nuevamente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        className="bg-gradient-to-br from-background via-background to-muted/30 rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden animate-scale-in border border-border/50"
        tabIndex={-1}
        aria-labelledby="email-capture-title"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/20 to-transparent rounded-full translate-y-12 -translate-x-12" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-muted/50 rounded-full transition-colors z-10"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="relative p-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            ÚNETE A LA COMUNIDAD
          </div>

          {/* Title */}
          <h2 id="email-capture-title" className="text-2xl font-bold text-foreground mb-2 leading-tight">
            Únete a la Comunidad de Nave Studio
            <br />
            <span className="text-primary">Recibe inspiración, ciencia y bienestar en tu inbox 🧊</span>
          </h2>

          {/* Short description */}
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Descubre los beneficios del agua fría, la respiración y el movimiento.
            <br />
            Recibe información sobre clases, eventos, retiros y promociones exclusivas.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 border-border/50 focus:border-primary"
                aria-label="Tu email"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="Tu WhatsApp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="pl-10 h-12 border-border/50 focus:border-primary"
                aria-label="Tu WhatsApp"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
            >
              {isSubmitting ? "Suscribiendo..." : "Quiero recibir info y beneficios 💙"}
            </Button>
          </form>

          {/* Close button at bottom */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
