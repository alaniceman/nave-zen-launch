import { createClient } from 'npm:@supabase/supabase-js@2';
import { sendMetaEvent } from './metaCapi.ts';
import { upsertCustomerAndLogEvent } from './crm.ts';
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
 const date = new Date(`${e.date}T12:00:00Z`).toLocaleDateString('es-CL',{timeZone:'America/Santiago',day:'numeric',month:'long',year:'numeric'});
 const paid = `$${order.total_amount.toLocaleString('es-CL')}`;
 const heading = `Hola ${order.buyer_name},`;
 const receiptText = `${heading}\n\nTu compra está confirmada.\n${e.name}\nPedido ${order.id.slice(0,8).toUpperCase()}\n${order.quantity} entrada(s) · ${order.icefest_ticket_types.name}\nTotal pagado: ${paid} CLP\n${date} · ${e.schedule}\n\nRecibirás otro correo con tus entradas y qué llevar.\nNave Studio`;
 const ticketText = tickets.map(t => `Entrada ${t.ticket_number}: ${t.ticket_code}\n${origin}/icefest-santiago/entrada/${t.ticket_code}?token=${t.access_token}`).join('\n\n');
 const detailsText = `${heading}\n\nEstas son tus entradas para ${e.name}.\n${date} · ${e.schedule}\n${e.location}\n${e.address}\n\n${ticketText}\n\nMuestra el código al personal al llegar; cada entrada permite un único ingreso.\n\nQué llevar: ${e.instructions}${e.includes_cacao ? '\nRecuerda tu tazón para cacao.' : ''}${e.includes_lunch ? '\nIncluye almuerzo.' : '\nLleva snacks o tu comida para la jornada.'}\n\nCómo llegar: ${e.google_maps_link}${e.whatsapp_link ? `\nWhatsApp del evento: ${e.whatsapp_link}` : ''}\n\nSi tienes una condición cardiovascular, epilepsia, hipertensión no controlada o estás embarazada, consulta previamente con un profesional de salud. La respiración se practica fuera del agua. Inmersión guiada, máximo 2 minutos.\n\nNave Studio · studiolanave.com\nResponde a este correo si necesitas ayuda.`;
 const wrap = (text: string) => `<html><body style="margin:0;background:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;line-height:1.7;color:#1A1A1A;padding:24px"><div style="max-width:600px;margin:auto"><h1 style="color:#2E4D3A;font-size:24px">${escapeHtml(e.name)}</h1><div style="white-space:pre-line">${escapeHtml(text)}</div></div></body></html>`;
 const ticketLinks = tickets.map(t => `<p><strong>Entrada ${t.ticket_number} · ${escapeHtml(t.ticket_code)}</strong><br><a style="color:#2E4D3A" href="${origin}/icefest-santiago/entrada/${encodeURIComponent(t.ticket_code)}?token=${encodeURIComponent(t.access_token)}">Ver mi entrada</a></p>`).join('');
 return [{kind:'receipt',subject:`Compra confirmada · Icefest · ${order.id.slice(0,8).toUpperCase()}`,text:receiptText,html:wrap(receiptText)}, {kind:'details',subject:'Tus entradas y preparación · Icefest Santiago',text:detailsText,html:wrap(detailsText)+ticketLinks}];
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
 await sendMetaEvent({eventName:'Purchase',eventId:`purchase-icefest-${id}`,eventSourceUrl:`${icefestOrigin}/icefest-santiago/success`,funnel:'icefest',entityType:'icefest_order',entityId:id,supabase:db,user:{email:order.buyer_email,phone:order.buyer_phone,fullName:`${order.buyer_name} ${order.buyer_surname}`,...order.meta_context},custom:{value:order.total_amount,currency:'CLP',contentName:'Icefest Santiago',contentIds:[order.ticket_type_id],numItems:order.quantity,orderId:id}});
 await sendIcefestEmails(db,id);
 return json('icefest_paid');
}
