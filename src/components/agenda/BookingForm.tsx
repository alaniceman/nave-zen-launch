import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Clock, User, DollarSign } from "lucide-react";
import { toast } from "sonner";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professionalId: timeSlot.professionalId,
          serviceId: service.id,
          dateTimeStart: timeSlot.dateTimeStart,
          ...data,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al crear la reserva");
      }

      const result = await response.json();
      
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
      <div className="bg-muted/50 rounded-lg p-4 mb-6 space-y-3">
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {format(parseISO(timeSlot.dateTimeStart), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">
            {format(parseISO(timeSlot.dateTimeStart), "HH:mm")} - {format(parseISO(timeSlot.dateTimeEnd), "HH:mm")}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{professional.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <span className="font-medium">{service.name}</span>
            <span className="text-sm text-muted-foreground ml-2">
              ${service.price_clp.toLocaleString("es-CL")} CLP
            </span>
          </div>
        </div>
      </div>

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
            ) : (
              "Agendar y pagar"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}