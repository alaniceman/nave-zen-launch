import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { getCorsHeaders } from "../_shared/cors.ts";
import {
  BOXMAGIC_WEB,
  boxmagicBlockHtml,
  credentialsBlockHtml,
} from "../_shared/boxmagicBlock.ts";
import {
  TIMEZONE,
  chileDateString,
  addDaysISO,
  daysBetween,
} from "../_shared/chileTime.ts";
import { getTrialCopy } from "../_shared/trialCopy.ts";

const bodySchema = z.object({
  leadId: z.string().uuid(),
  targetClassDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dryRun: z.boolean().optional(),
});

const WHATSAPP_URL =
  "https://wa.me/56946120426?text=Hola%21%20quiero%20que%20me%20recomienden%20un%20plan%20despu%C3%A9s%20de%20mi%20Plan%20de%20Prueba";
const PLANS_URL = "https://studiolanave.com/planes";

function totalPlanDays(planType: string | null): number {
  if (planType === "trial_15d") return 15;
  return 7;
}

// Format like "lunes 24 de noviembre" (no year), Chile timezone.
function formatDayAndDateNoYear(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00Z");
  const parts = new Intl.DateTimeFormat("es-CL", {
    timeZone: TIMEZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
  }).formatToParts(d);
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  return `${weekday} ${day} de ${month}`;
}

interface ClassItem {
  title: string;
  time: string;
  instructor: string | null;
}

function classesBlockHtml(dateLabel: string, classes: ClassItem[]): string {
  const title = `<p style="margin:0 0 12px;color:#2E4D3A;font-size:13px;font-weight:700;letter-spacing:0.6px;text-transform:uppercase">Clases disponibles para mañana</p>`;

  if (classes.length === 0) {
    return (
      title +
      `<p style="margin:0 0 20px;color:#4A4A4A;font-size:15px;line-height:1.7">Mañana no tenemos clases programadas por el momento. Entra a BoxMagic para revisar posibles actualizaciones y organizar tus próximas reservas.</p>`
    );
  }

  const rows = classes
    .slice(0, 6)
    .map(
      (c) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #EEF1F4;color:#2A2A2A;font-size:15px;line-height:1.5">
          <strong style="color:#1F2937">${c.title}</strong><br>
          <span style="color:#4A4A4A;font-size:14px;text-transform:capitalize">${dateLabel}</span>
          <span style="color:#9CA3AF"> · </span>
          <span style="color:#2E4D3A;font-weight:600">${c.time}</span>${
        c.instructor
          ? ` <span style="color:#9CA3AF"> · </span><span style="color:#4A4A4A">${c.instructor}</span>`
          : ""
      }
        </td>
      </tr>`,
    )
    .join("");

  return (
    title +
    `<table role="presentation" width="100%" style="border-collapse:collapse;margin:0 0 20px">${rows}</table>`
  );
}

function conversionCtasHtml(): string {
  return `
<div style="margin:24px 0 12px">
  <table role="presentation" width="100%" style="border-collapse:collapse">
    <tr><td style="padding:0 0 10px;text-align:center">
      <a href="${PLANS_URL}" style="display:inline-block;width:100%;max-width:320px;background:#2E4D3A;color:#fff!important;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;box-sizing:border-box">Ver planes para continuar</a>
    </td></tr>
    <tr><td style="padding:0;text-align:center">
      <a href="${WHATSAPP_URL}" style="display:inline-block;width:100%;max-width:320px;background:#fff;color:#2E4D3A!important;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;border:1.5px solid #2E4D3A;box-sizing:border-box">Quiero que me recomienden un plan</a>
    </td></tr>
  </table>
</div>`;
}

function buildHtml(p: {
  name: string;
  preview: string;
  bodyHtml: string;
  dateLabel: string;
  classes: ClassItem[];
  showCredentials: boolean;
  email: string;
  cta: "reserve" | "convert";
}): string {
  const cta =
    p.cta === "convert" ? conversionCtasHtml() : boxmagicBlockHtml();
  const supportLinks =
    p.cta === "convert"
      ? `<p style="font-size:13px;color:#6B7280;line-height:1.7;text-align:center;margin:0 0 14px">
          También puedes seguir revisando horarios en
          <a href="${BOXMAGIC_WEB}" style="color:#2E4D3A">BoxMagic</a>.
        </p>`
      : "";

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
body{margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#F4F4F5;line-height:1.7;-webkit-font-smoothing:antialiased}
.wrap{max-width:580px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.hdr{background:#2E4D3A;padding:32px 28px;text-align:center}
.hdr h1{margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:0.3px}
.body{padding:32px 28px;color:#2A2A2A;font-size:15px}
.footer{padding:20px;text-align:center;color:#9CA3AF;font-size:12px;border-top:1px solid #F0F0F0}
</style></head><body>
<span style="display:none;max-height:0;overflow:hidden">${p.preview}</span>
<div class="wrap">
  <div class="hdr"><h1>Nave Studio</h1></div>
  <div class="body">
    <p style="margin:0 0 18px;color:#2A2A2A;font-size:15px">Hola <strong>${p.name}</strong>,</p>
    ${p.bodyHtml}
    ${classesBlockHtml(p.dateLabel, p.classes)}
    ${cta}
    ${supportLinks}
    ${p.showCredentials ? credentialsBlockHtml(p.email) : ""}
    <p style="margin:22px 0 0;color:#2A2A2A;font-size:15px">Nos vemos en la Nave ❄️🛸<br><strong>Equipo Nave Studio</strong></p>
  </div>
  <div class="footer">Nave Studio · Antares 259, Las Condes</div>
</div></body></html>`;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const parsed = bodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const { leadId, targetClassDate, dryRun } = parsed.data;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: lead, error: leadErr } = await supabase
      .from("trial_bookings")
      .select("id, customer_name, customer_email, plan_type, actual_start_date, actual_end_date, status")
      .eq("id", leadId)
      .single();
    if (leadErr || !lead) throw new Error("Lead no encontrado");
    if (!lead.actual_start_date || !lead.actual_end_date) {
      throw new Error("Plan sin fechas activas");
    }

    const tomorrowISO =
      targetClassDate || addDaysISO(chileDateString(new Date()), 1);

    if (
      tomorrowISO < lead.actual_start_date ||
      tomorrowISO > lead.actual_end_date
    ) {
      return new Response(
        JSON.stringify({
          skipped: true,
          reason: "target_out_of_range",
          tomorrowISO,
          start: lead.actual_start_date,
          end: lead.actual_end_date,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const totalDays = totalPlanDays(lead.plan_type);
    const dayNumber = daysBetween(lead.actual_start_date, tomorrowISO) + 1;
    if (dayNumber < 1) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "day_out_of_range", dayNumber }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const remainingDays = Math.max(
      0,
      daysBetween(tomorrowISO, lead.actual_end_date),
    );

    // Dedupe
    const { data: existing } = await supabase
      .from("trial_reminder_logs")
      .select("id")
      .eq("lead_id", lead.id)
      .eq("reminder_day", dayNumber)
      .maybeSingle();
    if (existing && !dryRun) {
      return new Response(
        JSON.stringify({ skipped: true, reason: "already_sent", dayNumber }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Fetch tomorrow's classes from schedule_entries (source: /admin/horarios).
    // day_of_week convention: 0=lunes .. 6=domingo. JS getUTCDay: 0=Sun..6=Sat.
    const jsDay = new Date(tomorrowISO + "T12:00:00-03:00").getUTCDay();
    const scheduleDay = (jsDay + 6) % 7;

    const { data: entries } = await supabase
      .from("schedule_entries")
      .select("start_time, display_name, service_id, professional_id, sort_order")
      .eq("is_active", true)
      .eq("day_of_week", scheduleDay)
      .order("start_time", { ascending: true });

    const rows = entries || [];
    const svcIds = [...new Set(rows.map((s: any) => s.service_id).filter(Boolean))];
    const proIds = [...new Set(rows.map((s: any) => s.professional_id).filter(Boolean))];
    const [{ data: svcs }, { data: pros }] = await Promise.all([
      svcIds.length
        ? supabase.from("services").select("id, name").in("id", svcIds)
        : Promise.resolve({ data: [] as any[] }),
      proIds.length
        ? supabase.from("professionals").select("id, name").in("id", proIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);
    const svcMap = new Map((svcs || []).map((s: any) => [s.id, s.name]));
    const proMap = new Map((pros || []).map((p: any) => [p.id, p.name]));

    const classes: ClassItem[] = rows.map((r: any) => ({
      title: r.display_name || svcMap.get(r.service_id) || "Clase",
      time: (r.start_time || "").slice(0, 5),
      instructor: proMap.get(r.professional_id) || null,
    }));

    const halfway = totalDays === 15 ? 8 : 4;
    const showCredentials = dayNumber <= halfway;

    const firstName = (lead.customer_name || "").split(" ")[0] || lead.customer_name || "";
    const copy = getTrialCopy({
      firstName,
      dayNumber,
      totalDays,
      remainingDays,
      completedReservations: null,
    });

    const dateLabel = formatDayAndDateNoYear(tomorrowISO);

    const html = buildHtml({
      name: firstName,
      preview: copy.preview,
      bodyHtml: copy.bodyHtml,
      dateLabel,
      classes,
      showCredentials,
      email: lead.customer_email,
      cta: copy.cta,
    });

    if (dryRun) {
      return new Response(
        JSON.stringify({
          dryRun: true,
          subject: copy.subject,
          dayNumber,
          totalDays,
          tomorrowISO,
          dateLabel,
          remainingDays,
          classes,
          showCredentials,
          html,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const RESEND = Deno.env.get("RESEND_API_KEY");
    if (!RESEND) throw new Error("RESEND_API_KEY no configurado");
    const resend = new Resend(RESEND);

    let sendError: string | null = null;
    try {
      await resend.emails.send({
        from: "Nave Studio <no-reply@studiolanave.com>",
        reply_to: "lanave@alaniceman.com",
        to: [lead.customer_email],
        subject: copy.subject,
        html,
      });
    } catch (e: any) {
      sendError = e?.message || String(e);
    }

    await supabase.from("trial_reminder_logs").insert({
      lead_id: lead.id,
      reminder_day: dayNumber,
      scheduled_for: tomorrowISO,
      sent_at: sendError ? null : new Date().toISOString(),
      status: sendError ? "failed" : classes.length === 0 ? "sent_no_classes" : "sent",
      error_message: sendError,
    });

    if (sendError) throw new Error(sendError);

    return new Response(
      JSON.stringify({ success: true, dayNumber, tomorrowISO, classes: classes.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("send-trial-daily-reminder error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
