// Shared BoxMagic CTA block used in Plan de Prueba emails.
// BoxMagic does NOT support per-class deep links: always link to the members portal.

export const BOXMAGIC_WEB = "https://members.boxmagic.app/";
export const BOXMAGIC_APPSTORE = "https://apps.apple.com/cl/app/boxmagic-members/id6479632550";
export const BOXMAGIC_GOOGLEPLAY = "https://play.google.com/store/apps/details?id=app.boxmagic.members";

export function boxmagicBlockHtml(): string {
  return `
<div class="cta-row" style="text-align:center;margin:24px 0 12px">
  <a class="btn" href="${BOXMAGIC_WEB}" style="display:inline-block;background:#2E4D3A;color:#fff!important;padding:14px 28px;border-radius:10px;text-decoration:none;font-weight:600">Ver horarios y reservar</a>
</div>
<p style="font-size:14px;color:#4A4A4A;line-height:1.6;text-align:center;margin:0 0 14px">
  Entra a BoxMagic para revisar todos los horarios disponibles y reservar las clases que prefieras.
</p>
<p style="font-size:13px;color:#6B7280;line-height:1.7;text-align:center;margin:0 0 6px">
  Web: <a href="${BOXMAGIC_WEB}" style="color:#2E4D3A">members.boxmagic.app</a><br>
  <a href="${BOXMAGIC_APPSTORE}" style="color:#2E4D3A">Descargar en App Store</a>
  &nbsp;·&nbsp;
  <a href="${BOXMAGIC_GOOGLEPLAY}" style="color:#2E4D3A">Descargar en Google Play</a>
</p>`;
}

export function credentialsBlockHtml(email: string): string {
  return `
<div class="card" style="background:#F7F9FB;border-radius:12px;padding:18px 22px;margin:0 0 22px;border:1px solid #E2E8F0">
  <p style="margin:0 0 8px"><strong>Tus datos de acceso a BoxMagic</strong></p>
  <p style="margin:0 0 4px">Usuario: ${email}</p>
  <p style="margin:0">Clave: <strong>Nave7</strong> (solo si aún no la cambiaste)</p>
</div>`;
}
