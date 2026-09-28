import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { TALLERES, TALLER_PACK, type TallerKey } from "../_shared/talleres.ts";
import { buildTallerParticipantEmail } from "../_shared/tallerParticipantEmail.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const schema = z.object({
  taller: z.enum(["fundamentos", "avanzado", "pack"]),
  nombre: z.string().trim().min(1).max(100),
  apellido: z.string().trim().max(100).optional().default(""),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().default(""),
  amount: z.number().int().min(0).max(10_000_000),
  quantity: z.number().int().min(1).max(20).optional().default(1),
  sendEmail: z.boolean().optional().default(true),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const jwt = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: { user } } = await supabase.auth.getUser(jwt);
    if (!user) return json({ error: "No autorizado" }, 401);
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (isAdmin !== true) return json({ error: "No autorizado" }, 403);

    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Datos inválidos", details: parsed.error.flatten().fieldErrors }, 400);
    const d = parsed.data;

    const isPack = d.taller === "pack";
    const t = isPack ? null : TALLERES[d.taller as TallerKey];
    const eventIds = isPack ? [...TALLER_PACK.eventIds] : [t!.eventId];
    const listPrice = (isPack ? TALLER_PACK.precio : t!.valor) * d.quantity;

    const { data: insc, error } = await supabase
      .from("taller_inscripciones")
      .insert({
        event_id: eventIds[0],
        event_ids: eventIds,
        product_type: isPack ? "pack" : "single",
        quantity: d.quantity,
        nivel: isPack ? "pack" : d.taller,
        taller_nombre: isPack ? TALLER_PACK.nombre : t!.nombre,
        nombre: d.nombre,
        apellido: d.apellido,
        email: d.email.toLowerCase(),
        phone: d.phone,
        fecha_evento: isPack ? TALLERES.fundamentos.fechaISO : t!.fechaISO,
        horario: isPack ? TALLERES.fundamentos.horario : t!.horario,
        amount: d.amount,
        original_amount: listPrice,
        discount_amount: isPack ? 0 : Math.max(0, listPrice - d.amount),
        status: "pending",
        source: "admin_manual",
        mercado_pago_status: "manual",
      })
      .select()
      .single();
    if (error || !insc) {
      console.error(error);
      return json({ error: "No se pudo crear la inscripción" }, 500);
    }

    const { data: res, error: rpcErr } = await supabase.rpc("confirm_taller_payment", {
      _order_id: insc.id,
      _payment_id: `manual-${user.id.slice(0, 8)}`,
      _payment_status: "manual",
      _paid_amount: d.amount,
    });
    if (rpcErr || (res as any)?.ok !== true) {
      await supabase.from("taller_inscripciones").update({ status: "failed" }).eq("id", insc.id);
      const reason = (res as any)?.reason;
      return json({ error: reason === "sold_out" ? "No quedan cupos suficientes en ese taller" : "No se pudo reservar el cupo" }, 409);
    }

    let emailSent = false;
    if (d.sendEmail) {
      const key = Deno.env.get("RESEND_API_KEY");
      if (key) {
        const { subject, html } = buildTallerParticipantEmail({ ...insc, status: "paid" }, d.amount);
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: "Nave Studio <agenda@studiolanave.com>", to: [insc.email], subject, html }),
        });
        emailSent = r.ok;
        if (!r.ok) {
          const txt = await r.text();
          await supabase.from("taller_inscripciones").update({ notification_error: txt.slice(0, 500) }).eq("id", insc.id);
        }
      }
    }
    return json({ ok: true, id: insc.id, emailSent });
  } catch (e) {
    console.error(e);
    return json({ error: "Error inesperado" }, 500);
  }
});
