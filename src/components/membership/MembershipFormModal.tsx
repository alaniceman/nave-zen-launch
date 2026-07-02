import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Check, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";

export type MembershipGroup = "completa" | "yoga";

export type MembershipOption = {
  code: string;
  label: string;
  price: string;
  boxmagicUrl: string;
};

export const MEMBERSHIP_OPTIONS: Record<MembershipGroup, MembershipOption[]> = {
  completa: [
    { code: "eclipse", label: "Eclipse — 1 sesión/sem",   price: "$59.000", boxmagicUrl: "https://boxmagic.cl/market/plan/AvLXQOM4EK" },
    { code: "orbita",  label: "Órbita — 2 sesiones/sem",  price: "$79.000", boxmagicUrl: "https://boxmagic.cl/market/plan_subscription/ev4VPzOD9A" },
    { code: "universo",label: "Universo — Ilimitado",     price: "$95.000", boxmagicUrl: "https://boxmagic.cl/market/plan_subscription/j80p5OdDW6" },
  ],
  yoga: [
    { code: "yoga_esencial", label: "Yoga Esencial — 1 clase/sem",  price: "$49.000", boxmagicUrl: "https://boxmagic.cl/market/plan/oGDPzoy4b5" },
    { code: "yoga_continuo", label: "Yoga Continuo — 2 clases/sem", price: "$69.000", boxmagicUrl: "https://boxmagic.cl/market/plan/XY0llrA0kV" },
    { code: "yoga_libre",    label: "Yoga Libre — Ilimitado",       price: "$85.000", boxmagicUrl: "https://boxmagic.cl/market/plan/rq4mapE4JZ" },
  ],
};

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  group: MembershipGroup;
  initialCode: string;
}

const step1Schema = z.object({
  name: z.string().trim().min(2, "Ingresa tu nombre").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().regex(/^\+?[0-9]{8,15}$/, "Número inválido (ej: 912345678)"),
});
type Step1Values = z.infer<typeof step1Schema>;

function getUtm() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") || undefined,
    utm_medium: p.get("utm_medium") || undefined,
    utm_campaign: p.get("utm_campaign") || undefined,
  };
}

export function MembershipFormModal({ open, onOpenChange, group, initialCode }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string>(initialCode);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<Step1Values | null>(null);
  const { trackEvent } = useFacebookPixel();

  const options = MEMBERSHIP_OPTIONS[group];
  const selected = options.find((o) => o.code === selectedCode) ?? options[0];

  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  useEffect(() => {
    if (open) {
      setStep(1);
      setSelectedCode(initialCode);
      setStartDate(undefined);
      setError(null);
      form.reset();
    }
  }, [open, initialCode, form]);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const max = new Date(); max.setDate(max.getDate() + 30); max.setHours(23, 59, 59, 999);

  const onSubmitStep1 = (values: Step1Values) => {
    setError(null);
    setUserInfo(values);
    trackEvent("membership_form_started", { plan_group: group, plan_code: selectedCode });
    setStep(2);
  };

  const onSubmitStep2 = async () => {
    if (!userInfo) { setStep(1); return; }
    if (!startDate) { setError("Selecciona una fecha de inicio"); return; }
    setSubmitting(true);
    setError(null);
    try {
      const startDateStr = format(startDate, "yyyy-MM-dd");
      const { data, error } = await supabase.functions.invoke("submit-membership-lead", {
        body: {
          name: userInfo.name,
          email: userInfo.email,
          phone: userInfo.phone,
          planCode: selected.code,
          planLabel: selected.label,
          planGroup: group,
          boxmagicUrl: selected.boxmagicUrl,
          startDate: startDateStr,
          ...getUtm(),
        },
      });
      if (error || !data?.boxmagicUrl) throw new Error(data?.error || "Error al confirmar");

      trackEvent("membership_form_completed", { plan_group: group, plan_code: selected.code });

      // Close & redirect via global RedirectModal (delegated [data-checkout-url])
      onOpenChange(false);
      requestAnimationFrame(() => {
        const trigger = document.createElement("a");
        trigger.href = data.boxmagicUrl;
        trigger.setAttribute("data-checkout-url", data.boxmagicUrl);
        trigger.setAttribute("data-plan", selected.label);
        trigger.style.display = "none";
        document.body.appendChild(trigger);
        trigger.click();
        document.body.removeChild(trigger);
      });
    } catch (e: any) {
      setError(e.message || "Error al confirmar");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-bold text-xl text-[#2E4D3A]">
            {step === 1 ? "Tus datos" : "Plan y fecha de inicio"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Paso 1 de 2 — completa tus datos para continuar."
              : "Paso 2 de 2 — confirma tu plan y elige cuándo empezar."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
            {error}
          </div>
        )}

        {step === 1 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitStep1)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl><Input placeholder="Tu nombre" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" placeholder="tu@email.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl><Input type="tel" placeholder="912345678" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button
                type="submit"
                className="w-full bg-[#2E4D3A] hover:bg-[#2E4D3A]/90 text-white py-6 text-base"
              >
                Continuar
              </Button>
            </form>
          </Form>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-[#2E4D3A] mb-2 block">Plan seleccionado</label>
              <div className="grid grid-cols-1 gap-2">
                {options.map((o) => (
                  <button
                    key={o.code}
                    type="button"
                    onClick={() => setSelectedCode(o.code)}
                    className={cn(
                      "border rounded-xl p-3 text-left flex items-center justify-between transition-colors",
                      selectedCode === o.code
                        ? "border-[#2E4D3A] bg-[#F0F7F2]"
                        : "border-[#E2E8F0] hover:border-[#2E4D3A]/50",
                    )}
                  >
                    <span className="text-sm font-medium text-[#1A1A1A]">
                      {o.label} <span className="text-[#4A4A4A]">— {o.price}/mes</span>
                    </span>
                    {selectedCode === o.code && <Check className="w-4 h-4 text-[#2E4D3A]" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#2E4D3A] mb-2 block">Fecha de inicio</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: es }) : "Selecciona una fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(d) => d < today || d > max}
                    initialFocus
                    locale={es}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground mt-1.5">
                Puedes elegir desde hoy hasta 30 días en el futuro.
              </p>
            </div>

            <Button
              onClick={onSubmitStep2}
              disabled={submitting || !startDate}
              className="w-full bg-[#2E4D3A] hover:bg-[#2E4D3A]/90 text-white py-6 text-base"
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirmar y pagar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
