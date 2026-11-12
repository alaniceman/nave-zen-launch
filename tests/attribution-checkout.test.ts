import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { z } from 'zod';
import { cleanAttribution } from '../supabase/functions/_shared/attribution';

// Execute the actual handlers with isolated database/fetch doubles; no remote calls, rows or payments.
const first = { utm_source:'facebook',utm_medium:'paid_social',utm_campaign:'icefest',utm_content:'video',captured_at:'2026-11-12T15:22:00Z',captured_at_chile:'2026-11-12 12:22:00',timezone:'America/Santiago',landing_page:'/icefest-santiago' };
const last = {...first,utm_source:'google',utm_medium:'cpc'};
async function simulate(file: string, body: object) {
 let handler: ((r: Request)=>Promise<Response>) | undefined;
 let insert: any, rpcMeta: any, preference: any;
 const order={id:'00000000-0000-4000-8000-000000000001',total_amount:95000,reserved_until:'2026-11-12T16:00:00Z',access_token:'local-token'};
 const db={from:(table:string)=>{
  const chain:any={select:()=>chain,eq:()=>chain,insert:(v:any)=>{insert=v;return chain;},update:()=>chain,maybeSingle:async()=>({data:null}),single:async()=>({data:table==='session_packages'?{id:'00000000-0000-4000-8000-000000000002',name:'Bono',price_clp:30000,sessions_quantity:1,is_active:true}:order}),then:(resolve:any)=>resolve({data:order})};return chain;
 },rpc:async(name:string,args:any)=>{if(name==='icefest_reserve_order')rpcMeta=args._meta;return {data:order};}};
 const source=readFileSync(file,'utf8').replace(/^import .*;\s*$/gm,'');
 const js=new Bun.Transpiler({loader:'ts'}).transformSync(source);
 runInNewContext(js,{z,cleanAttribution,serve:(h:any)=>{handler=h;},createClient:()=>db,getCorsHeaders:()=>({}),corsHeaders:{},icefestDb:()=>db,icefestOrigin:'https://studiolanave.com',sendIcefestEmails:async()=>{},Deno:{env:{get:(k:string)=>k==='SITE_URL'?'https://studiolanave.com':'local-placeholder'},serve:(h:any)=>{handler=h;}},Request,Response,console:{log:()=>{},error:()=>{}},fetch:async(url:string,init:any)=>{if(!url.startsWith('https://api.mercadopago.com/'))throw new Error('Unexpected outbound call');preference=JSON.parse(init.body);return new Response(JSON.stringify({id:'local-preference',init_point:'https://mercadopago.cl/local-only'}));}});
 if(!handler)throw new Error('Handler not captured');
 const response=await handler(new Request('https://local.invalid',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}));
 expect(response.status).toBe(200);
 return {insert,rpcMeta,preference};
}
test('Icefest stores both touches and sends both in preference metadata',async()=>{
 const r=await simulate('supabase/functions/icefest-checkout/index.ts',{ticket_type_id:'00000000-0000-4000-8000-000000000002',quantity:1,buyer:{name:'Local',surname:'Only',email:'local@example.invalid',phone:'+56912345678'},accept_terms:true,meta:{first_touch:first,last_touch:last}});
 expect(r.rpcMeta.first_touch.utm_source).toBe('facebook');expect(r.rpcMeta.last_touch.utm_source).toBe('google');expect(r.preference.metadata.first_touch).toEqual(r.rpcMeta.first_touch);expect(r.preference.metadata.last_touch).toEqual(r.rpcMeta.last_touch);expect(r.preference.external_reference).toBe('00000000-0000-4000-8000-000000000001');
});
test('Bonos stores both touches and sends both in preference metadata',async()=>{
 const r=await simulate('supabase/functions/purchase-session-package/index.ts',{packageId:'00000000-0000-4000-8000-000000000002',buyerName:'Local Only',buyerEmail:'local@example.invalid',buyerPhone:'+56912345678',first_touch:first,last_touch:last});
 expect(r.insert.meta_context.first_touch.utm_source).toBe('facebook');expect(r.insert.meta_context.last_touch.utm_source).toBe('google');expect(r.preference.metadata.first_touch).toEqual(r.insert.meta_context.first_touch);expect(r.preference.metadata.last_touch).toEqual(r.insert.meta_context.last_touch);
});
test('Bonos without UTM still creates the unchanged payment payload',async()=>{
 const r=await simulate('supabase/functions/purchase-session-package/index.ts',{packageId:'00000000-0000-4000-8000-000000000002',buyerName:'Local Only',buyerEmail:'local@example.invalid',buyerPhone:'+56912345678'});expect(r.preference.items[0].unit_price).toBe(30000);expect(r.preference.metadata).toEqual({});
});