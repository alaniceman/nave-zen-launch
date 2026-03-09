import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { es } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Clock, User, DollarSign, Tag, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { UpsellModal } from "./UpsellModal";

const bookingSchema = z.object({
  customerName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  customerEmail: z.string().email("Email inválido").max(255),
  customerPhone: z.string().min(8, "Teléfono inválido").max(20),
  customerComments: z.string().max(500).optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface TimeSlot {
  dateTimeStart: string;
  dateTimeEnd: string;
  professionalId: string;
  professionalName: string;
}

interface Professional {
  id: string;
  name: string;
  email?: string; // Optional - not returned by public API for privacy
}

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price_clp: number;
  description: string;
}

interface BookingFormProps {
  timeSlot: TimeSlot;
  professional: Professional;
  service: Service;
  onBack: () => void;
}

export function BookingForm({ timeSlot, professional, service, onBack }: BookingFormProps) {
  const { user, profile, customer } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<BookingFormData | null>(null);
  
  // Unified code state
  const [codeInput, setCodeInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [codeError, setCodeError] = useState("");
  const [appliedCode, setAppliedCode] = useState<{
    type: "session" | "coupon";
    data: any;
  } | null>(null);

  // Determine autofill values from auth
  const autofillName = profile?.full_name ?? customer?.name ?? "";
  const autofillEmail = user?.email ?? "";
  const autofillPhone = profile?.phone ?? customer?.phone ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: autofillName,
      customerEmail: autofillEmail,
      customerPhone: autofillPhone,
    },
  });

  useEffect(() => {
    if (autofillName) setValue("customerName", autofillName);
    if (autofillEmail) setValue("customerEmail", autofillEmail);
    if (autofillPhone) setValue("customerPhone", autofillPhone);
  }, [autofillName, autofillEmail, autofillPhone, setValue]);

  const validateCode = async () => {
    if (!codeInput.trim()) {
      setCodeError("Ingresa un código");
      return;
    }

    setIsValidating(true);
    setCodeError("");

    try {
      // 1. PRIMERO: Intentar como código de sesión
      const { data: sessionResult, error: sessionError } = await supabase.functions.invoke(
        "validate-session-code",
        {
          body: { code: codeInput.toUpperCase(), serviceId: service.id },
        }
      );

      if (!sessionError && sessionResult?.valid) {
        setAppliedCode({ type: "session", data: sessionResult });
        toast.success("¡Código de sesión aplicado! Tu sesión está prepagada");
        setIsValidating(false);
        return;
      }

      // 2. SEGUNDO: Intentar como cupón de descuento
      const { data: couponResult, error: couponError } = await supabase.functions.invoke(
        "validate-coupon",
        {
          body: {
            code: codeInput.toUpperCase(),
            serviceId: service.id,
            purchaseAmount: service.price_clp,
          },
        }
      );

      if (!couponError && couponResult?.valid) {
        setAppliedCode({ type: "coupon", data: couponResult.coupon });
        toast.success("¡Cupón de descuento aplicado!");
        setIsValidating(false);
        return;
      }

      // 3. Ninguno encontrado
      setCodeError("Código no válido");
    } catch (error) {
      console.error("Error validating code:", error);
      setCodeError("Error al validar el código");
    } finally {
      setIsValidating(false);
    }
  };

  const removeCode = () => {
    setAppliedCode(null);
    setCodeInput("");
    setCodeError("");
  };

  const calculateDiscount = () => {
    if (!appliedCode || appliedCode.type === "session") return 0;
    
    const coupon = appliedCode.data;
    if (coupon.discount_type === "percentage") {
      return Math.floor((service.price_clp * coupon.discount_value) / 100);
    }
    return coupon.discount_value;
  };

  const finalPrice = appliedCode?.type === "session" ? 0 : service.price_clp - calculateDiscount();

  // Check if upsell should be shown (no code applied and service has packages)
  const shouldShowUpsell = !appliedCode;

  const handleFormSubmit = async (data: BookingFormData) => {
    // If no code is applied, show upsell modal first
    if (shouldShowUpsell) {
      setPendingFormData(data);
      setShowUpsellModal(true);
      return;
    }

    // Otherwise proceed with booking
    await processBooking(data);
  };

  const processBooking = async (data: BookingFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke("create-booking", {
        body: {
          professionalId: timeSlot.professionalId,
          serviceId: service.id,
          dateTimeStart: timeSlot.dateTimeStart,
          couponCode: appliedCode?.type === "coupon" ? appliedCode.data.code : null,
          sessionCode: appliedCode?.type === "session" ? appliedCode.data.code : null,
          ...data,
        },
      });

      if (error) {
        let backendErrorMessage = error.message || "Error al crear la reserva";

        try {
          const errorContext = (error as any)?.context;
          if (errorContext && typeof errorContext.json === "function") {
            const payload = await errorContext.json();
            backendErrorMessage = payload?.error || payload?.message || backendErrorMessage;
          }
        } catch (parseError) {
          console.error("Could not parse booking error response:", parseError);
        }

        throw new Error(backendErrorMessage);
      }

      // If confirmed (prepaid with session code), redirect to success page
      if (result.confirmed) {
        toast.success("¡Sesión confirmada!");
        window.location.href = "/agenda-nave-studio/success";
        return;
      }

      // Redirect to Mercado Pago
      if (result.initPoint) {
        window.location.href = result.initPoint;
      } else {
        throw new Error("No se pudo generar el link de pago");
      }
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error(error.message || "Error al agendar la sesión");
      setIsSubmitting(false);
    }
  };

  const handleContinueSingle = () => {
    setShowUpsellModal(false);
    if (pendingFormData) {
      processBooking(pendingFormData);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Completa tus datos</h2>

      {/* Summary */}
      <div className="bg-muted/50 rounded-lg p-5 mb-6 space-y-4">
        {/* Service Title */}
        <div>
          <h3 className="text-xl font-bold mb-1">{service.name}</h3>
          <p className="text-sm text-muted-foreground">{service.description}</p>
        </div>

        {/* Price */}
        <div className="border-t pt-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg font-semibold">
              {appliedCode?.type === "session" ? (
                <span className="text-primary font-bold">PREPAGADO ✓</span>
              ) : appliedCode?.type === "coupon" ? (
                <>
                  <span className="text-muted-foreground line-through mr-2">
                    ${service.price_clp.toLocaleString("es-CL")}
                  </span>
                  <span className="text-primary">
                    ${finalPrice.toLocaleString("es-CL")} CLP
                  </span>
                </>
              ) : (
                <span>${service.price_clp.toLocaleString("es-CL")} CLP</span>
              )}
            </span>
          </div>
          {appliedCode?.type === "session" ? (
            <p className="text-sm text-primary ml-7">
              Código de sesión aplicado
            </p>
          ) : appliedCode?.type === "coupon" ? (
            <p className="text-sm text-primary ml-7">
              Ahorro: ${calculateDiscount().toLocaleString("es-CL")}
            </p>
          ) : null}
        </div>

        {/* Schedule Details */}
        <div className="border-t pt-3 space-y-2">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatInTimeZone(parseISO(timeSlot.dateTimeStart), "America/Santiago", "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatInTimeZone(parseISO(timeSlot.dateTimeStart), "America/Santiago", "HH:mm")} - {formatInTimeZone(parseISO(timeSlot.dateTimeEnd), "America/Santiago", "HH:mm")}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{professional.name}</span>
          </div>
        </div>
      </div>

      {/* Unified Code Section */}
      <div className="bg-primary/5 rounded-lg border border-primary/20 p-4 mb-6">
        <Label className="flex items-center gap-2 mb-3 text-primary">
          <Tag className="h-4 w-4" />
          ¿Tienes un código de descuento o sesión prepagada?
        </Label>
        
        {appliedCode ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <span className="font-mono font-bold text-green-700">
                  {appliedCode.type === "session" ? appliedCode.data.code : appliedCode.data.code}
                </span>
                <p className="text-sm text-green-600">
                  {appliedCode.type === "session" 
                    ? "Sesión prepagada - No requiere pago adicional"
                    : appliedCode.data.discount_type === "percentage"
                      ? `${appliedCode.data.discount_value}% de descuento`
                      : `$${appliedCode.data.discount_value.toLocaleString("es-CL")} de descuento`
                  }
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeCode}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                placeholder="CODIGO"
                disabled={isSubmitting || isValidating}
                className="font-mono uppercase"
              />
              <Button
                type="button"
                variant="default"
                onClick={validateCode}
                disabled={isSubmitting || isValidating || !codeInput.trim()}
              >
                {isValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Aplicar"
                )}
              </Button>
            </div>
            {codeError && (
              <p className="text-sm text-destructive">{codeError}</p>
            )}
            
            {/* Link a bonos */}
            <p className="text-xs text-muted-foreground mt-2">
              💡 Compra varias sesiones con descuento{" "}
              <a href="/bonos" className="text-primary underline hover:no-underline font-medium" target="_blank" rel="noopener noreferrer">
                acá
              </a>
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="customerName">Nombre completo *</Label>
          <Input
            id="customerName"
            {...register("customerName")}
            placeholder="Juan Pérez"
            disabled={isSubmitting}
          />
          {errors.customerName && (
            <p className="text-sm text-destructive mt-1">{errors.customerName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="customerEmail">Email *</Label>
          <Input
            id="customerEmail"
            type="email"
            {...register("customerEmail")}
            placeholder="juan@ejemplo.com"
            disabled={isSubmitting}
          />
          {errors.customerEmail && (
            <p className="text-sm text-destructive mt-1">{errors.customerEmail.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="customerPhone">Celular *</Label>
          <Input
            id="customerPhone"
            {...register("customerPhone")}
            placeholder="+56912345678"
            disabled={isSubmitting}
          />
          {errors.customerPhone && (
            <p className="text-sm text-destructive mt-1">{errors.customerPhone.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="customerComments">Comentarios (opcional)</Label>
          <Textarea
            id="customerComments"
            {...register("customerComments")}
            placeholder="¿Algo que debamos saber?"
            disabled={isSubmitting}
            rows={3}
          />
          {errors.customerComments && (
            <p className="text-sm text-destructive mt-1">{errors.customerComments.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
            className="flex-1"
          >
            Volver
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Procesando...
              </>
            ) : appliedCode?.type === "session" ? (
              "Confirmar sesión prepagada"
            ) : (
              "Agendar y pagar"
            )}
          </Button>
        </div>
      </form>

      {/* Upsell Modal */}
      <UpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        onSelectPackage={(pkg) => {
          // Package purchase is handled inside the modal
        }}
        onContinueSingle={handleContinueSingle}
        serviceId={service.id}
        singleSessionPrice={service.price_clp}
        customerData={{
          name: pendingFormData?.customerName || "",
          email: pendingFormData?.customerEmail || "",
          phone: pendingFormData?.customerPhone || "",
        }}
      />
    </Card>
  );
}