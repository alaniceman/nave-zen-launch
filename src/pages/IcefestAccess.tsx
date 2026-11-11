import { useEffect,useState } from 'react';
import { Link,useLocation,useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Ticket,CheckCircle,Clock,Loader2,Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IcefestPrepUpsell } from '@/components/icefest/IcefestPrepUpsell';
import { trackMetaEventOnce } from '@/lib/metaPixel';
import { icefestCall,icefestDate,icefestMoney } from '@/lib/icefest';
export default function IcefestAccess(){
 const location=useLocation(),{code}=useParams(),[data,setData]=useState<any>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true),[email,setEmail]=useState(''),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{if(!code&&data?.status==='paid'&&data?.id)trackMetaEventOnce(`purchase-icefest-${data.id}`,'Purchase',{value:data.total_amount,currency:'CLP',content_name:'Icefest Santiago',content_type:'product',num_items:data.quantity},`purchase-icefest-${data.id}`);},[code,data]);
 const recover=location.pathname.endsWith('/recuperar');
 useEffect(()=>{let cancelled=false;let timer:ReturnType<typeof setTimeout>|undefined;
 async function load(){if(recover){setLoading(false);return;}const q=new URLSearchParams(location.search),token=q.get('token'),id=q.get('order')||q.get('external_reference');if(!token||(!code&&!id)){setError('Abre el enlace privado de tu compra o escríbenos para reenviarte tus entradas.');setLoading(false);return;}
 try{const result=await icefestCall('icefest-access',code?{action:'ticket',code,token}:{action:'order',id,token});if(cancelled)return;setData(result);setError('');if(result.status==='pending')timer=setTimeout(load,4000);}catch(e){if(!cancelled)setError(e instanceof Error?e.message:'No se pudo cargar');}finally{if(!cancelled)setLoading(false);}}
 void load();return()=>{cancelled=true;if(timer)clearTimeout(timer);};},[location.pathname,location.search,code,recover]);
 const order=code?data?.icefest_orders:data,event=order?.icefest_events,valid=code?data?.is_valid&&order?.status==='paid':order?.status==='paid';
 return <main className="icefest-theme min-h-screen bg-background text-foreground px-5 py-14"><Helmet><title>{recover?'Recuperar entradas':'Tu compra'} · Icefest Santiago</title><meta name="robots" content="noindex,nofollow"/></Helmet><div className="max-w-xl mx-auto"><Link to="/icefest-santiago" className="text-primary underline">← Icefest Santiago</Link><div className="mt-8 border rounded-lg p-6 md:p-8 bg-card">
 {recover?<><Mail className="h-9 w-9 text-primary mb-5"/><h1 className="text-2xl mb-4">¿Necesitas tu entrada?</h1><p className="text-muted-foreground mb-5">Escríbenos por WhatsApp con el email de tu compra y te la reenviamos.</p><Button asChild className="w-full"><a href="https://wa.me/56946120426?text=Hola%20Nave%20Studio%2C%20necesito%20que%20me%20reenv%C3%ADen%20mi%20entrada%20del%20Icefest" target="_blank" rel="noopener noreferrer">Escribir por WhatsApp</a></Button></>:loading?<div className="flex gap-3 items-center"><Loader2 className="animate-spin w-5 h-5"/>Consultando tu compra…</div>:data?<>
 {valid?<CheckCircle className="w-10 h-10 text-primary mb-4"/>:<Clock className="w-10 h-10 text-muted-foreground mb-4"/>}<h1 className="text-2xl mb-5">{code?'Tu entrada Icefest':valid?'Compra confirmada':order?.status==='needs_review'?'Tu pago necesita revisión':order?.status==='pending'?'Estamos esperando la confirmación':order?.status==='refunded'?'Compra devuelta':'El pago no se completó'}</h1>{event&&<div className="space-y-2 mb-6"><h2 className="text-xl">{event.name}</h2><p>{icefestDate(event.date)} · {event.schedule}</p><p>{event.location}</p></div>}
 {code?<><p className="text-sm text-muted-foreground">Entrada {data.ticket_number}</p><p className="font-mono text-xl sm:text-2xl font-bold my-4 break-all">{data.ticket_code}</p><p>{order.buyer_name} {order.buyer_surname}</p><p className="mt-5 text-primary font-semibold">{!valid?'Entrada no válida':data.checked_in?'Entrada ya acreditada':'Disponible para un ingreso'}</p>{data.checked_in_at&&<p className="mt-2 text-sm">{new Date(data.checked_in_at).toLocaleString('es-CL',{timeZone:'America/Santiago'})}</p>}</>:<><p>{order.quantity} entrada(s) · {icefestMoney(order.total_amount)} CLP</p>{order.tickets?.map((t:any)=><Button asChild variant="outline" className="w-full mt-4" key={t.ticket_code}><Link to={`/icefest-santiago/entrada/${t.ticket_code}?token=${t.access_token}`}><Ticket className="mr-2 h-4 w-4"/>Entrada {t.ticket_number} · {t.ticket_code}</Link></Button>)}</>}
 {valid&&!code&&<p className="mt-6 rounded-lg border border-primary/40 bg-primary/10 p-4 text-sm font-medium">✅ Tu entrada ya fue enviada a tu email.</p>}{valid&&<p className="mt-6 text-sm text-muted-foreground">Muestra el código al personal al llegar al evento. El equipo realizará la acreditación.</p>}{valid&&!code&&<IcefestPrepUpsell buyer={order}/>}{order?.status==='needs_review'&&<p className="mt-5">El equipo revisará tu pago antes de emitir entradas. Escríbenos si necesitas ayuda.</p>}
 </>:null}{error&&<p role="alert" className="text-destructive mt-5">{error}</p>}
 </div></div></main>;
}
