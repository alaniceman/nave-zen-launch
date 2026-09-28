import {
  TALLERES,
  TALLER_PACK,
  TALLER_MAPS_URL,
  TALLER_WHATSAPP_GROUP_URL,
  tallerKeyFromNivel,
} from "./talleres.ts";

/** Correo de confirmación al participante (compra online o inscripción manual desde admin). */
export function buildTallerParticipantEmail(insc: any, paidAmount: number): { subject: string; html: string } {
  const isPack = insc.product_type === "pack";
  const quantity = Math.max(1, Number(insc.quantity) || 1);
  const tallerCfg = TALLERES[tallerKeyFromNivel(insc.nivel)];
  const nivelTxt = isPack ? TALLER_PACK.nombreCorto : tallerCfg.nombreCorto;
  const fechaLarga =
    !isPack && insc.fecha_evento && insc.fecha_evento !== tallerCfg.fechaISO
      ? new Intl.DateTimeFormat("es-CL", {
          timeZone: "America/Santiago",
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(new Date(`${insc.fecha_evento}T12:00:00Z`))
      : tallerCfg.fechaLarga;
  const mapsUrl = TALLER_MAPS_URL;
  const paid = Number(paidAmount) || 0;

  const cuposTxt = quantity > 1 ? ` — ${quantity} cupos` : "";
  const fechasHtml = isPack
    ? `<p style="margin:4px 0;font-size:14px;color:#1A1A1A"><strong>📅 ${TALLERES.fundamentos.nombreCorto}:</strong> ${TALLERES.fundamentos.fechaLarga} · ${TALLERES.fundamentos.horario} (${TALLERES.fundamentos.duracion})${cuposTxt}</p>
        <p style="margin:4px 0;font-size:14px;color:#1A1A1A"><strong>📅 ${TALLERES.avanzado.nombreCorto}:</strong> ${TALLERES.avanzado.fechaLarga} · ${TALLERES.avanzado.horario} (${TALLERES.avanzado.duracion})${cuposTxt}</p>`
    : `<p style="margin:4px 0;font-size:14px;color:#1A1A1A"><strong>📅 Fecha:</strong> ${fechaLarga}</p>
        <p style="margin:4px 0;font-size:14px;color:#1A1A1A"><strong>⏰ Horario:</strong> ${insc.horario} (${tallerCfg.duracion})</p>
        <p style="margin:4px 0;font-size:14px;color:#1A1A1A"><strong>👥 Personas:</strong> ${quantity} cupo(s)</p>`;

  const unitario = isPack
    ? TALLER_PACK.precio
    : Math.round((Number(insc.original_amount) || Number(insc.amount)) / quantity);
  const subtotalMail = unitario * quantity;
  const descuentoMail = isPack ? 0 : Number(insc.discount_amount) || 0;
  const desgloseHtml = `<div style="background:#F8FAFB;border:1px solid #E4E4E7;border-radius:12px;padding:16px 18px;margin:0 0 18px;font-size:14px;color:#3F3F46">
        <p style="margin:0 0 4px"><strong style="color:#1A1A1A">Detalle de tu compra</strong></p>
        <p style="margin:0">Producto: ${insc.taller_nombre}</p>
        <p style="margin:0">Personas: ${quantity}${isPack ? ` (${quantity} cupo(s) en Fundamentales + ${quantity} en Avanzado)` : ""}</p>
        <p style="margin:0">Valor unitario: $${unitario.toLocaleString("es-CL")} CLP</p>
        <p style="margin:0">Subtotal: $${subtotalMail.toLocaleString("es-CL")} CLP</p>
        ${descuentoMail > 0 ? `<p style="margin:0;color:#2E4D3A">Descuento: −$${descuentoMail.toLocaleString("es-CL")} CLP${insc.coupon_code ? ` (${insc.coupon_code})` : ""}</p>` : ""}
        <p style="margin:4px 0 0"><strong style="color:#1A1A1A">Total pagado: $${paid.toLocaleString("es-CL")} CLP</strong></p>
      </div>`;

  const packDetalleHtml = isPack
    ? `<div style="background:#FFF8E6;border:1px solid #E7C873;border-radius:12px;padding:16px 18px;margin:0 0 18px">
        <p style="margin:0 0 6px;font-size:14px;color:#1A1A1A"><strong>Compraste la Experiencia completa</strong> (Fundamentales + Avanzado)${quantity > 1 ? ` para ${quantity} personas` : ""}.</p>
        <p style="margin:0 0 6px;font-size:14px;color:#1A1A1A">Tienes <strong>${quantity} cupo(s) en el taller Fundamentales (sábado 3 de octubre)</strong> y <strong>${quantity} cupo(s) en el taller Avanzado (domingo 4 de octubre)</strong>.</p>
        <p style="margin:0;font-size:14px;color:#3F3F46">Total $${(TALLER_PACK.precio * quantity).toLocaleString("es-CL")} CLP en vez de $${(TALLER_PACK.precioNormal * quantity).toLocaleString("es-CL")} · ahorras $${(TALLER_PACK.ahorro * quantity).toLocaleString("es-CL")} con ${TALLER_PACK.descuentoAvanzadoPct}% de descuento aplicado al taller Avanzado.</p>
      </div>`
    : "";

  const progresionHtml = isPack
    ? `<p style="color:#3F3F46;font-size:15px;margin:0 0 14px">Fundamentales te entrega la base técnica para participar en el Avanzado al día siguiente. El desafío del Avanzado no es una prueba de fuerza física: es principalmente mental y requiere foco y disposición a desafiarte. Si al terminar Fundamentales sientes que tu mente está preparada, puedes continuar con el Avanzado.</p>`
    : "";

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:24px 12px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;background:#F4F4F5;line-height:1.7">
  <div style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden">
    <div style="background:#2E4D3A;padding:36px 28px;text-align:center;color:#ffffff">
      <h1 style="margin:0;font-size:22px;font-weight:600">${
        isPack
          ? `¡Tus ${quantity * 2} cupos están confirmados!`
          : quantity > 1
          ? `¡Tus ${quantity} cupos están confirmados!`
          : "¡Tu cupo está confirmado!"
      }</h1>
      <p style="margin:6px 0 0;font-size:14px;opacity:.85">${isPack ? "Talleres Fundamentales + Avanzado" : `Taller ${nivelTxt}`} · Método Wim Hof</p>
    </div>
    <div style="padding:28px">
      <h2 style="font-size:18px;color:#1A1A1A;margin:0 0 12px">Hola ${insc.nombre} 👋</h2>
      <p style="color:#3F3F46;font-size:15px;margin:0 0 18px">Recibimos tu pago y ${quantity > 1 ? `tus <strong>${quantity} cupos</strong>` : "tu lugar"} en el <strong>${insc.taller_nombre}</strong> ${quantity > 1 ? "quedaron reservados" : "quedó reservado"}. Prepárate para respirar, entrar al hielo y conectar con tu poder.</p>

      ${packDetalleHtml}
      ${desgloseHtml}

      <div style="background:#EEF6F1;border:2px solid #2E4D3A;border-radius:12px;padding:20px;margin:0 0 20px">
        <p style="margin:0 0 6px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#2E4D3A;font-weight:700">Paso 1 · Entra al grupo de WhatsApp</p>
        <p style="margin:0 0 14px;font-size:15px;color:#1A1A1A">Ahí compartimos las fotos del taller y todas las actualizaciones antes y después del día. Es el canal oficial del grupo.</p>
        <a href="${TALLER_WHATSAPP_GROUP_URL}" style="display:inline-block;background:#2E4D3A;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:10px;font-weight:600;font-size:15px">Entrar al grupo de WhatsApp</a>
      </div>

      <div style="background:#F8FAFB;border-left:4px solid #2E4D3A;padding:16px 18px;border-radius:8px;margin:18px 0">
        ${fechasHtml}
        <p style="margin:4px 0;font-size:14px;color:#1A1A1A"><strong>📍 Lugar:</strong> Nave Studio, Antares 259, Las Condes — <a href="${mapsUrl}" style="color:#2E4D3A">ver mapa</a></p>
        <p style="margin:4px 0;font-size:14px;color:#1A1A1A"><strong>💸 Pagado:</strong> $${paid.toLocaleString("es-CL")} CLP</p>
      </div>
      ${progresionHtml}
      <p style="color:#3F3F46;font-size:15px;margin:0 0 8px"><strong>Qué traer:</strong></p>
      <ul style="color:#3F3F46;font-size:15px;margin:0 0 14px;padding-left:20px">
        <li>Traje de baño y toalla grande</li>
        <li>Bolsa para ropa mojada</li>
        <li>Ropa cómoda y abrigada para después</li>
        <li>Botella de agua</li>
      </ul>
      <p style="color:#3F3F46;font-size:15px;margin:0 0 14px">Te recomendamos llegar 15 minutos antes y venir con una comida ligera (idealmente 2 horas antes).</p>
      <p style="color:#71717A;font-size:13px;margin:0">¿Dudas? Escríbenos por <a href="https://wa.me/56946120426" style="color:#2E4D3A">WhatsApp +56 9 4612 0426</a>.</p>
    </div>
    <div style="padding:20px 28px;text-align:center;background:#FAFAFA;color:#71717A;font-size:12px">Nave Studio · studiolanave.com</div>
  </div>
</body></html>`;

  const subject = isPack
    ? `Tus ${quantity * 2} cupos están confirmados · Talleres Wim Hof 3 y 4 de octubre`
    : `${quantity > 1 ? `${quantity} cupos confirmados` : "Cupo confirmado"} · Taller ${nivelTxt} Método Wim Hof · ${fechaLarga}`;

  return { subject, html };
}
