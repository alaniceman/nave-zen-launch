import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { getCorsHeaders } from "../_shared/cors.ts";
import { chileDateString, addDaysISO, TIMEZONE } from "../_shared/chileTime.ts";

const TO = ["lanave@alaniceman.com", "flowithmaral@gmail.com"];
const STATE_ID = "trial_ending_alert";

// Estados que ya no requieren seguimiento comercial.
const CONVERTED_STATUSES = ["convertido_a_membresia"];

const TRIAL_STATUSES = [
  "interesado_plan_prueba",
  "redirigido_a_boxmagic",
  "pagado_plan_prueba",
  "plan_prueba_activo",
  "plan_prueba_finalizado",
  "convertido_a_membresia",
];

const PAID_STATUSES = ["pagado_plan_prueba", "plan_prueba_activo", "plan_prueba_finalizado"];

interface Lead {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  plan_type: string | null;
  status: string;
  actual_start_date: string | null;
  actual_end_date: string | null;
  admin_notes: string | null;
  created_at: string;
  paid_at: string | null;
}

const PLAN_LABELS: Record<string, string> = {
  trial_7d: "Plan 7 días",
  trial_15d: "Plan 15 días",
};

function planLabel(planType: string | null): string {
  return (planType && PLAN_LABELS[planType]) || "Plan de prueba";
}

// Normaliza a E.164 chileno para wa.me (sin "+").
function waNumber(phone: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (!digits) return null;
  if (digits.startsWith("56")) return digits;
  if (digits.length === 9) return `56${digits}`;
  if (digits.length === 8) return `569${digits}`;
  return digits;
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: TIMEZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(iso + "T12:00:00Z"));
}

function contactHtml(lead: Lead): string {
  const wa = waNumber(lead.customer_phone);
  const waMsg = encodeURIComponent(
    `Hola ${((lead.customer_name || "").split(" ")[0] || "")}! Soy del equipo de Nave Studio 🛸 ¿Cómo va tu plan de prueba? Quería contarte las opciones para seguir con nosotros.`,
  );
  const waLink = wa
    ? `<a href="https://wa.me/${wa}?text=${waMsg}" style="color:#128C7E;font-weight:600;text-decoration:none">WhatsApp ${lead.customer_phone}</a>`
    : `<span style="color:#9CA3AF">Sin teléfono</span>`;
  return `<a href="mailto:${lead.customer_email}" style="color:#2E4D3A;text-decoration:none">${lead.customer_email}</a><br>${waLink}`;
}

const STATUS_LABELS: Record<string, string> = {
  interesado_plan_prueba: "Interesado (por pagar)",
  redirigido_a_boxmagic: "Redirigido a pago (por pagar)",
  pagado_plan_prueba: "Pagado",
  plan_prueba_activo: "Plan activo (pagado)",
  plan_prueba_finalizado: "Plan finalizado",
  convertido_a_membresia: "Convertido a membresía",
};

function statusLabel(status: string): string {
  return STATUS_LABELS[status] || status;
}

// Mapa email -> customer_id para linkear el perfil en el CRM.
const customerIdByEmail = new Map<string, string>();

function nameHtml(lead: Lead, highlight: boolean): string {
  const name = lead.customer_name || "Sin nombre";
  const color = highlight ? "#1F2937" : "#374151";
  const id = customerIdByEmail.get((lead.customer_email || "").toLowerCase().trim());
  if (!id) {
    return `<strong style="color:${color};font-size:16px">${name}</strong>`;
  }
  return `<a href="https://studiolanave.com/admin/clientes/${id}" style="color:${color};font-size:16px;font-weight:700;text-decoration:underline">${name}</a>`;
}

function leadRows(leads: Lead[], highlight = false): string {
  if (leads.length === 0) {
    return `<tr><td style="padding:12px 0;color:#9CA3AF;font-size:14px">Nada por aquí hoy.</td></tr>`;
  }
  return leads
    .map(
      (l) => `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid #EEF1F4;font-size:15px;color:#2A2A2A">
        ${nameHtml(l, highlight)}
        <span style="color:#9CA3AF"> · </span><span style="color:#4A4A4A">${planLabel(l.plan_type)}</span><br>
        <span style="color:#4A4A4A;font-size:14px">${statusLabel(l.status)}</span><br>
        <span style="color:#4A4A4A;font-size:14px">Inicio ${formatDate(l.actual_start_date)} · Término ${formatDate(l.actual_end_date)}</span><br>
        <span style="font-size:14px">${contactHtml(l)}</span>
        ${l.admin_notes ? `<br><span style="color:#6B7280;font-size:13px">Nota: ${l.admin_notes}</span>` : ""}
      </td>
    </tr>`,
    )
    .join("");
}

function section(title: string, subtitle: string, leads: Lead[], highlight = false): string {
  return `
  <p style="margin:26px 0 4px;color:#2E4D3A;font-size:13px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase">${title} (${leads.length})</p>
  <p style="margin:0 0 8px;color:#6B7280;font-size:13px">${subtitle}</p>
  <table role="presentation" width="100%" style="border-collapse:collapse">${leadRows(leads, highlight)}</table>`;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({} as any));
    const dryRun = body?.dryRun === true;
    const force = body?.force === true;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const todayCL = chileDateString(new Date());
    const tomorrowCL = addDaysISO(todayCL, 1);
    const in2CL = addDaysISO(todayCL, 2);
    const in7CL = addDaysISO(todayCL, 7);
    const past30CL = addDaysISO(todayCL, -30);
    const past7CL = addDaysISO(todayCL, -7);

    // Lunes en Chile (0 = domingo).
    const isMonday =
      new Date(`${todayCL}T12:00:00Z`).getUTCDay() === 1;

    const { data, error } = await supabase
      .from("trial_bookings")
      .select(
        "id, customer_name, customer_email, customer_phone, plan_type, status, actual_start_date, actual_end_date, admin_notes, created_at, paid_at",
      )
      .or(`created_at.gte.${past30CL}T00:00:00Z,actual_end_date.gte.${past30CL}`)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;

    const all = ((data || []) as Lead[]).filter(
      (l) =>
        (l.plan_type && l.plan_type.startsWith("trial_")) ||
        TRIAL_STATUSES.includes(l.status),
    );

    const pending = all.filter((l) => !CONVERTED_STATUSES.includes(l.status));

    const withEnd = pending.filter((l) => !!l.actual_end_date);
    const endingTomorrow = withEnd
      .filter((l) => l.actual_end_date! >= todayCL && l.actual_end_date! <= in2CL)
      .sort((a, b) => (a.actual_end_date! < b.actual_end_date! ? -1 : 1));
    const endingSoon = withEnd
      .filter((l) => l.actual_end_date! > in2CL && l.actual_end_date! <= in7CL)
      .sort((a, b) => (a.actual_end_date! < b.actual_end_date! ? -1 : 1));
    const finished = withEnd
      .filter((l) => l.actual_end_date! < todayCL && l.actual_end_date! >= past30CL)
      .sort((a, b) => (a.actual_end_date! > b.actual_end_date! ? -1 : 1));

    // Registros nuevos (últimos 7 días), pagados o por pagar.
    const nuevos = pending.filter((l) => l.created_at >= `${past7CL}T00:00:00`);
    const nuevosPagados = nuevos.filter((l) => PAID_STATUSES.includes(l.status) || l.paid_at);
    const nuevosPorPagar = nuevos.filter(
      (l) => !PAID_STATUSES.includes(l.status) && !l.paid_at,
    );

    // Convertidos a membresía (últimos 30 días).
    const convertidos = all.filter((l) => CONVERTED_STATUSES.includes(l.status));

    // Firma de los eventos que gatillan un envío: nuevos registros,
    // por expirar en ≤2 días y ya expirados.
    const signature = [...nuevos, ...endingTomorrow, ...finished]
      .map((l) => `${l.id}:${l.status}:${l.actual_end_date || ""}`)
      .sort()
      .join("|");

    const { data: stateRow } = await supabase
      .from("trial_alert_state")
      .select("signature")
      .eq("id", STATE_ID)
      .maybeSingle();

    const changed = (stateRow?.signature ?? "") !== signature;
    const hasContent =
      endingTomorrow.length + endingSoon.length + finished.length + nuevos.length > 0;

    if (!force && !dryRun && (!hasContent || (!isMonday && !changed))) {
      return new Response(
        JSON.stringify({
          skipped: true,
          reason: !hasContent ? "no_leads" : "no_changes",
          isMonday,
          todayCL,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const subject =
      endingTomorrow.length > 0
        ? `⏳ ${endingTomorrow.length} plan${endingTomorrow.length === 1 ? "" : "es"} de prueba por terminar (≤2 días)`
        : nuevos.length > 0
          ? `Planes de prueba · ${nuevos.length} registro${nuevos.length === 1 ? "" : "s"} nuevo${nuevos.length === 1 ? "" : "s"}`
          : `Planes de prueba · resumen semanal (${finished.length} terminados)`;

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
body{margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#F4F4F5;line-height:1.7;-webkit-font-smoothing:antialiased}
.wrap{max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.hdr{background:#2E4D3A;padding:28px;text-align:center}
.hdr h1{margin:0;color:#fff;font-size:20px;font-weight:700}
.body{padding:28px;color:#2A2A2A;font-size:15px}
.footer{padding:18px;text-align:center;color:#9CA3AF;font-size:12px;border-top:1px solid #F0F0F0}
</style></head><body>
<span style="display:none;max-height:0;overflow:hidden">${endingTomorrow.length} por terminar · ${nuevos.length} nuevos · ${finished.length} terminados</span>
<div class="wrap">
  <div class="hdr"><h1>Seguimiento planes de prueba</h1></div>
  <div class="body">
    <p style="margin:0 0 6px;color:#4A4A4A;font-size:14px">Resumen del ${formatDate(todayCL)}${isMonday ? " · resumen semanal del lunes" : " · hubo cambios de estado"}.</p>
    ${section("Nuevos pagados (últimos 7 días)", "Confirmar fechas de inicio y bienvenida.", nuevosPagados, true)}
    ${section("Nuevos por pagar (últimos 7 días)", "Falta el pago: buen momento para escribirles.", nuevosPorPagar)}
    ${section("Por terminar (próximos 2 días)", "Momento ideal para ofrecer una membresía.", endingTomorrow, true)}
    ${section("Por terminar (próximos 7 días)", "Preparar el seguimiento.", endingSoon)}
    ${section("Ya terminaron (últimos 30 días)", "Sin membresía registrada todavía.", finished)}
    ${section("Pasaron a membresía (últimos 30 días)", "Conversiones marcadas en el panel.", convertidos)}
    <p style="margin:28px 0 0;text-align:center">
      <a href="https://studiolanave.com/admin/planes-prueba" style="display:inline-block;background:#2E4D3A;color:#fff!important;padding:13px 26px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px">Abrir panel de planes de prueba</a>
    </p>
  </div>
  <div class="footer">Nave Studio · aviso automático (lunes y cuando hay cambios)</div>
</div></body></html>`;

    if (dryRun) {
      return new Response(
        JSON.stringify({
          dryRun: true,
          subject,
          todayCL,
          isMonday,
          changed,
          nuevosPagados: nuevosPagados.length,
          nuevosPorPagar: nuevosPorPagar.length,
          endingTomorrow: endingTomorrow.length,
          endingSoon: endingSoon.length,
          finished: finished.length,
          convertidos: convertidos.length,
          html,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const RESEND = Deno.env.get("RESEND_API_KEY");
    if (!RESEND) throw new Error("RESEND_API_KEY no configurado");
    const resend = new Resend(RESEND);

    await resend.emails.send({
      from: "Nave Studio <agenda@studiolanave.com>",
      reply_to: "lanave@alaniceman.com",
      to: TO,
      subject,
      html,
    });

    await supabase
      .from("trial_alert_state")
      .upsert({ id: STATE_ID, signature, sent_at: new Date().toISOString() });

    console.log(
      `send-trial-ending-alert: nuevos=${nuevos.length} porTerminar=${endingTomorrow.length} terminados=${finished.length} convertidos=${convertidos.length} lunes=${isMonday}`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        todayCL,
        isMonday,
        changed,
        nuevosPagados: nuevosPagados.length,
        nuevosPorPagar: nuevosPorPagar.length,
        endingTomorrow: endingTomorrow.length,
        endingSoon: endingSoon.length,
        finished: finished.length,
        convertidos: convertidos.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("send-trial-ending-alert error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
