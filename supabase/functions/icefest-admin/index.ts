import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { icefestDb,requireIcefestAdmin,sendIcefestEmails } from '../_shared/icefest.ts';
const schema=z.discriminatedUnion('action',[
 z.object({action:z.literal('delete'),order_id:z.string().uuid()}),
 z.object({action:z.literal('resend'),order_id:z.string().uuid()}),
 z.object({action:z.literal('manual'),ticket_type_id:z.string().uuid(),quantity:z.number().int().min(1).max(50),amount:z.number().int().min(0).max(10000000),buyer:z.object({name:z.string().trim().min(1).max(100),surname:z.string().trim().max(100),email:z.string().trim().email(),phone:z.string().regex(/^\+[1-9]\d{7,14}$/)}),send_email:z.boolean()}),
 z.object({action:z.literal('retry'),order_id:z.string().uuid()})
]);
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders});
 const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...corsHeaders,'Content-Type':'application/json'}});
 try{
  const db=icefestDb();const admin=await requireIcefestAdmin(req,db);
  const parsed=schema.safeParse(await req.json());if(!parsed.success)return json({error:'Datos inválidos',details:parsed.error.flatten()},400);
  const b=parsed.data;
  if(b.action==='delete'){
   const {data,error}=await db.rpc('icefest_delete_order',{_order_id:b.order_id,_admin_id:admin.id});
   if(error)throw error;
   if(!data?.ok)throw new Error('El registro ya no existe');
   return json({ok:true});
  }
  if(b.action==='resend'){await sendIcefestEmails(db,b.order_id,true);return json({ok:true});}
  if(b.action==='retry'){
   const {data:o,error}=await db.from('icefest_orders').select('*').eq('id',b.order_id).single();if(error)throw error;
   if(o.source!=='admin_manual' && !o.payment_id)throw new Error('No hay pago confirmado para reintentar');
   if(o.source!=='admin_manual'){
    const r=await fetch(`https://api.mercadopago.com/v1/payments/${o.payment_id}`,{headers:{Authorization:`Bearer ${Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')}`}});
    if(!r.ok)throw new Error('No se pudo verificar el pago');const p=await r.json();
    if(p.status!=='approved'||p.external_reference!==o.id||p.currency_id!=='CLP'||p.transaction_amount!==o.total_amount)throw new Error('Pago no aprobado o no coincide con el pedido');
   }
   const c=await db.rpc('icefest_confirm_order',{_order_id:o.id,_payment_id:o.payment_id,_amount:o.total_amount,_currency:'CLP'});if(c.error||!c.data?.ok)throw new Error(c.data?.reason||c.error?.message||'No se pudo confirmar');await sendIcefestEmails(db,o.id);return json({ok:true});
  }
  const {data:t,error:te}=await db.from('icefest_ticket_types').select('*').eq('id',b.ticket_type_id).single();if(te)throw te;
  const {data:o,error}=await db.from('icefest_orders').insert({event_id:t.event_id,ticket_type_id:t.id,buyer_name:b.buyer.name,buyer_surname:b.buyer.surname,buyer_email:b.buyer.email.toLowerCase(),buyer_phone:b.buyer.phone,quantity:b.quantity,original_amount:t.price*b.quantity,total_amount:b.amount,discount_amount:Math.max(0,t.price*b.quantity-b.amount),source:'admin_manual',reserved_until:new Date().toISOString()}).select('id').single();if(error)throw error;
  const c=await db.rpc('icefest_confirm_order',{_order_id:o.id,_payment_id:null,_amount:b.amount,_currency:'CLP'});if(c.error)throw c.error;
  if(!c.data?.ok){await db.from('icefest_orders').update({status:'failed',admin_notes:'Inscripción manual sin cupo; no se emitieron entradas'}).eq('id',o.id);throw new Error('No quedan cupos: no se emitieron entradas');}
  if(b.send_email)await sendIcefestEmails(db,o.id);return json({ok:true,order_id:o.id});
 }catch(error){const message=error instanceof Error?error.message:(error as any)?.message||'No se pudo guardar';return json({error:message},message==='Acceso denegado'?403:400);}
});
