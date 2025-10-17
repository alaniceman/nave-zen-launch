import { useEffect, useRef, useState } from "react";
import { X, Mail, Phone, Clock, Sparkles } from "lucide-react";
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
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();

  // Calculate time left until end of September
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfSeptember = new Date(now.getFullYear(), 8, 30, 23, 59, 59); // September is month 8 (0-indexed)

      if (now > endOfSeptember) {
        // If we're past September, show next year's September
        endOfSeptember.setFullYear(endOfSeptember.getFullYear() + 1);
      }

      const difference = endOfSeptember.getTime() - now.getTime();
      return Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24))); // Days left
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(
      () => {
        setTimeLeft(calculateTimeLeft());
      },
      1000 * 60 * 60,
    ); // Update every hour

    return () => clearInterval(timer);
  }, []);

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

  const formatWhatsAppNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");

    // Don't add +56 if it already starts with 56
    if (digits.startsWith("56") && digits.length > 2) {
      const phoneNumber = digits.slice(2);
      if (phoneNumber.length <= 1) return `+56 ${phoneNumber}`;
      if (phoneNumber.length <= 5) return `+56 ${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1)}`;
      return `+56 ${phoneNumber.slice(0, 1)} ${phoneNumber.slice(1, 5)} ${phoneNumber.slice(5, 9)}`;
    }

    // Format as Chilean number
    if (digits.length <= 1) return digits;
    if (digits.length <= 5) return `+56 ${digits}`;
    if (digits.length <= 9) return `+56 ${digits.slice(0, 1)} ${digits.slice(1)}`;
    return `+56 ${digits.slice(0, 1)} ${digits.slice(1, 5)} ${digits.slice(5, 9)}`;
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsAppNumber(e.target.value);
    setWhatsapp(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !whatsapp) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa email y WhatsApp",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke("subscribe-mailerlite", {
        body: {
          email,
          whatsapp,
          tags: ["Oferta-Septiembre-2024", "Modal-Capture"],
          groups: ["168517368312498017"], // Reemplaza con tu Group ID de MailerLite
          source: "email-capture-modal",
        },
      });

      if (error) throw error;

      // Store in localStorage to prevent showing again
      localStorage.setItem("email-capture-subscribed", "true");
      localStorage.setItem("email-capture-email", email);

      toast({
        title: "¡Suscripción exitosa! 🎉",
        description: "Revisa tu email para confirmar y acceder a tu descuento",
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
            OFERTA EXCLUSIVA SEPTIEMBRE
          </div>

          {/* Title */}
          <h2 id="email-capture-title" className="text-2xl font-bold text-foreground mb-2 leading-tight">
            Membresía Ilimitada
            <br />
            <span className="text-primary">al precio de 2x semana</span>
          </h2>

          {/* Urgency */}
          <div className="flex items-center gap-2 text-muted-foreground mb-6">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{timeLeft > 0 ? `${timeLeft} días restantes` : "Últimas horas"}</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 border-border/50 focus:border-primary"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="+56 9 1234 5678"
                value={whatsapp}
                onChange={handleWhatsAppChange}
                className="pl-10 h-12 border-border/50 focus:border-primary"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
            >
              {isSubmitting ? "Suscribiendo..." : "Quiero mi descuento 🔥"}
            </Button>
          </form>

          {/* Benefits */}
          <div className="mt-6 pt-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground text-center">
              ✨ Acceso ilimitado a yoga
              <br />
              🧊 Método Wim Hof completo
              <br />
              💪 Solo por septiembre 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
