import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { icefestDb,icefestOrigin,sendIcefestEmails } from '../_shared/icefest.ts';
const schema=z.object({ticket_type_id:z.string().uuid(),quantity:z.number().int().min(1).max(50),buyer:z.object({name:z.string().trim().min(1).max(100),surname:z.string().trim().min(1).max(100),email:z.string().trim().email().max(255),phone:z.string().regex(/^\+[1-9]\d{7,14}$/)}),coupon:z.string().trim().max(50).optional(),accept_terms:z.literal(true),quote:z.boolean().optional(),meta:z.object({fbp:z.string().max(500).optional(),fbc:z.string().max(500).optional(),clientUserAgent:z.string().max(1000).optional(),utm:z.object({source:z.string().max(200).optional(),medium:z.string().max(200).optional(),campaign:z.string().max(300).optional(),content:z.string().max(300).optional(),term:z.string().max(300).optional(),referrer:z.string().max(500).optional()}).optional()}).optional()});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders});
 const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...corsHeaders,'Content-Type':'application/json'}});
 try{
  const parsed=schema.safeParse(await req.json());if(!parsed.success)return json({error:'Completa los datos y acepta las condiciones',details:parsed.error.flatten()},400);
  const b=parsed.data,db=icefestDb();
  if(b.quote){const q=await db.rpc('icefest_price',{_type_id:b.ticket_type_id,_quantity:b.quantity,_coupon:b.coupon||null});if(q.error)throw q.error;return json(q.data);}
  const {data:order,error}=await db.rpc('icefest_reserve_order',{_type_id:b.ticket_type_id,_quantity:b.quantity,_buyer:b.buyer,_coupon:b.coupon||null,_meta:b.meta||{}});if(error)throw error;
  if(order.total_amount===0){const c=await db.rpc('icefest_confirm_order',{_order_id:order.id,_payment_id:null,_amount:0,_currency:'CLP'});if(c.error||!c.data?.ok)throw new Error('No se pudo confirmar la entrada gratuita');await sendIcefestEmails(db,order.id);return json({redirect_url:`${icefestOrigin}/icefest-santiago/success?order=${order.id}&token=${order.access_token}`});}
  try {
   const token=Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');if(!token)throw new Error('Mercado Pago no está configurado');
   const back=`${icefestOrigin}/icefest-santiago`;
   const query=`order=${order.id}&token=${order.access_token}`;
   const response=await fetch('https://api.mercadopago.com/checkout/preferences',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({items:[{id:b.ticket_type_id,title:`Icefest Santiago · ${b.quantity} entrada(s)`,quantity:1,unit_price:order.total_amount,currency_id:'CLP'}],payer:{name:b.buyer.name,surname:b.buyer.surname,email:b.buyer.email},external_reference:order.id,back_urls:{success:`${back}/success?${query}`,pending:`${back}/pending?${query}`,failure:`${back}/failure?${query}`},notification_url:`${Deno.env.get('SUPABASE_URL')}/functions/v1/mercadopago-webhook`,auto_return:'approved',payment_methods:{installments:3},expires:true,expiration_date_to:order.reserved_until,metadata:{funnel:'icefest',order_id:order.id}})});
   if(!response.ok)throw new Error(`Mercado Pago (${response.status}): ${(await response.text()).slice(0,400)}`);
   const preference=await response.json();if(!preference.init_point)throw new Error('Mercado Pago no devolvió el enlace de pago');
   const saved=await db.from('icefest_orders').update({preference_id:preference.id}).eq('id',order.id);if(saved.error)throw saved.error;
   return json({init_point:preference.init_point,order_id:order.id,access_token:order.access_token});
  }catch(error){await db.from('icefest_orders').update({status:'failed',admin_notes:'No se pudo iniciar el pago'}).eq('id',order.id).eq('status','pending');throw error;}
 }catch(error){return json({error:error instanceof Error?error.message:(error as any)?.message||'No se pudo iniciar el pago'},400);}
});
