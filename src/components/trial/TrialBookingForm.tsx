import { useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { type ClassItem, dayNames } from "@/data/schedule";

const formSchema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().regex(/^\+?[0-9]{8,15}$/, "Número inválido (ej: 912345678)")
});

type FormValues = z.infer<typeof formSchema>;

interface TrialBookingFormProps {
  classItem: ClassItem;
  dayKey: string;
  selectedDate: string;
  onBack: () => void;
  onAlreadyAttended: () => void;
  onSuccess: () => void;
}

export default function TrialBookingForm({
  classItem,
  dayKey,
  selectedDate,
  onBack,
  onAlreadyAttended,
  onSuccess
}: TrialBookingFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "" }
  });

  // Read UTM params from URL
  const getUtmParams = () => {
    const p = new URLSearchParams(window.location.search);
    return {
      utm_source: p.get("utm_source") || undefined,
      utm_medium: p.get("utm_medium") || undefined,
      utm_campaign: p.get("utm_campaign") || undefined,
    };
  };

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const utm = getUtmParams();
      const { data, error } = await supabase.functions.invoke("book-trial-class", {
        body: {
          customerName: values.name,
          customerEmail: values.email,
          customerPhone: values.phone,
          classTitle: classItem.title,
          dayKey,
          time: classItem.time,
          selectedDate,
          ...utm
        }
      });

      if (error) throw error;

      if (data?.alreadyAttended) {
        onAlreadyAttended();
        return;
      }

      onSuccess();
    } catch (err) {
      console.error("Booking error:", err);
      form.setError("root", { message: "Error al agendar. Intenta de nuevo." });
    } finally {
      setSubmitting(false);
    }
  };

  // Format the selected date for display
  const displayDate = new Date(selectedDate + "T12:00:00").toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Santiago"
  });

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <button onClick={onBack} className="flex items-center gap-2 text-[#2E4D3A] font-medium mb-6 hover:underline">
        <ArrowLeft className="w-5 h-5" />
        Volver
      </button>

      {/* Summary */}
      <div className="bg-[#F8F9FA] rounded-xl p-4 mb-6 border border-[#E2E8F0]">
        <p className="font-semibold text-[#2E4D3A]">{classItem.title}</p>
        <p className="text-sm text-[#575757] capitalize">{displayDate} · {classItem.time} hrs</p>
      </div>

      <h2 className="text-xl font-bold text-[#2E4D3A] mb-6">Tus datos</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#2E4D3A]">Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Tu nombre completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#2E4D3A]">Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="tu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#2E4D3A]">Celular</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="912345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <p className="text-sm text-red-600 font-medium">{form.formState.errors.root.message}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#2E4D3A] text-white font-semibold py-4 rounded-xl text-lg hover:bg-[#2E4D3A]/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
            Confirmar clase de prueba
          </button>
        </form>
      </Form>
    </div>
  );
}
