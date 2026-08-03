import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { getCorsHeaders } from "../_shared/cors.ts";
import { isoWeekNumber, weekKey, pickPhrase, pickSubject } from "./phrases.ts";

const AGENDA_URL = "https://studiolanave.com/agenda-nave-studio";
const OPTOUT_BASE = "https://studiolanave.com/baja-recordatorios";
const LIST_TYPE = "weekly_package_reminder";

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

interface ScheduleRow {
  day_of_week: number;
  start_time: string;
  display_name: string | null;
  service_id: string | null;
  professional_id: string | null;
  sort_order: number | null;
}

interface ClassItem {
  time: string;
  title: string;
  instructor: string | null;
  isIce: boolean;
}

const fmtTime = (t: string) => (t || "").slice(0, 5);

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const dryRun: boolean = body?.dryRun === true;
    const previewEmail: string | undefined = body?.previewEmail;
    const forceWeek: number | undefined =
      typeof body?.forceWeek === "number" ? body.forceWeek : undefined;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const now = new Date();
    const week = forceWeek ?? isoWeekNumber(now);
    const wKey = weekKey(now);
    const phrase = pickPhrase(week);

    // ---------- Horarios de la semana (Criomedicina + Yoga) ----------
    const { data: entries, error: schedErr } = await supabase
      .from("schedule_entries")
      .select("day_of_week, start_time, display_name, service_id, professional_id, sort_order")
      .eq("is_active", true)
      .order("day_of_week", { ascending: true })
      .order("start_time", { ascending: true });
    if (schedErr) throw schedErr;

    const rows = (entries || []) as ScheduleRow[];
    const svcIds = [...new Set(rows.map((r) => r.service_id).filter(Boolean))] as string[];
    const proIds = [...new Set(rows.map((r) => r.professional_id).filter(Boolean))] as string[];

    const [{ data: svcs }, { data: pros }] = await Promise.all([
      svcIds.length
        ? supabase.from("services").select("id, name, color_tag").in("id", svcIds)
        : Promise.resolve({ data: [] as any[] }),
      proIds.length
        ? supabase.from("professionals").select("id, name").in("id", proIds)
        : Promise.resolve({ data: [] as any[] }),
    ]);

    const svcMap = new Map((svcs || []).map((s: any) => [s.id, s]));
    const proMap = new Map((pros || []).map((p: any) => [p.id, p.name]));

    // Semana visual: parte el lunes y termina el domingo.
    const weekOrder = [1, 2, 3, 4, 5, 6, 0];
    const byDay: Array<{ day: number; label: string; classes: ClassItem[] }> = weekOrder.map((d) => ({
      day: d,
      label: DAY_NAMES[d],
      classes: [],
    }));

    for (const r of rows) {
      const svc = r.service_id ? svcMap.get(r.service_id) : null;
      const tag = (svc?.color_tag || "").toLowerCase();
      const isIce = tag === "wim-hof" || tag === "criomedicina";
      const isYoga = tag === "yoga";
      if (!isIce && !isYoga) continue;

      const bucket = byDay.find((b) => b.day === r.day_of_week);
      if (!bucket) continue;
      bucket.classes.push({
        time: fmtTime(r.start_time),
        title: r.display_name || svc?.name || "Sesión",
        instructor: r.professional_id ? proMap.get(r.professional_id) || null : null,
        isIce,
      });
    }
    for (const b of byDay) b.classes.sort((a, c) => a.time.localeCompare(c.time));

    const scheduleHtml = byDay
      .filter((b) => b.classes.length > 0)
      .map((b) => {
        const items = b.classes
          .map(
            (c) => `
        <tr>
          <td style="padding: 5px 10px 5px 0; font-size: 14px; font-weight: bold; color: ${
            c.isIce ? "#0e7490" : "#2E4D3A"
          }; white-space: nowrap; vertical-align: top;">${c.time}</td>
          <td style="padding: 5px 0; font-size: 14px; color: #374151;">
            ${c.isIce ? "🧊" : "🧘"} ${c.title}${
              c.instructor ? ` <span style="color:#9ca3af;">· ${c.instructor}</span>` : ""
            }
          </td>
        </tr>`,
          )
          .join("");
        return `
    <div style="margin: 0 0 16px 0;">
      <p style="margin: 0 0 6px 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #6b7280; font-weight: bold;">${b.label}</p>
      <table style="width: 100%; border-collapse: collapse;">${items}</table>
    </div>`;
      })
      .join("");

    const fmtDate = (iso: string) =>
      new Intl.DateTimeFormat("es-CL", {
        timeZone: "America/Santiago",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(iso));

    const buildEmail = (
      name: string,
      remaining: number,
      expiresAt: string | null,
      optoutToken: string | null,
    ) => {
      const firstName = (name || "").trim().split(" ")[0] || "Hola";
      const plural = remaining === 1 ? "sesión" : "sesiones";
      const optoutUrl = optoutToken ? `${OPTOUT_BASE}?token=${optoutToken}` : OPTOUT_BASE;
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.7; color: #2E4D3A; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f8fb;">
  <div style="background: linear-gradient(135deg, #0c4a6e 0%, #0e7490 50%, #06b6d4 100%); padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0;">
    <p style="color: rgba(255,255,255,0.85); margin: 0 0 10px 0; font-size: 13px; letter-spacing: 3px; text-transform: uppercase;">Nave Studio</p>
    <h1 style="color: white; margin: 0; font-size: 26px; letter-spacing: 0.5px; line-height: 1.35;">“${phrase.quote}”</h1>
    <p style="color: #cffafe; margin: 14px 0 0 0; font-size: 15px;">${phrase.support}</p>
  </div>

  <div style="background: white; padding: 32px 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 16px 16px;">
    <h2 style="color: #1A1A1A; margin-top: 0; font-size: 21px;">${firstName}, tienes ${remaining} ${plural} disponibles 🧊</h2>

    <p style="font-size: 16px; margin-top: 0;">
      Este es tu recordatorio semanal para que no dejes pasar tus sesiones${
        expiresAt ? ` — vencen el <strong>${fmtDate(expiresAt)}</strong>` : ""
      }. Elige un horario de esta semana y resérvalo ahora, mientras lo tienes en mente.
    </p>

    <div style="text-align: center; margin: 28px 0;">
      <a href="${AGENDA_URL}" style="display: inline-block; background: linear-gradient(135deg, #0c4a6e 0%, #06b6d4 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-size: 17px; font-weight: bold;">
        📅 Agendar mi sesión
      </a>
    </div>

    <div style="background: #f7f9fb; border-radius: 12px; padding: 22px; margin: 24px 0; border: 1px solid #e8ecf0;">
      <p style="margin: 0 0 14px 0; font-size: 15px; font-weight: bold; color: #0c4a6e;">❄️ Horarios de la semana</p>
      ${scheduleHtml || '<p style="margin:0;font-size:14px;color:#6b7280;">Revisa los horarios actualizados en la agenda.</p>'}
      <p style="margin: 12px 0 0 0; font-size: 12px; color: #9ca3af;">🧊 Criomedicina / Método Wim Hof · 🧘 Yoga · Cupos sujetos a disponibilidad.</p>
    </div>

    <p style="font-size: 15px;">
      🎁 <strong>Puedes compartir tus sesiones</strong> con quien quieras — pareja, amigos o familia. Solo entrega el código y que agenden.
    </p>

    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 26px 0;">

    <p style="font-size: 14px; color: #666;">
      ¿Quieres que te ayudemos a elegir tu horario? Escríbenos por <a href="https://wa.me/56946120426" style="color: #0e7490; font-weight: bold;">WhatsApp</a>.
    </p>

    <div style="text-align: center; margin-top: 22px; padding-top: 18px; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 14px; color: #666; margin: 4px 0;">
        Nave Studio ❄️<br>
        <a href="https://studiolanave.com" style="color: #0e7490; text-decoration: none;">studiolanave.com</a>
      </p>
    </div>
  </div>

  <p style="text-align: center; font-size: 12px; color: #999; margin-top: 18px; line-height: 1.6;">
    Recibes este recordatorio semanal porque tienes sesiones activas en Nave Studio.<br>
    <a href="${optoutUrl}" style="color: #9ca3af;">Dejar de recibir los recordatorios semanales</a>
  </p>
</body>
</html>`;
    };

    const sendOne = (to: string, subject: string, html: string) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "Nave Studio <agenda@studiolanave.com>",
          reply_to: "lanave@alaniceman.com",
          to: [to],
          subject,
          html,
        }),
      });

    // ---------- Preview (no envía, no registra) ----------
    if (dryRun) {
      const remaining = typeof body?.previewRemaining === "number" ? body.previewRemaining : 3;
      const subject = pickSubject(week, remaining);
      return new Response(
        JSON.stringify({
          success: true,
          dryRun: true,
          week,
          weekKey: wKey,
          subject,
          phrase,
          classesCount: byDay.reduce((n, b) => n + b.classes.length, 0),
          schedule: byDay.filter((b) => b.classes.length > 0),
          html: buildEmail(
            body?.previewName || "Alan",
            remaining,
            new Date(Date.now() + 45 * 86400000).toISOString(),
            null,
          ),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    // ---------- Envío de prueba a un email puntual ----------
    if (previewEmail) {
      const remaining = 3;
      const subject = pickSubject(week, remaining);
      const res = await sendOne(
        previewEmail,
        subject,
        buildEmail("Alan", remaining, new Date(Date.now() + 45 * 86400000).toISOString(), null),
      );
      return new Response(
        JSON.stringify({ success: res.ok, testEmail: true, subject, result: await res.json() }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // ---------- Destinatarios: códigos pagados, sin usar y no expirados ----------
    const nowISO = now.toISOString();
    const codes: Array<{ buyer_email: string; buyer_name: string; expires_at: string }> = [];
    let from = 0;
    const pageSize = 1000;
    while (true) {
      const { data, error } = await supabase
        .from("session_codes")
        .select("buyer_email, buyer_name, expires_at")
        .not("mercado_pago_payment_id", "is", null)
        .or("is_used.is.null,is_used.eq.false")
        .gt("expires_at", nowISO)
        .range(from, from + pageSize - 1);
      if (error) throw error;
      if (!data || data.length === 0) break;
      codes.push(...(data as any));
      if (data.length < pageSize) break;
      from += pageSize;
    }

    const map = new Map<string, { name: string; remaining: number; expiresAt: string }>();
    for (const r of codes) {
      const email = (r.buyer_email || "").trim().toLowerCase();
      if (!email || !email.includes("@")) continue;
      const cur = map.get(email);
      if (!cur) {
        map.set(email, { name: r.buyer_name || "", remaining: 1, expiresAt: r.expires_at });
      } else {
        cur.remaining++;
        if (new Date(r.expires_at) < new Date(cur.expiresAt)) cur.expiresAt = r.expires_at;
        if (!cur.name && r.buyer_name) cur.name = r.buyer_name;
      }
    }

    // Excluir opt-outs
    const { data: optouts } = await supabase
      .from("email_optouts")
      .select("email")
      .eq("list_type", LIST_TYPE)
      .not("opted_out_at", "is", null);
    const optedOut = new Set((optouts || []).map((o: any) => (o.email || "").toLowerCase()));

    // Excluir ya enviados esta semana (idempotencia)
    const { data: alreadySent } = await supabase
      .from("weekly_reminder_logs")
      .select("email")
      .eq("week_key", wKey)
      .eq("status", "sent");
    const sentThisWeek = new Set((alreadySent || []).map((o: any) => (o.email || "").toLowerCase()));

    const targets = [...map.entries()].filter(
      ([email]) => !optedOut.has(email) && !sentThisWeek.has(email),
    );

    console.log(`Weekly reminder ${wKey}: ${targets.length} destinatarios`);

    let sent = 0;
    const errors: string[] = [];

    for (const [email, v] of targets) {
      let token: string | null = null;
      try {
        // Asegura un token de opt-out estable por persona
        await supabase
          .from("email_optouts")
          .upsert({ email, list_type: LIST_TYPE }, { onConflict: "email,list_type", ignoreDuplicates: true });
        const { data: opt } = await supabase
          .from("email_optouts")
          .select("token")
          .eq("email", email)
          .eq("list_type", LIST_TYPE)
          .maybeSingle();
        token = opt?.token ?? null;
      } catch (_e) {
        token = null;
      }

      const subject = pickSubject(week, v.remaining);
      try {
        const res = await sendOne(email, subject, buildEmail(v.name, v.remaining, v.expiresAt, token));
        if (res.ok) {
          sent++;
          await supabase.from("weekly_reminder_logs").upsert(
            {
              email,
              buyer_name: v.name,
              week_key: wKey,
              remaining: v.remaining,
              status: "sent",
              subject,
              sent_at: new Date().toISOString(),
            },
            { onConflict: "email,week_key" },
          );
        } else {
          const txt = await res.text();
          errors.push(`${email}: ${txt}`);
          await supabase.from("weekly_reminder_logs").upsert(
            {
              email,
              buyer_name: v.name,
              week_key: wKey,
              remaining: v.remaining,
              status: "failed",
              error_message: txt.slice(0, 500),
              subject,
            },
            { onConflict: "email,week_key" },
          );
        }
      } catch (e: any) {
        errors.push(`${email}: ${e.message}`);
        await supabase.from("weekly_reminder_logs").upsert(
          {
            email,
            buyer_name: v.name,
            week_key: wKey,
            remaining: v.remaining,
            status: "failed",
            error_message: String(e.message).slice(0, 500),
            subject,
          },
          { onConflict: "email,week_key" },
        );
      }
      await new Promise((r) => setTimeout(r, 600));
    }

    return new Response(
      JSON.stringify({ success: true, weekKey: wKey, total: targets.length, sent, errors }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    console.error("Error in send-weekly-package-reminder:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
