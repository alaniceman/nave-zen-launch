import { createClient } from 'npm:@supabase/supabase-js@2';
import { sendMetaEvent } from './metaCapi.ts';
import { upsertCustomerAndLogEvent } from './crm.ts';
import { attributionOrigin } from './attribution.ts';
export const icefestDb = () => createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '');
export const icefestOrigin = (Deno.env.get('SITE_URL') || 'https://studiolanave.com').replace(/\/$/, '');
export const escapeHtml = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c));
export async function requireIcefestAdmin(req: Request, db: ReturnType<typeof icefestDb>) {
 const token = req.headers.get('authorization')?.replace(/^Bearer /,'');
 if (!token) throw new Error('Acceso denegado');
 const { data, error } = await db.auth.getUser(token);
 if (error || !data.user) throw new Error('Acceso denegado');
 const role = await db.rpc('has_role',{_user_id:data.user.id,_role:'admin'});
 if (role.error || !role.data) throw new Error('Acceso denegado');
 return data.user;
}
export function buildIcefestEmails(order: any, tickets: any[], origin = icefestOrigin) {
 const e = order.icefest_events;
 const date = new Date(`${e.date}T12:00:00Z`).toLocaleDateString('es-CL',{timeZone:'America/Santiago',weekday:'long',day:'numeric',month:'long',year:'numeric'});
 const paid = `$${order.total_amount.toLocaleString('es-CL')}`;
 const heading = `Hola ${order.buyer_name},`;
 const receiptText = `${heading}\n\nTu compra está confirmada.\n${e.name}\nPedido ${order.id.slice(0,8).toUpperCase()}\n${order.quantity} entrada(s) · ${order.icefest_ticket_types.name}\nTotal pagado: ${paid} CLP\n${date} · ${e.schedule}\n\nRecibirás otro correo con tus entradas y qué llevar.\nNave Studio`;
 const ticketText = tickets.map(t => `Entrada ${t.ticket_number}: ${t.ticket_code}\n${origin}/icefest-santiago/entrada/${t.ticket_code}?token=${t.access_token}`).join('\n\n');
 const safety = 'Si tienes una condición cardiovascular, epilepsia, hipertensión no controlada o estás embarazada, consulta previamente con un profesional de salud.';
 const preparation = [
  {title:'❄️ Baños de hielo',items:['Traje de baño (puesto).','Toalla grande.','Bolsa para ropa mojada y una muda seca.']},
  {title:'🌬️ Breathwork',items:['Mat de yoga o toalla seca para acostarte.','Mantita para taparte, según cómo esté el día.']},
  {title:'💃 Ecstatic Dance',items:['Ropa cómoda o festivalera.']},
  {title:'✨ Adicionales',items:['Botella de agua.','Snacks ligeros.','Bloqueador y gorro para el sol.',...(e.includes_cacao?['Tu tazón para la ceremonia de cacao.']:[])]},
 ];
 const preparationText = preparation.map(group=>`${group.title}\n${group.items.map(item=>`• ${item}`).join('\n')}`).join('\n\n');
 const admissionText = '1. Abre tu entrada desde el enlace o guarda tu código para mostrarlo al llegar.\n2. Muestra el código al personal del evento en la acreditación.\n3. El equipo revisará y validará tu entrada. Cada entrada permite un único ingreso.';
 const foodText = e.includes_lunch?'El evento incluye almuerzo.':'Lleva snacks o tu comida para la jornada.';
 const detailsText = `${heading}\n\nGracias por tu compra. Aquí están tus ${order.quantity} entrada(s) ${order.icefest_ticket_types.name} para ${e.name}.\n\n${ticketText}\n\n📅 Información del evento\nEvento: ${e.name}\nFecha: ${date}\nHorario: ${e.schedule}\nLugar: ${e.location}\n${e.address}\n\n🎟️ Cómo ingresar\n${admissionText}\n\n🎒 Qué llevar al evento\n${preparationText}\n\nIndicaciones del evento: ${e.instructions}\n\n🍽️ Comida\n${foodText}\n\n🗺️ Cómo llegar\n${e.location}\n${e.address}\nVer en Google Maps: ${e.google_maps_link}${e.whatsapp_link ? `\n\n💬 Únete al WhatsApp del evento\nÚnete al grupo oficial para compartir fotos, coordinar transporte y recibir información del evento.\n${e.whatsapp_link}` : ''}\n\n${safety}\n\nNave Studio · studiolanave.com\n¿Problemas? Responde a este email y te ayudaremos.`;
 const E=(v:any)=>escapeHtml(String(v??''));
 const font="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif";
 const row=(k:string,v:string)=>`<tr><td style="padding:10px 0;color:#6B7280;font-size:14px;border-bottom:1px solid #EEF0EE">${k}</td><td style="padding:10px 0;font-size:15px;font-weight:600;text-align:right;border-bottom:1px solid #EEF0EE">${v}</td></tr>`;
 const btn=(href:string,label:string,ghost=false)=>`<a href="${href}" style="display:inline-block;${ghost?'background:#ffffff;color:#2E4D3A;border:2px solid #2E4D3A':'background:#2E4D3A;color:#ffffff;border:2px solid #2E4D3A'};text-decoration:none;font-weight:700;font-size:15px;padding:13px 22px;border-radius:10px;margin:6px 4px">${label}</a>`;
 const shell=(pre:string,title:string,body:string)=>`<!doctype html><html><body style="margin:0;padding:0;background:#F3F5F2;${font};color:#1A1A1A;line-height:1.7"><span style="display:none;max-height:0;overflow:hidden">${E(pre)}</span><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F5F2;padding:24px 12px"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden"><tr><td style="background:#2E4D3A;padding:30px 28px;text-align:center;color:#ffffff"><div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;opacity:.8">Nave Studio presenta</div><div style="font-size:30px;font-weight:800;letter-spacing:1px;margin-top:6px">❄️ ${E(e.name)}</div><div style="font-size:14px;opacity:.9;margin-top:6px">${E(date)} · ${E(e.schedule)}</div></td></tr><tr><td style="padding:30px 28px"><h1 style="margin:0 0 12px;font-size:22px;color:#2E4D3A">${title}</h1>${body}</td></tr><tr><td style="background:#F8FAF7;padding:20px 28px;text-align:center;font-size:12px;color:#6B7280">Nave Studio · Antares 259, Las Condes · <a href="https://studiolanave.com" style="color:#2E4D3A">studiolanave.com</a><br>Responde a este correo si necesitas ayuda.</td></tr></table></td></tr></table></body></html>`;
 const receiptHtml=shell('Tu compra está confirmada',`¡Compra confirmada, ${E(order.buyer_name)}! 🎉`,`<p style="margin:0 0 18px">Ya eres parte del Icefest. En otro correo te enviamos tus entradas y qué llevar.</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row('Pedido',E(order.id.slice(0,8).toUpperCase()))}${row('Entradas',`${order.quantity} × ${E(order.icefest_ticket_types.name)}`)}${row('Fecha',`${E(date)}`)}${row('Horario',E(e.schedule))}${row('Lugar',E(e.location))}${row('Total pagado',`${paid} CLP`)}</table>`);
 const ticketCards=tickets.map(t=>`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;border:2px dashed #2E4D3A;border-radius:14px"><tr><td style="padding:18px;text-align:center"><div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6B7280">Entrada ${t.ticket_number}</div><div style="font-size:44px;font-weight:800;letter-spacing:4px;color:#2E4D3A;line-height:1.2;margin:4px 0">${E(t.ticket_code)}</div><a href="${origin}/icefest-santiago/entrada/${encodeURIComponent(t.ticket_code)}?token=${encodeURIComponent(t.access_token)}" style="color:#2E4D3A;font-size:14px;font-weight:600">Ver mi entrada →</a></td></tr></table>`).join('');
 const box=(t:string,b:string)=>`<div style="background:#F3F5F2;border-radius:12px;padding:16px 18px;margin:0 0 14px"><div style="font-weight:700;color:#2E4D3A;margin-bottom:4px">${t}</div><div style="font-size:14px">${b}</div></div>`;
 const preparationHtml = preparation.map(group=>`<div style="margin:14px 0"><strong style="color:#2E4D3A">${E(group.title)}</strong><ul style="margin:6px 0 0;padding-left:22px">${group.items.map(item=>`<li style="margin:4px 0">${E(item)}</li>`).join('')}</ul></div>`).join('');
 const detailsHtml=shell('Tus entradas y todo lo que necesitas para Icefest Santiago',`¡Hola ${E(order.buyer_name)}! 🎟️`,`<p style="margin:0 0 8px;font-weight:700;color:#2E4D3A">${E(order.icefest_ticket_types.name)} · ${order.quantity} entrada(s)</p><p style="margin:0 0 22px">Gracias por tu compra. Aquí están tus entradas para <strong>${E(e.name)}</strong>.</p>${ticketCards}${box('📅 Información del evento',`<strong>Evento:</strong> ${E(e.name)}<br><strong>Fecha:</strong> ${E(date)}<br><strong>Horario:</strong> ${E(e.schedule)}<br><strong>Lugar:</strong> ${E(e.location)}<br>${E(e.address)}`)}${box('🎟️ Cómo ingresar',`<ol style="margin:8px 0 0;padding-left:22px"><li style="margin:6px 0">Abre tu entrada desde el enlace o guarda tu código para mostrarlo al llegar.</li><li style="margin:6px 0">Muestra el código al personal del evento en la acreditación.</li><li style="margin:6px 0">El equipo revisará y validará tu entrada. Cada entrada permite un único ingreso.</li></ol>`)}${box('🎒 Qué llevar al evento',`${preparationHtml}<p style="margin:16px 0 0;font-size:13px"><strong>Indicaciones del evento:</strong> ${E(e.instructions)}</p>`)}${box('🍽️ Comida',E(foodText))}${box('🗺️ Cómo llegar',`<strong>${E(e.location)}</strong><br>${E(e.address)}<div style="text-align:center;margin-top:10px">${btn(E(e.google_maps_link),'Ver en Google Maps')}</div>`)}${e.whatsapp_link?box('💬 Únete al WhatsApp del evento',`Únete al grupo oficial para compartir fotos, coordinar transporte y recibir información del evento.<div style="text-align:center;margin-top:10px">${btn(E(e.whatsapp_link),'Unirse al grupo',true)}</div>`):''}<p style="font-size:12px;color:#6B7280;margin:18px 0 0">${E(safety)}</p>`);
 return [{kind:'receipt',subject:`Compra confirmada · Icefest · ${order.id.slice(0,8).toUpperCase()}`,text:receiptText,html:receiptHtml}, {kind:'details',subject:'Tus entradas y preparación · Icefest Santiago',text:detailsText,html:detailsHtml}];
}
export async function sendIcefestEmails(db: ReturnType<typeof icefestDb>, id: string, resend = false) {
 const key = Deno.env.get('RESEND_API_KEY');
 if (!key) throw new Error('El envío de correos no está configurado');
 const {data:claim,error:claimError} = await db.from('icefest_orders').update({email_lock_until:new Date(Date.now()+120000).toISOString()}).eq('id',id).eq('status','paid').or(`email_lock_until.is.null,email_lock_until.lt.${new Date().toISOString()}`).select('id');
 if (claimError) throw claimError;
 if (!claim?.length) return;
 try {
  const { data:order,error } = await db.from('icefest_orders').select('*,icefest_events(*),icefest_ticket_types(*)').eq('id',id).single();
  if (error) throw error;
  const { data:tickets,error:te } = await db.from('icefest_tickets').select('*').eq('order_id',id).order('ticket_number');
  if (te || !tickets?.length) throw new Error('No hay entradas emitidas');
  for (const email of buildIcefestEmails(order,tickets)) {
   const column = email.kind === 'receipt' ? 'receipt_sent_at' : 'details_sent_at';
   if (!resend && order[column]) continue;
   const suffix = resend ? `-${crypto.randomUUID()}` : '';
   const response = await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':`icefest-${email.kind}-${id}${suffix}`},body:JSON.stringify({from:'Nave Studio <agenda@studiolanave.com>',reply_to:'lanave@alaniceman.com',to:[order.buyer_email],subject:email.subject,html:email.html,text:email.text})});
   if (!response.ok) throw new Error(`Envío rechazado (${response.status}): ${(await response.text()).slice(0,400)}`);
   const saved = await db.from('icefest_orders').update({[column]:new Date().toISOString(),email_error:null}).eq('id',id);
   if (saved.error) throw saved.error;
   await new Promise(r=>setTimeout(r,1500));
  }
  // Idempotent admin notification, under the same paid-order email lock.
  // Historical/manual orders do not trigger new unsolicited notices.
  if (!order.admin_notification_sent_at && order.source === 'web' && (order.meta_context?.first_touch || order.meta_context?.last_touch)) {
   const origin = attributionOrigin(order.meta_context);
   const response = await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json','Idempotency-Key':`icefest-admin-sale-${id}`},body:JSON.stringify({from:'Nave Studio <agenda@studiolanave.com>',reply_to:'lanave@alaniceman.com',to:['lanave@alaniceman.com'],subject:`Nueva venta Icefest · ${order.buyer_name} ${order.buyer_surname}`,text:`Pedido: ${id}\nCliente: ${order.buyer_name} ${order.buyer_surname}\nEmail: ${order.buyer_email}\nEntradas: ${order.quantity}\nTotal: ${order.total_amount} CLP\nOrigen: ${origin}`,html:`<div style="font-family:Helvetica Neue,Arial,sans-serif;line-height:1.7"><h2>Nueva venta Icefest</h2><p>${escapeHtml(order.buyer_name)} ${escapeHtml(order.buyer_surname)} · ${escapeHtml(order.buyer_email)}</p><p>${order.quantity} entrada(s) · ${order.total_amount} CLP</p><p><strong>Origen:</strong> ${escapeHtml(origin)}</p><p>Pedido: ${escapeHtml(id)}</p></div>`})});
   if (!response.ok) throw new Error(`Aviso de venta (${response.status}): ${await response.text()}`);
   const saved = await db.from('icefest_orders').update({admin_notification_sent_at:new Date().toISOString()}).eq('id',id);
   if (saved.error) throw saved.error;
  }
 } catch(error) {
  await db.from('icefest_orders').update({email_error:error instanceof Error ? error.message : 'Error de envío'}).eq('id',id);
  throw error;
 } finally { await db.from('icefest_orders').update({email_lock_until:null}).eq('id',id); }
}
export async function handleIcefestPayment(payment: any, id: string, db: any, headers: Record<string,string>) {
 const json = (status: string, code=200) => new Response(JSON.stringify({status}),{status:code,headers:{...headers,'Content-Type':'application/json'}});
 const {data:order,error} = await db.from('icefest_orders').select('*').eq('id',id).single();
 if(error) throw error;
 if(payment.status==='refunded' || payment.status==='charged_back') {
  const result = await db.rpc('icefest_refund_order',{_order_id:id}); if(result.error) throw result.error;
  return json('icefest_refunded');
 }
 if(payment.status!=='approved') {
  if(order.status!=='paid' && order.status!=='refunded') {
   const changed = await db.from('icefest_orders').update({payment_status:payment.status,status:['rejected','cancelled'].includes(payment.status)?'failed':'pending'}).eq('id',id).neq('status','paid').neq('status','refunded');
   if(changed.error) throw changed.error;
  }
  return json('icefest_pending');
 }
 const {data:result,error:confirmError}=await db.rpc('icefest_confirm_order',{_order_id:id,_payment_id:String(payment.id),_amount:Math.round(payment.transaction_amount),_currency:payment.currency_id});
 if(confirmError) throw confirmError;
 if(!result?.ok) return json(`icefest_${result?.reason || 'needs_review'}`);
 if(result.first_time) await upsertCustomerAndLogEvent(db,{email:order.buyer_email,name:`${order.buyer_name} ${order.buyer_surname}`.trim(),phone:order.buyer_phone,eventType:'icefest_purchase',eventTitle:'Compra de entradas Icefest Santiago',amount:order.total_amount,statusIfNew:'purchased',metadata:{order_id:id,quantity:order.quantity}});
 await sendMetaEvent({eventName:'Purchase',eventId:`purchase-icefest-${id}`,eventSourceUrl:`${icefestOrigin}/icefest-santiago/success`,funnel:'icefest',entityType:'icefest_order',entityId:id,supabase:db,user:{email:order.buyer_email,phone:order.buyer_phone,fullName:`${order.buyer_name} ${order.buyer_surname}`,...(({utm,...m}:any)=>m)(order.meta_context||{})},custom:{value:order.total_amount,currency:'CLP',contentName:'Icefest Santiago',contentIds:[order.ticket_type_id],numItems:order.quantity,orderId:id}});
 await sendIcefestEmails(db,id);
 return json('icefest_paid');
}
