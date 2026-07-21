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
  chileDateString,
  addDaysISO,
  daysBetween,
  formatChileLongDate,
  formatChileTime,
} from "../_shared/chileTime.ts";

const bodySchema = z.object({
  leadId: z.string().uuid(),
  // Optional override for testing. If omitted, function decides D+1 from "today Chile".
  targetClassDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dryRun: z.boolean().optional(),
});

const MOTIVATIONAL = [
  "El cuerpo alcanza lo que la mente cree.",
  "Cada respiración es una nueva oportunidad de volver a ti.",
  "La fuerza no viene de la capacidad física, viene de una voluntad indomable.",
  "El frío no es tu enemigo, es tu maestro.",
  "Donde va la atención, va la energía.",
  "Un paso a la vez, una respiración a la vez.",
  "El poder está en el presente.",
  "Confía en el proceso, confía en tu cuerpo.",
  "Somos capaces de mucho más de lo que creemos.",
  "La constancia es más importante que la intensidad.",
];

function pickPhrase(day: number): string {
  return MOTIVATIONAL[(day - 1) % MOTIVATIONAL.length];
}

function totalPlanDays(planType: string | null): number {
  if (planType === "trial_15d") return 15;
  return 7;
}

function classesListHtml(
  classes: Array<{ title: string; time: string; instructor: string | null }>,
): string {
  if (classes.length === 0) {
    return `<p style="margin:0 0 12px;color:#4A4A4A;font-size:15px;line-height:1.6">
      Mañana no vemos clases fijas en agenda todavía — te invitamos igualmente a entrar a BoxMagic para revisar posibles actualizaciones.
    </p>`;
  }
  const items = classes
    .slice(0, 3)
    .map(
      (c) =>
        `<li style="margin:0 0 6px;font-size:15px;color:#2A2A2A;line-height:1.6">
          <strong>${c.title}</strong> — ${c.time}${c.instructor ? ` · ${c.instructor}` : ""}
        </li>`,
    )
    .join("");
  return `<ul style="margin:0 0 12px;padding:0 0 0 20px">${items}</ul>`;
}

function buildHtml(p: {
  name: string;
  dayNumber: number;
  totalDays: number;
  tomorrowLabel: string;
  classes: Array<{ title: string; time: string; instructor: string | null }>;
  showCredentials: boolean;
  email: string;
  phrase: string;
}): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<style>
body{margin:0;padding:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#F4F4F5;line-height:1.7;-webkit-font-smoothing:antialiased}
.wrap{max-width:580px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
.hdr{background:#2E4D3A;padding:32px 28px;text-align:center}
.hdr h1{margin:0;color:#fff;font-size:22px;font-weight:700}
.body{padding:32px 28px;color:#2A2A2A;font-size:15px}
.body p{margin:0 0 16px}
.section-title{margin:0 0 10px;color:#2E4D3A;font-size:15px;font-weight:700}
.card{background:#F7F9FB;border-radius:12px;padding:18px 22px;margin:0 0 22px;border:1px solid #E2E8F0}
.footer{padding:20px;text-align:center;color:#9CA3AF;font-size:12px;border-top:1px solid #F0F0F0}
</style></head><body>
<span style="display:none;max-height:0;overflow:hidden">Revisa las clases de mañana y reserva tu horario en BoxMagic.</span>
<div class="wrap">
  <div class="hdr"><h1>Nave Studio</h1></div>
  <div class="body">
    <p>Hola <strong>${p.name}</strong>!</p>
    <p>Mañana comienza tu <strong>día ${p.dayNumber}</strong> del plan de prueba de ${p.totalDays} días.</p>

    <p class="section-title">Clases de mañana (<span style="text-transform:capitalize">${p.tomorrowLabel}</span>)</p>
    ${classesListHtml(p.classes)}

    ${boxmagicBlockHtml()}

    ${p.showCredentials ? credentialsBlockHtml(p.email) : ""}

    <div class="card">
      <p style="margin:0;font-style:italic;color:#2E4D3A">"${p.phrase}"</p>
    </div>

    <p style="margin-bottom:0">Nos vemos en la Nave ❄️🛸<br><strong>Equipo Nave Studio</strong></p>
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

    // targetClassDate = the class date being shown = D+1 from today Chile
    const tomorrowISO =
      targetClassDate || addDaysISO(chileDateString(new Date()), 1);

    // Guard: tomorrow must fall inside [start, end]
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

    const classes = rows.map((r: any) => ({
      title: r.display_name || svcMap.get(r.service_id) || "Clase",
      time: (r.start_time || "").slice(0, 5),
      instructor: proMap.get(r.professional_id) || null,
    }));

    const halfway = totalDays === 15 ? 8 : 4;
    const showCredentials = dayNumber <= halfway;

    const subject = `Nave Studio — Tu día ${dayNumber} comienza mañana`;
    const html = buildHtml({
      name: lead.customer_name,
      dayNumber,
      totalDays,
      tomorrowLabel: formatChileLongDate(tomorrowISO),
      classes,
      showCredentials,
      email: lead.customer_email,
      phrase: pickPhrase(dayNumber),
    });

    if (dryRun) {
      return new Response(
        JSON.stringify({ dryRun: true, subject, dayNumber, tomorrowISO, classes, showCredentials, html }),
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
        subject,
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
