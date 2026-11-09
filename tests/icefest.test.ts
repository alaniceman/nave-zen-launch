import { describe,test,expect } from 'bun:test';
import { createClient } from '@supabase/supabase-js';
import { activeIcefestTier,normalizeIcefestPhone,type IcefestTier } from '../src/lib/icefest';
const tier=(values:Partial<IcefestTier>):IcefestTier=>({id:'general',event_id:'event',name:'Entrada general',description:'',price:95000,stock:null,stock_sold:0,max_per_order:10,valid_from:null,valid_until:null,display_order:1,is_active:true,...values});
describe('Icefest reglas de entradas',()=>{
 test('preventa agotada de 12 cupos pasa al precio general de 95000',()=>{const active=activeIcefestTier([tier({id:'preventa',price:67000,stock:12,stock_sold:12,display_order:0}),tier({})]);expect(active?.price).toBe(95000);});
 test('preventa desactivada no anuncia 12 cupos no confirmados',()=>{expect(activeIcefestTier([tier({price:67000,stock:12,display_order:0,is_active:false}),tier({})])?.price).toBe(95000);});
 test('preventa vence exactamente al límite',()=>{expect(activeIcefestTier([tier({id:'preventa',display_order:0,valid_until:'2026-11-09T23:00:00Z'}),tier({})],Date.parse('2026-11-09T23:00:00Z'))?.id).toBe('general');});
 test('teléfono chileno se normaliza a E164',()=>{expect(normalizeIcefestPhone('9 1234 5678')).toBe('+56912345678');});
});
const url=process.env.VITE_SUPABASE_URL,key=process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if(!url||!key)throw new Error('Falta configuración pública para verificar precios');
const client=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const payload={ticket_type_id:'9cefe570-2026-4000-8000-000000000003',quantity:2,buyer:{name:'Revisión',surname:'Nave',email:'revision@example.com',phone:'+56912345678'},accept_terms:true,quote:true};
describe('Icefest validación real sin crear compras',()=>{
 test('dos entradas generales cuestan exactamente 190000 CLP en servidor',async()=>{const {data,error}=await client.functions.invoke('icefest-checkout',{body:payload});expect(error).toBeNull();expect(data.total_amount).toBe(190000);expect(data.discount_amount).toBe(0);});
 test('no aceptar condiciones impide iniciar checkout',async()=>{const {error}=await client.functions.invoke('icefest-checkout',{body:{...payload,accept_terms:false}});expect(error).not.toBeNull();expect((error as any).context.status).toBe(400);});
 test('un cupón inexistente no descuenta precio',async()=>{const {error}=await client.functions.invoke('icefest-checkout',{body:{...payload,coupon:'NO-EXISTE-ICE-2026'}});expect(error).not.toBeNull();expect((error as any).context.status).toBe(400);});
 test('un visitante no puede reenviar desde el admin',async()=>{const {error}=await client.functions.invoke('icefest-admin',{body:{action:'resend',order_id:'9cefe570-2026-4000-8000-000000000001'}});expect(error).not.toBeNull();expect((error as any).context.status).toBe(403);});
 test('los pedidos privados no son públicos',async()=>{const {data,error}=await client.from('icefest_orders').select('id');expect(error).toBeNull();expect(data).toEqual([]);});
});
