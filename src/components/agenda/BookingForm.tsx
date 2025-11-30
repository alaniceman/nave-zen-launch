import { useState } from "react";
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
  email: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");
  
  // Session code state
  const [sessionCode, setSessionCode] = useState("");
  const [isValidatingSessionCode, setIsValidatingSessionCode] = useState(false);
  const [appliedSessionCode, setAppliedSessionCode] = useState<any>(null);
  const [sessionCodeError, setSessionCodeError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Ingresa un código de cupón");
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError("");

    try {
      const { data: coupon, error } = await supabase
        .from("discount_coupons")
        .select("*")
        .eq("code", couponCode.toUpperCase())
        .eq("is_active", true)
        .single();

      if (error || !coupon) {
        setCouponError("Cupón no válido");
        setIsValidatingCoupon(false);
        return;
      }

      // Validar fecha
      const now = new Date();
      const validFrom = new Date(coupon.valid_from);
      const validUntil = coupon.valid_until ? new Date(coupon.valid_until) : null;

      if (now < validFrom) {
        setCouponError("Este cupón aún no es válido");
        setIsValidatingCoupon(false);
        return;
      }

      if (validUntil && now > validUntil) {
        setCouponError("Este cupón ha expirado");
        setIsValidatingCoupon(false);
        return;
      }

      // Validar usos
      if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
        setCouponError("Este cupón ya no tiene usos disponibles");
        setIsValidatingCoupon(false);
        return;
      }

      // Validar monto mínimo
      if (coupon.min_purchase_amount > service.price_clp) {
        setCouponError(
          `Este cupón requiere una compra mínima de $${coupon.min_purchase_amount.toLocaleString("es-CL")}`
        );
        setIsValidatingCoupon(false);
        return;
      }

      setAppliedCoupon(coupon);
      toast.success("¡Cupón aplicado!");
    } catch (error) {
      setCouponError("Error al validar el cupón");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const validateSessionCode = async () => {
    if (!sessionCode.trim()) {
      setSessionCodeError("Ingresa un código de sesión");
      return;
    }

    setIsValidatingSessionCode(true);
    setSessionCodeError("");

    try {
      const { data: result, error } = await supabase.functions.invoke("validate-session-code", {
        body: {
          code: sessionCode,
          serviceId: service.id,
        },
      });

      if (error || !result.valid) {
        setSessionCodeError(result?.error || "Código no válido");
        setIsValidatingSessionCode(false);
        return;
      }

      setAppliedSessionCode(result);
      // Remove coupon if session code is applied
      if (appliedCoupon) {
        removeCoupon();
      }
      toast.success("¡Código de sesión aplicado! Tu sesión está prepagada");
    } catch (error) {
      setSessionCodeError("Error al validar el código");
    } finally {
      setIsValidatingSessionCode(false);
    }
  };

  const removeSessionCode = () => {
    setAppliedSessionCode(null);
    setSessionCode("");
    setSessionCodeError("");
  };

  const calculateDiscount = () => {
    if (!appliedCoupon || appliedSessionCode) return 0;
    
    if (appliedCoupon.discount_type === "percentage") {
      return Math.floor((service.price_clp * appliedCoupon.discount_value) / 100);
    }
    return appliedCoupon.discount_value;
  };

  const finalPrice = appliedSessionCode ? 0 : service.price_clp - calculateDiscount();

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke("create-booking", {
        body: {
          professionalId: timeSlot.professionalId,
          serviceId: service.id,
          dateTimeStart: timeSlot.dateTimeStart,
          couponCode: appliedCoupon?.code || null,
          sessionCode: appliedSessionCode?.code || null,
          ...data,
        },
      });

      if (error) {
        throw new Error(error.message || "Error al crear la reserva");
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
              {appliedSessionCode ? (
                <span className="text-green-600 font-bold">PREPAGADO ✓</span>
              ) : appliedCoupon ? (
                <>
                  <span className="text-muted-foreground line-through mr-2">
                    ${service.price_clp.toLocaleString("es-CL")}
                  </span>
                  <span className="text-green-600">
                    ${finalPrice.toLocaleString("es-CL")} CLP
                  </span>
                </>
              ) : (
                <span>${service.price_clp.toLocaleString("es-CL")} CLP</span>
              )}
            </span>
          </div>
          {appliedSessionCode ? (
            <p className="text-sm text-green-600 ml-7">
              Código de sesión aplicado
            </p>
          ) : appliedCoupon ? (
            <p className="text-sm text-green-600 ml-7">
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

      {/* Session Code Section */}
      <div className="bg-primary/5 rounded-lg border border-primary/20 p-4 mb-4">
        <Label className="flex items-center gap-2 mb-3 text-primary">
          <Tag className="h-4 w-4" />
          ¿Tienes un código de sesión prepagado?
        </Label>
        
        {appliedSessionCode ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <span className="font-mono font-bold text-green-700">
                  {appliedSessionCode.code}
                </span>
                <p className="text-sm text-green-600">
                  Sesión prepagada - No requiere pago adicional
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeSessionCode}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={sessionCode}
                onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                placeholder="CODIGO123"
                disabled={isSubmitting || isValidatingSessionCode || !!appliedCoupon}
                className="font-mono uppercase"
              />
              <Button
                type="button"
                variant="default"
                onClick={validateSessionCode}
                disabled={isSubmitting || isValidatingSessionCode || !sessionCode.trim() || !!appliedCoupon}
              >
                {isValidatingSessionCode ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Validar"
                )}
              </Button>
            </div>
            {sessionCodeError && (
              <p className="text-sm text-destructive">{sessionCodeError}</p>
            )}
            {appliedCoupon && (
              <p className="text-xs text-muted-foreground">
                No puedes usar código de sesión y cupón de descuento al mismo tiempo
              </p>
            )}
          </div>
        )}
      </div>

      {/* Coupon Section */}
      {!appliedSessionCode && (
        <div className="bg-background rounded-lg border p-4 mb-6">
          <Label className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4" />
            ¿Tienes un cupón de descuento?
          </Label>
        
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <div>
                <span className="font-mono font-bold text-green-700">
                  {appliedCoupon.code}
                </span>
                <p className="text-sm text-green-600">
                  {appliedCoupon.discount_type === "percentage"
                    ? `${appliedCoupon.discount_value}% de descuento`
                    : `$${appliedCoupon.discount_value.toLocaleString("es-CL")} de descuento`}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeCoupon}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="CODIGO"
                disabled={isSubmitting || isValidatingCoupon}
                className="font-mono uppercase"
              />
              <Button
                type="button"
                variant="outline"
                onClick={validateCoupon}
                disabled={isSubmitting || isValidatingCoupon || !couponCode.trim()}
              >
                {isValidatingCoupon ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Aplicar"
                )}
              </Button>
            </div>
            {couponError && (
              <p className="text-sm text-destructive">{couponError}</p>
            )}
          </div>
        )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            ) : appliedSessionCode ? (
              "Confirmar sesión prepagada"
            ) : (
              "Agendar y pagar"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}