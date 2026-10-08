/**
 * Fulfillment de la campaña Cyber (productos en cyber_products vendidos vía carrito de tienda).
 * Idempotente: cada fila de cyber_purchases se reclama pending -> processing -> paid;
 * reintentos o webhooks repetidos no emiten códigos ni correos duplicados.
 */

// Códigos canjeables en Criomedicina / Método Wim Hof y en todas las clases de yoga existentes.
const WIM_HOF_SERVICE_ID = "ced4be53-8e5c-4d34-8370-0784f8d7a4b1";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function randomCode(): string {
  let c = "";
  for (let i = 0; i < 8; i++) c += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  return c;
}

async function uniqueCodes(supabase: any, n: number): Promise<string[]> {
  const out: string[] = [];
  while (out.length < n) {
    const candidate = randomCode();
    if (out.includes(candidate)) continue;
    const { data } = await supabase.from("session_codes").select("id").eq("code", candidate).maybeSingle();
    if (!data) out.push(candidate);
  }
  return out;
}

async function applicableServiceIds(supabase: any): Promise<string[]> {
  const { data } = await supabase
    .from("services")
    .select("id")
    .eq("is_active", true)
    .eq("color_tag", "yoga");
  return [WIM_HOF_SERVICE_ID, ...((data ?? []).map((s: any) => s.id))];
}

const esc = (s: string) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const clp = (n: number) => `$${Number(n).toLocaleString("es-CL")}`;
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Santiago" });

function codeList(codes: string[]) {
  return codes
    .map(
      (c) =>
        `<div style="display:inline-block;margin:4px 6px 4px 0;padding:10px 14px;border:1px dashed #2E4D3A;border-radius:8px;font-family:'Courier New',monospace;font-size:18px;font-weight:bold;letter-spacing:2px;color:#2E4D3A;background:#ffffff">${esc(c)}</div>`,
    )
    .join("");
}

function buildEmail(order: any, rows: any[], otherItems: any[]) {
  const first = String(order.customer_name || "").split(" ")[0] || "";
  const orderNo = String(order.id).slice(0, 8).toUpperCase();
  const siteUrl = (Deno.env.get("SITE_URL") || "https://studiolanave.com").replace(/\/$/, "");
  const blocks: string[] = [];
  const textParts: string[] = [];

  for (const r of rows) {
    if (r.kind === "pack") {
      const ownLabel = r.own_codes.length === 1 ? "Tu sesión" : "Tus sesiones";
      blocks.push(`
<div style="margin:0 0 20px;padding:20px;background:#ffffff;border-radius:12px;border:1px solid #e5e0d4">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#6b7280">Compra N° ${orderNo}</p>
<h2 style="margin:0 0 14px;font-size:18px;color:#2E4D3A">${esc(r.product_name)}${r.quantity > 1 ? ` × ${r.quantity}` : ""}</h2>
<p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#1f2a24">${ownLabel}</p>
<div style="margin:0 0 14px">${codeList(r.own_codes)}</div>
${r.invite_codes.length ? `<p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#1f2a24">Tus invitaciones</p>
<p style="margin:0 0 6px;font-size:14px;color:#3a4a40">Regálalas a quien quieras invitar a vivir la experiencia.</p>
<div style="margin:0 0 14px">${codeList(r.invite_codes)}</div>` : ""}
<p style="margin:0;font-size:13px;color:#6b7280">Válidos hasta el ${fmtDate(r.codes_expire_at)}. Canjeables en sesiones Método Wim Hof / Criomedicina y en clases de Yoga + Ice Bath al final.</p>
</div>`);
      textParts.push(
        `Compra N° ${orderNo} · ${r.product_name}${r.quantity > 1 ? ` x${r.quantity}` : ""}\n${ownLabel}: ${r.own_codes.join(", ")}` +
          (r.invite_codes.length ? `\nTus invitaciones: ${r.invite_codes.join(", ")}` : "") +
          `\nVálidos hasta el ${fmtDate(r.codes_expire_at)}.`,
      );
    } else {
      const gift = r.months_free > 0 ? ` (pagas ${r.months_paid} y disfrutas ${r.months_total})` : "";
      blocks.push(`
<div style="margin:0 0 20px;padding:20px;background:#ffffff;border-radius:12px;border:1px solid #e5e0d4">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#6b7280">Compra N° ${orderNo}</p>
<h2 style="margin:0 0 10px;font-size:18px;color:#2E4D3A">Membresía ${esc(r.plan_name)}${r.quantity > 1 ? ` × ${r.quantity}` : ""}</h2>
<p style="margin:0 0 6px;font-size:15px">Periodo total: <strong>${r.months_total * r.quantity} meses</strong>${gift}</p>
<p style="margin:0;font-size:14px;color:#3a4a40">Nuestro equipo te escribirá para coordinar la fecha de inicio y activar tu plan. Si ya tienes un plan vigente, el nuevo periodo comienza al terminar el actual.</p>
</div>`);
      textParts.push(
        `Compra N° ${orderNo} · Membresía ${r.plan_name}: ${r.months_total * r.quantity} meses${gift}. Te escribiremos para coordinar el inicio.`,
      );
    }
  }

  if (otherItems.length) {
    const list = otherItems.map((i) => `${esc(i.name)} × ${i.quantity}`).join("<br>");
    blocks.push(`<div style="margin:0 0 20px;padding:20px;background:#ffffff;border-radius:12px;border:1px solid #e5e0d4">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#6b7280">Compra N° ${orderNo}</p>
<h2 style="margin:0 0 10px;font-size:18px;color:#2E4D3A">Productos de tienda</h2>
<p style="margin:0 0 6px;font-size:15px">${list}</p>
<p style="margin:0;font-size:14px;color:#3a4a40">Retíralos en Nave Studio mostrando este correo.</p></div>`);
    textParts.push(`Productos de tienda: ${otherItems.map((i) => `${i.name} x${i.quantity}`).join(", ")}. Retira en Nave Studio.`);
  }

  const hasPack = rows.some((r) => r.kind === "pack");
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1f2a24;line-height:1.7">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#F6F1E7;border-radius:16px"><tr><td style="padding:28px 22px">
<p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#2E4D3A">Nave Studio · Cyber</p>
<h1 style="margin:0 0 14px;font-size:24px;line-height:1.3;color:#2E4D3A">Tu compra está confirmada</h1>
<p style="margin:0 0 20px;font-size:16px">Hola${first ? ` ${esc(first)}` : ""}, gracias por darle espacio a tu crecimiento. Aquí está el detalle de tu compra (total ${clp(order.product_price)}).</p>
${blocks.join("")}
${hasPack ? `<p style="margin:0 0 10px;font-size:15px"><strong>Cómo agendar:</strong> entra a la agenda, elige tu clase e ingresa un código en el campo de código al reservar. Cada código es una sesión.</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px"><tr><td style="background:#2E4D3A;border-radius:10px"><a href="${siteUrl}/agenda-nave-studio" style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font-weight:bold;font-size:16px">Ir a la agenda</a></td></tr></table>
<p style="margin:0 0 16px;font-size:13px;color:#3a4a40">Si usas un código en Yoga + Ice Bath, para entrar al hielo necesitas haber hecho antes una sesión guiada Método Wim Hof, y la inmersión es de máximo 2 minutos.</p>` : ""}
<p style="margin:0;font-size:15px">¿Dudas? Responde este correo o escríbenos por WhatsApp al +56 9 4612 0426.</p>
<p style="margin:16px 0 0;font-size:15px">Nave Studio</p>
</td></tr></table>
<p style="font-size:12px;color:#6b7280;margin:16px 0 0">Nave Studio · Antares 259, Las Condes, Santiago · studiolanave.com</p>
</td></tr></table></body></html>`;
  const text = `Hola${first ? ` ${first}` : ""}, tu compra en Nave Studio está confirmada (total ${clp(order.product_price)}).\n\n${textParts.join("\n\n")}\n\n${hasPack ? `Agenda en ${siteUrl}/agenda-nave-studio ingresando un código al reservar.\n\n` : ""}Dudas: WhatsApp +56 9 4612 0426.\nNave Studio`;
  return { html, text };
}

/** Reenvía el correo de confirmación de una orden Cyber ya pagada al email guardado en la orden. */
export async function resendCyberOrderEmail(order: any, supabase: any) {
  const { data: rows } = await supabase
    .from("cyber_purchases").select("*").eq("shop_order_id", order.id).eq("payment_status", "paid");
  if (!rows?.length) return { ok: false, reason: "no_paid_rows" };
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return { ok: false, reason: "no_key" };
  const { html, text } = buildEmail(order, rows, []);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Nave Studio <agenda@studiolanave.com>",
      to: [order.customer_email],
      reply_to: "lanave@alaniceman.com",
      subject: "Tus códigos de Nave Studio · Compra Cyber",
      html,
      text,
    }),
  });
  return { ok: res.ok, status: res.status, body: await res.text(), to: order.customer_email };
}

export async function fulfillCyberOrder(order: any, paymentId: string, supabase: any) {
  const { data: pending } = await supabase
    .from("cyber_purchases")
    .select("*")
    .eq("shop_order_id", order.id)
    .eq("payment_status", "pending");
  if (!pending || pending.length === 0) return;

  const serviceIds = await applicableServiceIds(supabase);
  const done: any[] = [];

  for (const row of pending) {
    // Reclamo atómico por fila
    const { data: claimed } = await supabase
      .from("cyber_purchases")
      .update({ payment_status: "processing", mercado_pago_payment_id: paymentId })
      .eq("id", row.id)
      .eq("payment_status", "pending")
      .select()
      .maybeSingle();
    if (!claimed) continue;

    try {
      const update: Record<string, unknown> = {
        payment_status: "paid",
        paid_at: new Date().toISOString(),
      };
      if (row.kind === "pack") {
        const { data: prod } = await supabase.from("cyber_products").select("*").eq("id", row.product_id).single();
        const own = (prod?.own_codes ?? 0) * row.quantity;
        const inv = (prod?.invite_codes ?? 0) * row.quantity;
        const expires = new Date();
        expires.setMonth(expires.getMonth() + (prod?.validity_months ?? 6));
        const codes = await uniqueCodes(supabase, own + inv);
        const ownCodes = codes.slice(0, own);
        const inviteCodes = codes.slice(own);
        const { error: insErr } = await supabase.from("session_codes").insert(
          codes.map((code) => ({
            package_id: null,
            code,
            applicable_service_ids: serviceIds,
            buyer_email: row.buyer_email,
            buyer_name: row.buyer_name,
            buyer_phone: row.buyer_phone,
            purchased_at: new Date().toISOString(),
            expires_at: expires.toISOString(),
            is_used: false,
            mercado_pago_payment_id: paymentId,
          })),
        );
        if (insErr) throw insErr;
        update.own_codes = ownCodes;
        update.invite_codes = inviteCodes;
        update.codes_expire_at = expires.toISOString();
      } else {
        update.activation_status = "pending_coordination";
      }
      const { data: saved } = await supabase.from("cyber_purchases").update(update).eq("id", row.id).select().single();
      done.push(saved);
      // Descontar cupo real (una sola vez por fila gracias al reclamo atómico)
      try {
        const { data: prodPool } = await supabase.from("cyber_products").select("stock_pool").eq("id", row.product_id).single();
        if (prodPool?.stock_pool) await supabase.rpc("cyber_stock_add", { _pool: prodPool.stock_pool, _qty: row.quantity });
      } catch (se) {
        console.error("[cyber] stock update error", row.id, se);
      }
    } catch (e) {
      console.error("[cyber] fulfillment error", row.id, e);
      await supabase
        .from("cyber_purchases")
        .update({ payment_status: "pending", admin_notes: `fulfillment_error: ${String((e as Error)?.message ?? e).slice(0, 200)}` })
        .eq("id", row.id);
    }
  }

  if (done.length === 0) return;

  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return;

  const cyberIds = new Set(done.map((r) => r.product_id));
  const allCyber = new Set(
    ((order.meta_context?.items ?? []) as any[]).filter((i) => i.cyber).map((i) => i.product_id),
  );
  const otherItems = ((order.meta_context?.items ?? []) as any[]).filter(
    (i) => !i.cyber && !allCyber.has(i.product_id) && !cyberIds.has(i.product_id),
  );
  const { html, text } = buildEmail(order, done, otherItems);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `cyber-order-${order.id}-${done.map((d) => d.id).sort().join("").slice(0, 200)}`,
      },
      body: JSON.stringify({
        from: "Nave Studio <agenda@studiolanave.com>",
        to: [order.customer_email],
        reply_to: "lanave@alaniceman.com",
        subject: "Tu compra Cyber está confirmada · Nave Studio",
        html,
        text,
      }),
    });
    if (!res.ok) console.error("[cyber] email failed", res.status, await res.text());
  } catch (e) {
    console.error("[cyber] email error", e);
  }

  // Aviso interno para coordinar activación de membresías
  const memberships = done.filter((r) => r.kind === "membership");
  if (memberships.length) {
    const lines = memberships
      .map((m) => `${m.plan_name}: ${m.months_total * m.quantity} meses (pagados ${m.months_paid * m.quantity}, regalo ${m.months_free * m.quantity}) · ${clp(m.total_amount)}`)
      .join("\n");
    try {
      await new Promise((r) => setTimeout(r, 600));
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json", "Idempotency-Key": `cyber-staff-${order.id}` },
        body: JSON.stringify({
          from: "Nave Studio <agenda@studiolanave.com>",
          to: ["lanave@alaniceman.com"],
          subject: `Membresía Cyber por activar · ${order.customer_name}`,
          text: `Nueva membresía Cyber pagada. Coordinar inicio y activar en BoxMagic.\n\nCliente: ${order.customer_name}\nEmail: ${order.customer_email}\nTeléfono: ${order.customer_phone ?? "-"}\nCompra N° ${String(order.id).slice(0, 8).toUpperCase()}\n\n${lines}`,
        }),
      });
    } catch (e) {
      console.error("[cyber] staff email error", e);
    }
  }
}
