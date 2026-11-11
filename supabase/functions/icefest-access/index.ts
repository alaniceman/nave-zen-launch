import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3';
import { icefestDb,sendIcefestEmails } from '../_shared/icefest.ts';
const schema=z.discriminatedUnion('action',[z.object({action:z.literal('order'),id:z.string().uuid(),token:z.string().uuid()}),z.object({action:z.literal('ticket'),code:z.string().max(100),token:z.string().uuid()}),z.object({action:z.literal('recover'),email:z.string().trim().email().max(255)})]);
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:corsHeaders});
 const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...corsHeaders,'Content-Type':'application/json'}});
 try{
  const parsed=schema.safeParse(await req.json());if(!parsed.success)return json({error:'Solicitud inválida'},400);
  const b=parsed.data,db=icefestDb();
  if(b.action==='recover'){
   const {data:orders,error}=await db.from('icefest_orders').select('id,recovery_sent_at').eq('buyer_email',b.email.toLowerCase()).eq('status','paid').order('created_at',{ascending:false}).limit(10);if(error)throw error;
   for(const o of orders||[]){
    const cutoff=new Date(Date.now()-3600000).toISOString();
    const claim=await db.from('icefest_orders').update({recovery_sent_at:new Date().toISOString()}).eq('id',o.id).or(`recovery_sent_at.is.null,recovery_sent_at.lt.${cutoff}`).select('id');
    if(claim.data?.length)await sendIcefestEmails(db,o.id,true);
   }
   return json({message:'Si hay compras con ese correo, recibirás tus entradas. Revisa también spam. Los reenvíos se limitan a uno por hora.'});
  }
  if(b.action==='ticket'){
   const {data:t,error}=await db.from('icefest_tickets').select('ticket_code,ticket_number,checked_in,checked_in_at,is_valid,icefest_orders(status,buyer_name,buyer_surname,icefest_events(name,date,schedule,location,address))').eq('ticket_code',b.code.toUpperCase()).eq('access_token',b.token).maybeSingle();
   if(error)throw error;if(!t)return json({error:'Entrada no encontrada o enlace inválido'},404);return json(t);
  }
  const {data:o,error}=await db.from('icefest_orders').select('id,status,quantity,total_amount,buyer_name,buyer_surname,buyer_email,buyer_phone,icefest_events(name,date,schedule,location)').eq('id',b.id).eq('access_token',b.token).maybeSingle();
  if(error)throw error;if(!o)return json({error:'Pedido no encontrado o enlace inválido'},404);
  let tickets:unknown[]=[];
  if(o.status==='paid'){const result=await db.from('icefest_tickets').select('ticket_code,ticket_number,access_token,checked_in,is_valid').eq('order_id',o.id).order('ticket_number');if(result.error)throw result.error;tickets=result.data||[];}
  return json({...o,tickets});
 }catch{ return json({error:'No se pudo completar la solicitud. Intenta nuevamente.'},400); }
});
