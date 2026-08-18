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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { trackMetaClientEvent, trackMetaClientEventOnce } from "@/lib/metaTracking";
import { deterministicEventId, getMetaBrowserContext, trackMetaEvent } from "@/lib/metaPixel";

type PlanType = "trial_7d" | "trial_15d";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  initialPlan: PlanType;
}

const PLAN_LABELS: Record<PlanType, string> = {
  trial_7d: "Plan de prueba 7 días — $9.900",
  trial_15d: "Plan de prueba 15 días — $19.900",
};

// Valor real de compra (CLP) enviado a Google Ads / Meta
const PLAN_PRICES: Record<PlanType, number> = {
  trial_7d: 9900,
  trial_15d: 19900,
};

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

export function PlanPruebaFormModal({ open, onOpenChange, initialPlan }: Props) {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanType>(initialPlan);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [boxmagicUrl, setBoxmagicUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<Step1Values | null>(null);
  const [understood, setUnderstood] = useState(false);

  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  useEffect(() => {
    if (open) {
      setPlan(initialPlan);
      setStep(1);
      setLeadId(null);
      setBoxmagicUrl(null);
      setError(null);
      setStartDate(undefined);
      setUnderstood(false);
      form.reset();
    }
  }, [open, initialPlan, form]);

  // Primera interacción real con el formulario (no en el submit)
  const handleFirstInteraction = () => {
    trackMetaClientEventOnce(`plan_trial_form_started:${plan}`, "plan_trial_form_started", {
      contentName: PLAN_LABELS[plan],
      funnel: "plan_trial",
      pixelParams: { plan_type: plan },
    });
  };

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const max = new Date(); max.setDate(max.getDate() + 30); max.setHours(23, 59, 59, 999);

  const onSubmitStep1 = async (values: Step1Values) => {
    setSubmitting(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("submit-plan-prueba-lead", {
        body: {
          step: "lead",
          name: values.name,
          email: values.email,
          phone: values.phone,
          ...getUtm(),
          ...(() => {
            const ctx = getMetaBrowserContext();
            return { fbp: ctx.fbp, fbc: ctx.fbc, eventSourceUrl: ctx.eventSourceUrl };
          })(),
        },
      });
      if (error || !data?.leadId) throw new Error(data?.error || "Error al guardar");
      // Lead: sólo después de que el servidor confirmó la persistencia.
      // El CAPI autoritativo lo emite submit-plan-prueba-lead con el mismo
      // event_id determinista, por lo que aquí sólo va el Pixel.
      trackMetaEvent(
        "Lead",
        { content_name: PLAN_LABELS[plan], lead_type: "plan_trial" },
        deterministicEventId("lead", String(data.leadId))
      );
      setLeadId(data.leadId);
      setUserInfo(values);
      setStep(2);
    } catch (e: any) {
      setError(e.message || "Error al guardar tus datos");
    } finally {
      setSubmitting(false);
    }
  };

  const onSubmitStep2 = async () => {
    if (!leadId || !startDate) {
      setError("Selecciona una fecha de inicio");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const startDateStr = format(startDate, "yyyy-MM-dd");
      const { data, error } = await supabase.functions.invoke("submit-plan-prueba-lead", {
        body: { step: "finalize", leadId, planType: plan, startDate: startDateStr },
      });
      if (error || !data?.boxmagicUrl) throw new Error(data?.error || "Error al confirmar");

      // Sólo después de que finalize (server-side) fue exitoso
      trackMetaEvent(
        "plan_trial_form_completed",
        { plan_type: plan },
        deterministicEventId("plan-trial-completed", String(leadId))
      );

      // Google Ads conversion: plan de prueba (acción de compra con valor real)
      const { trackConversion } = await import("@/lib/gtagConversions");
      trackConversion("lead_plan_prueba", {
        value: PLAN_PRICES[plan],
        currency: "CLP",
        transaction_id: leadId ? String(leadId) : undefined,
      });

      // InitiateCheckout: sólo con URL de checkout válida, justo antes de redirigir.
      // (Reemplaza a plan_trial_redirect_payment, que era redundante.)
      // No se envía StartTrial ni Purchase: la activación/pago ocurre en BoxMagic.
      trackMetaClientEvent("InitiateCheckout", {
        eventId: deterministicEventId("plan-trial-checkout", String(leadId)),
        userEmail: userInfo?.email,
        userName: userInfo?.name,
        userPhone: userInfo?.phone,
        contentName: PLAN_LABELS[plan],
        contentType: "product",
        contentIds: [plan],
        value: PLAN_PRICES[plan],
        currency: "CLP",
        funnel: "plan_trial",
        entityType: "plan_trial_lead",
        entityId: String(leadId),
        pixelParams: {
          funnel: "plan_trial",
          plan_type: plan,
          content_name: PLAN_LABELS[plan],
          value: PLAN_PRICES[plan],
          currency: "CLP",
        },
      });

      // Close form modal and trigger global RedirectModal via delegated [data-checkout-url]
      onOpenChange(false);
      requestAnimationFrame(() => {
        const trigger = document.createElement("a");
        trigger.href = data.boxmagicUrl;
        trigger.setAttribute("data-checkout-url", data.boxmagicUrl);
        trigger.setAttribute("data-plan", PLAN_LABELS[plan]);
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
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent
        className="top-2 flex max-h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] translate-y-0 flex-col gap-0 overflow-hidden p-0 sm:top-[50%] sm:max-h-[90dvh] sm:w-full sm:max-w-md sm:translate-y-[-50%]"
        onEscapeKeyDown={() => onOpenChange(false)}
      >
        <DialogHeader className="shrink-0 p-6 pb-4 pr-12">
          <DialogTitle className="font-bold text-xl text-[#2E4D3A]">
            {step === 1 && "Tus datos"}
            {step === 2 && "Plan y fecha de inicio"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Paso 1 de 2 — completa tus datos para continuar."}
            {step === 2 && "Paso 2 de 2 — elige tu plan y fecha de inicio."}
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 [touch-action:pan-y] [-webkit-overflow-scrolling:touch]">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
              {error}
            </div>
          )}

          {step === 1 && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitStep1)}
                onFocusCapture={handleFirstInteraction}
                onInput={handleFirstInteraction}
                className="space-y-4"
              >
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
                  disabled={submitting}
                  className="w-full bg-[#2E4D3A] hover:bg-[#2E4D3A]/90 text-white py-6 text-base"
                >
                  {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
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
                {(["trial_7d", "trial_15d"] as PlanType[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlan(p)}
                    className={cn(
                      "border rounded-xl p-3 text-left flex items-center justify-between transition-colors",
                      plan === p ? "border-[#2E4D3A] bg-[#F0F7F2]" : "border-[#E2E8F0] hover:border-[#2E4D3A]/50",
                    )}
                  >
                    <span className="text-sm font-medium text-[#1A1A1A]">{PLAN_LABELS[p]}</span>
                    {plan === p && <Check className="w-4 h-4 text-[#2E4D3A]" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[#2E4D3A] mb-2 block">Fecha de inicio solicitada</label>
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

            <div className="space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <Checkbox
                  checked={understood}
                  onCheckedChange={(checked) => setUnderstood(checked === true)}
                  className="mt-0.5 shrink-0"
                />
                <span className="text-sm text-[#1A1A1A] leading-snug">
                  Entiendo que este beneficio de prueba está reservado para personas que quieren conocer Nave Studio con intención real de continuar con una membresía, no para usarlo como un paquete de sesiones con descuento.
                </span>
              </label>
              <p className="text-xs text-muted-foreground pl-7">
                Para visitas puntuales o experiencias ocasionales, te recomendamos{" "}
                <a href="/bonos" className="underline hover:text-[#2E4D3A]">
                  comprar una sesión suelta o un paquete
                </a>
                .
              </p>
            </div>

            <Button
              onClick={onSubmitStep2}
              disabled={submitting || !startDate || !understood}
              className="w-full bg-[#2E4D3A] hover:bg-[#2E4D3A]/90 text-white py-6 text-base"
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Confirmar y pagar
            </Button>
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
}
