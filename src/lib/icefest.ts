import { supabase } from '@/integrations/supabase/client';
import { ICEFEST_DEPOSIT_TIER_ID } from '../../supabase/functions/_shared/icefestDeposit';
import { FunctionsHttpError } from '@supabase/supabase-js';
export type IcefestEvent = { id:string; slug:string; name:string; date:string; schedule:string; location:string; address:string; description:string; google_maps_link:string; whatsapp_link:string; instructions:string; includes_lunch:boolean; includes_cacao:boolean; is_active:boolean; sales_open:boolean };
export type IcefestTier = { id:string; event_id:string; name:string; description:string; price:number; stock:number|null; stock_sold:number; max_per_order:number; valid_from:string|null; valid_until:string|null; display_order:number; is_active:boolean };
export type IcefestDiscount = { id:string; event_id:string; ticket_type_id:string|null; name:string; code:string|null; discount_type:string; discount_value:number; min_quantity:number; max_quantity:number|null; min_purchase_amount:number; max_uses:number|null; times_used:number; combinable:boolean; valid_from:string|null; valid_until:string|null; is_active:boolean };
export const icefestMoney = (n:number) => `$${n.toLocaleString('es-CL')}`;
export const icefestDate = (date:string) => new Date(`${date}T12:00:00Z`).toLocaleDateString('es-CL',{timeZone:'America/Santiago',weekday:'long',day:'numeric',month:'long',year:'numeric'});
export function activeIcefestTier(tiers:IcefestTier[], now=Date.now()) {
 return [...tiers].sort((a,b)=>a.display_order-b.display_order).find(t=>t.id !== ICEFEST_DEPOSIT_TIER_ID && t.is_active && (!t.valid_from || new Date(t.valid_from).getTime()<=now) && (!t.valid_until || new Date(t.valid_until).getTime()>now) && (t.stock===null || t.stock_sold<t.stock)) || null;
}
export async function icefestCall<T=any>(name:string,body:unknown):Promise<T> {
 const {data,error}=await supabase.functions.invoke(name,{body: body as Record<string, unknown>});
 if(error){if(error instanceof FunctionsHttpError){const text=await error.context.text();try{throw new Error(JSON.parse(text).error||text);}catch(e){if(e instanceof SyntaxError)throw new Error('No se pudo completar la solicitud');throw e;}}throw error;}
 if(data?.error)throw new Error(data.error);return data;
}
export function normalizeIcefestPhone(raw:string){const digits=raw.replace(/\D/g,'');return digits.length===9?`+56${digits}`:digits.length===8?`+569${digits}`:`+${digits}`;}
export const ICEFEST_PATH='/icefest-santiago';
