import { TALLERES, TALLER_PACK, tallerKeyFromNivel } from "./talleres.ts";
import { buildTallerParticipantEmail } from "./tallerParticipantEmail.ts";

const FROM = "Nave Studio <agenda@studiolanave.com>";
const REPLY_TO = "lanave@alaniceman.com";

function esc(s: unknown) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function htmlToText(html: string) {
  return html
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, "$2 ($1)")
    .replace(/<(br|\/p|\/div|\/li|\/h1|\/h2)>/gi, "\n")
    .replace(/<li>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Correo 1: comprobante de compra, corto y simple. */
export function buildTallerReceiptEmail(insc: any, paidAmount: number) {
  const isPack = insc.product_type === "pack";
  const qty = Math.max(1, Number(insc.quantity) || 1);
  const cfg = TALLERES[tallerKeyFromNivel(insc.nivel)];
  const producto = isPack ? TALLER_PACK.nombreCorto : `Taller ${cfg.nombreCorto} Método Wim Hof`;
  const fechas = isPack
    ? `${TALLERES.fundamentos.fechaLarga} y ${TALLERES.avanzado.fechaLarga}`
    : cfg.fechaLarga;
  const paid = (Number(paidAmount) || 0).toLocaleString("es-CL");
  const pedido = String(insc.id).slice(0, 8).toUpperCase();
  const nombre = insc.nombre ? `Hola ${esc(insc.nombre)},` : "Hola,";

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:24px 12px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#ffffff;color:#1A1A1A;line-height:1.7">
<div style="max-width:560px;margin:0 auto">
<p>${nombre}</p>
<p>Confirmamos tu compra en Nave Studio. Estos son los datos:</p>
<p style="margin:0">Pedido: ${pedido}<br>Producto: ${esc(producto)}<br>Fecha: ${esc(fechas)}<br>Personas: ${qty}<br>Total pagado: $${paid} CLP</p>
<p>En unos minutos te llegará un segundo correo con los detalles del taller: qué traer, cómo llegar y el grupo de WhatsApp.</p>
<p>Si no lo ves, revisa la carpeta de spam o promociones y márcanos como "no es spam".</p>
<p>Nave Studio<br>Antares 259, Las Condes<br>studiolanave.com</p>
</div></body></html>`;

  return { subject: `Compra confirmada · Pedido ${pedido} · Nave Studio`, html };
}

async function send(key: string, idem: string, to: string, subject: string, html: string) {
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idem },
    body: JSON.stringify({ from: FROM, reply_to: REPLY_TO, to: [to], subject, html, text: htmlToText(html) }),
  });
  return { ok: r.ok, error: r.ok ? null : await r.text() };
}

/** Envía primero el comprobante y luego el correo con los detalles. */
export async function sendTallerEmails(key: string, insc: any, paidAmount: number) {
  const receipt = buildTallerReceiptEmail(insc, paidAmount);
  const r1 = await send(key, `taller-receipt-${insc.id}`, insc.email, receipt.subject, receipt.html);
  // Resend: máx 2 req/seg
  await new Promise((r) => setTimeout(r, 1500));
  const details = buildTallerParticipantEmail(insc, paidAmount);
  const r2 = await send(key, `taller-details-${insc.id}`, insc.email, details.subject, details.html);
  return { ok: r1.ok && r2.ok, error: [r1.error, r2.error].filter(Boolean).join(" | ") || null };
}
