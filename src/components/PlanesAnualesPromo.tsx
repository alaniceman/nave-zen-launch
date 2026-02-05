 import { Button } from "@/components/ui/button";
 import { Badge } from "@/components/ui/badge";
 import { ArrowRight, Calendar, Gift, Snowflake } from "lucide-react";
 import { Link } from "react-router-dom";
 
 const PlanesAnualesPromo = () => {
   return (
     <section className="py-12 bg-gradient-to-b from-warm/10 to-background">
       <div className="container mx-auto px-4 max-w-4xl">
         <div className="bg-card border border-warm/30 rounded-2xl p-6 md:p-8 shadow-sm">
           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
             <div className="space-y-3">
               <Badge className="bg-warm text-white px-3 py-1">
                 🔥 Oferta solo por FEBRERO
               </Badge>
               <h2 className="font-space text-2xl md:text-3xl font-bold text-primary">
                 Planes Anuales 2026
               </h2>
               <p className="text-muted-foreground text-sm md:text-base max-w-md">
                 Compromiso anual con hasta 2 meses gratis y beneficios exclusivos.
               </p>
               
               <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                 <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-primary" />
                   <span>2 meses gratis</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Snowflake className="w-4 h-4 text-primary" />
                   <span>Entradas Icefest incluidas</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Gift className="w-4 h-4 text-primary" />
                   <span>12 cuotas sin interés</span>
                 </div>
               </div>
             </div>
             
             <div className="flex-shrink-0">
               <Link to="/anual">
                 <Button size="lg" className="w-full md:w-auto bg-warm hover:bg-primary text-white">
                   Ver planes anuales
                   <ArrowRight className="ml-2 w-4 h-4" />
                 </Button>
               </Link>
             </div>
           </div>
         </div>
       </div>
     </section>
   );
 };
 
 export { PlanesAnualesPromo };