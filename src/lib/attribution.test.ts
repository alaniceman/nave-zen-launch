import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { cleanAttribution } from '../../supabase/functions/_shared/attribution';
beforeEach(()=>{vi.resetModules();localStorage.clear();sessionStorage.clear();for(const c of document.cookie.split(';'))document.cookie=`${c.split('=')[0].trim()}=; Max-Age=0; Path=/`;history.replaceState({},'', '/');});
afterEach(()=>vi.useRealTimers());
it('captures first and last touch, preserves first and updates only campaign visits',async()=>{
 const {captureAttribution}=await import('./attribution');
 history.replaceState({},'', '/icefest-santiago?utm_source=facebook&utm_medium=paid&utm_campaign=icefest&utm_content=video&fbclid=click1');
 const a=captureAttribution();expect(a.first_touch?.utm_source).toBe('facebook');expect(a.last_touch?.fbclid).toBe('click1');
 history.replaceState({},'', '/bonos');expect(captureAttribution().last_touch).toEqual(a.last_touch);
 history.replaceState({},'', '/bonos?utm_source=google&gclid=click2');const b=captureAttribution();expect(b.first_touch).toEqual(a.first_touch);expect(b.last_touch?.utm_source).toBe('google');expect(b.last_touch?.gclid).toBe('click2');
});
it('expires after 90 days without campaign renewal',async()=>{
 vi.useFakeTimers();vi.setSystemTime(new Date('2026-11-12T15:22:00Z'));
 const {captureAttribution,ATTRIBUTION_KEY}=await import('./attribution');history.replaceState({},'', '/?utm_source=facebook');captureAttribution();
 expect(JSON.parse(localStorage.getItem(ATTRIBUTION_KEY)||'{}').expires_at-Date.now()).toBe(90*24*60*60*1000);
 vi.setSystemTime(new Date(Date.now()+90*24*60*60*1000+1));history.replaceState({},'', '/bonos');expect(captureAttribution().first_touch?.utm_source).toBe('directo');
});
it('direct entry stores Chile time and excludes private parameters',async()=>{
 const {captureAttribution}=await import('./attribution');history.replaceState({},'', '/icefest-santiago/success?token=private&email=private');const a=captureAttribution();
 expect(a.first_touch?.utm_source).toBe('directo');expect(a.first_touch?.timezone).toBe('America/Santiago');expect(a.first_touch?.landing_page).toBe('/icefest-santiago/success');expect(a.first_touch?.captured_at_chile).toBeTruthy();
});
it('cookie restores both touches after localStorage is cleared',async()=>{
 let module=await import('./attribution');history.replaceState({},'', '/?utm_source=facebook&utm_campaign=icefest');const a=module.captureAttribution();localStorage.clear();vi.resetModules();module=await import('./attribution');history.replaceState({},'', '/bonos');expect(module.captureAttribution()).toEqual(a);
});
it('invalid optional attribution cannot fail checkout',()=>{expect(cleanAttribution({first_touch:'broken',last_touch:{}})).toEqual({first_touch:undefined,last_touch:undefined});});