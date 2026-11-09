import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus,Plus,ArrowRight,Loader2 } from 'lucide-react';
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { IcefestTier,icefestCall,icefestMoney,normalizeIcefestPhone } from '@/lib/icefest';
import { trackMetaClientEvent } from '@/lib/metaTracking';
import { getMetaBrowserContext } from '@/lib/metaPixel';
export function IcefestCheckout({tier,open,onOpenChange}:{tier:IcefestTier|null;open:boolean;onOpenChange:(v:boolean)=>void}) {
 const [quantity,setQuantity]=useState(1),[buyer,setBuyer]=useState({name:'',surname:'',email:'',phone:''}),[coupon,setCoupon]=useState(''),[accepted,setAccepted]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[quote,setQuote]=useState<{total_amount:number;discount_amount:number}|null>(null);
 useEffect(()=>{setQuote(null);setError('');},[quantity,coupon,tier?.id]);
 useEffect(()=>{if(open&&tier)trackMetaClientEvent('InitiateCheckout',{contentName:'Icefest Santiago',contentIds:[tier.id],value:tier.price*quantity,currency:'CLP',funnel:'icefest'});},[open,tier?.id]);
 if(!tier)return null;
 const payload={ticket_type_id:tier.id,quantity,buyer:{...buyer,phone:normalizeIcefestPhone(buyer.phone)},coupon,accept_terms:accepted};
 async function submit(e:React.FormEvent){e.preventDefault();setError('');setBusy(true);try{const result=await icefestCall('icefest-checkout',{...payload,meta:getMetaBrowserContext()});window.location.assign(result.init_point||result.redirect_url);}catch(e){setError(e instanceof Error?e.message:'No se pudo iniciar el pago');}finally{setBusy(false);}}
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-w-lg max-h-[90dvh] overflow-y-auto"><DialogHeader><DialogTitle>Tu entrada a Icefest Santiago</DialogTitle><DialogDescription>{tier.name} · {icefestMoney(tier.price)} por persona</DialogDescription></DialogHeader><form onSubmit={submit} className="space-y-5">
 <div className="flex justify-between items-center"><Label>Entradas</Label><div className="flex items-center gap-4"><Button type="button" variant="outline" size="icon" aria-label="Quitar entrada" disabled={quantity<=1} onClick={()=>setQuantity(q=>q-1)}><Minus className="h-4 w-4"/></Button><span className="w-6 text-center font-bold">{quantity}</span><Button type="button" variant="outline" size="icon" aria-label="Agregar entrada" disabled={quantity>=tier.max_per_order || (tier.stock!==null&&quantity>=tier.stock-tier.stock_sold)} onClick={()=>setQuantity(q=>q+1)}><Plus className="h-4 w-4"/></Button></div></div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{([{key:'name',label:'Nombre',type:'text'},{key:'surname',label:'Apellido',type:'text'},{key:'email',label:'Email',type:'email'},{key:'phone',label:'WhatsApp',type:'tel'}] as const).map(f=><div key={f.key} className="space-y-2"><Label htmlFor={`icefest-${f.key}`}>{f.label}</Label><Input id={`icefest-${f.key}`} type={f.type} required maxLength={f.key==='email'?255:100} value={buyer[f.key]} placeholder={f.key==='phone'?'+56 9':''} onChange={e=>setBuyer({...buyer,[f.key]:e.target.value})}/></div>)}</div>
 <div className="space-y-2"><Label htmlFor="icefest-coupon">Cupón de descuento (opcional)</Label><Input id="icefest-coupon" value={coupon} onChange={e=>setCoupon(e.target.value.replace(/\s/g,'').toUpperCase())}/></div>
 <div className="flex items-start gap-3"><Checkbox id="icefest-terms" checked={accepted} onCheckedChange={v=>setAccepted(v===true)}/><Label htmlFor="icefest-terms" className="text-sm leading-relaxed">Acepto los <Link to="/terminos" className="underline">términos</Link> y la <Link to="/privacidad" className="underline">política de privacidad</Link>. Entiendo que las prácticas son guiadas, voluntarias y no reemplazan atención médica.</Label></div>
 <Button type="button" variant="outline" className="w-full" disabled={!accepted||busy} onClick={async()=>{setBusy(true);setError('');try{setQuote(await icefestCall('icefest-checkout',{...payload,quote:true}));}catch(e){setError(e instanceof Error?e.message:'No se pudo calcular');}finally{setBusy(false);}}}>Revisar total y descuentos</Button>
 <div className="border-t pt-4 flex justify-between items-center"><span>Total {quote?.discount_amount?`· descuento ${icefestMoney(quote.discount_amount)}`:''}</span><strong className="text-2xl">{icefestMoney(quote?.total_amount??tier.price*quantity)}</strong></div>
 {error&&<p role="alert" className="text-destructive text-sm">{error}</p>}<Button type="submit" size="lg" className="w-full" disabled={!accepted||busy}>{busy?<Loader2 className="mr-2 h-4 w-4 animate-spin"/>:<ArrowRight className="mr-2 h-4 w-4"/>}Continuar al pago</Button><p className="text-xs text-muted-foreground">Mercado Pago · Las cuotas y sus condiciones se muestran al pagar.</p>
 </form></DialogContent></Dialog>;
}
