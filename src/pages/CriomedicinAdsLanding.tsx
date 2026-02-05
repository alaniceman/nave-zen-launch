 import { useEffect, useState } from "react";
 import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { Card, CardContent } from "@/components/ui/card";
 import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
 } from "@/components/ui/accordion";
 import { Footer } from "@/components/Footer";
 import { CoachesSection } from "@/components/CoachesSection";
 import { GiftCardSection } from "@/components/GiftCardSection";
 import { supabase } from "@/integrations/supabase/client";
 import { scheduleData, dayNames, type ClassItem } from "@/data/schedule";
 import { useIsMobile } from "@/hooks/use-mobile";
 import {
   Snowflake,
   Wind,
   Heart,
   Shield,
   Clock,
   Users,
   CheckCircle2,
   AlertTriangle,
   MessageCircle,
   Calendar,
   ArrowRight,
   Sparkles,
   Brain,
   Zap,
   Target,
 } from "lucide-react";
 
 interface SessionPackage {
   id: string;
   name: string;
   description: string | null;
   sessions_quantity: number;
   price_clp: number;
   validity_days: number;
 }
 
 interface WimHofScheduleDay {
   day: string;
   dayName: string;
   classes: ClassItem[];
 }
 
 const CriomedicinAdsLanding = () => {
   const [packages, setPackages] = useState<SessionPackage[]>([]);
   const [loading, setLoading] = useState(true);
   const isMobile = useIsMobile();
  const navigate = useNavigate();
 
   useEffect(() => {
     const fetchPackages = async () => {
       const { data, error } = await supabase
         .from("session_packages")
         .select("id, name, description, sessions_quantity, price_clp, validity_days")
         .eq("is_active", true)
         .eq("show_in_criomedicina", true)
         .order("sessions_quantity", { ascending: true });
 
       if (!error && data) {
         setPackages(data);
       }
       setLoading(false);
     };
 
     fetchPackages();
   }, []);
 
   // Filter Wim Hof sessions from schedule
   const wimHofSchedule: WimHofScheduleDay[] = Object.entries(scheduleData)
     .map(([day, classes]) => ({
       day,
       dayName: dayNames[day as keyof typeof dayNames],
       classes: classes.filter((c) => c.tags.includes("Método Wim Hof")),
     }))
     .filter((d) => d.classes.length > 0);
 
   const scrollToSection = (id: string) => {
     document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
   };
 
   const formatPrice = (price: number) => {
     return new Intl.NumberFormat("es-CL", {
       style: "currency",
       currency: "CLP",
       minimumFractionDigits: 0,
     }).format(price);
   };
 
   // Schema.org structured data
   const structuredData = {
     "@context": "https://schema.org",
     "@graph": [
       {
         "@type": "LocalBusiness",
         "@id": "https://nave.cl/#localbusiness",
         name: "Nave Studio",
         description: "Centro de bienestar especializado en Criomedicina y Método Wim Hof en Las Condes, Santiago",
         url: "https://nave.cl",
         telephone: "+56946120426",
         address: {
           "@type": "PostalAddress",
           streetAddress: "Antares 259",
           addressLocality: "Las Condes",
           addressRegion: "Región Metropolitana",
           postalCode: "",
           addressCountry: "CL",
         },
         geo: {
           "@type": "GeoCoordinates",
           latitude: -33.4069,
           longitude: -70.5672,
         },
         openingHours: "Mo-Su 06:30-21:00",
         priceRange: "$$",
       },
       {
         "@type": "Product",
         name: "Sesión Método Wim Hof (Breathwork + Ice Bath)",
         description: "Sesión guiada de respiración Método Wim Hof más inmersión en agua fría. Incluye preparación, técnica y recuperación.",
         offers: {
           "@type": "Offer",
           price: "30000",
           priceCurrency: "CLP",
           availability: "https://schema.org/InStock",
         },
       },
       {
         "@type": "FAQPage",
         mainEntity: [
           {
             "@type": "Question",
             name: "¿Necesito experiencia para hacer Criomedicina?",
             acceptedAnswer: {
               "@type": "Answer",
               text: "No. Es apto para principiantes y adaptamos la sesión a tu nivel.",
             },
           },
           {
             "@type": "Question",
             name: "¿Cuánto dura la sesión de Método Wim Hof?",
             acceptedAnswer: {
               "@type": "Answer",
               text: "Depende del formato, pero considera aproximadamente 60-90 minutos.",
             },
           },
           {
             "@type": "Question",
             name: "¿Dónde queda Nave Studio?",
             acceptedAnswer: {
               "@type": "Answer",
               text: "En Nave Studio, Antares 259, Las Condes. Los detalles exactos llegan en la confirmación de tu reserva.",
             },
           },
         ],
       },
     ],
   };
 
   return (
     <>
       <Helmet>
         <title>Criomedicina Método Wim Hof en Las Condes | Nave Studio</title>
         <meta
           name="description"
           content="Sesión guiada de Respiración Método Wim Hof + Inmersión en Agua Fría en Nave Studio, Las Condes. Apta para principiantes. Agenda tu sesión hoy."
         />
         <meta
           name="keywords"
           content="criomedicina, método wim hof, agua fría, ice bath, breathwork, las condes, santiago, nave studio"
         />
         <link rel="canonical" href="https://nave.cl/criomedicina-metodo-wim-hof-las-condes" />
         <meta property="og:title" content="Criomedicina Método Wim Hof en Las Condes | Nave Studio" />
         <meta
           property="og:description"
           content="Sesión guiada de Respiración Método Wim Hof + Inmersión en Agua Fría. Apta para principiantes. Agenda tu sesión hoy."
         />
         <meta property="og:image" content="/lovable-uploads/criomedicina-hero.webp" />
         <meta property="og:url" content="https://nave.cl/criomedicina-metodo-wim-hof-las-condes" />
         <meta property="og:type" content="website" />
         <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
       </Helmet>
 
       {/* Hero Section */}
       <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
         <div
           className="absolute inset-0 bg-cover bg-center"
           style={{ backgroundImage: "url('/lovable-uploads/criomedicina-hero.webp')" }}
         >
           <div className="absolute inset-0 bg-primary/70" />
         </div>
 
         <div className="relative z-10 container mx-auto px-6 py-20 text-center text-white">
           <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space mb-6 leading-tight">
             Criomedicina en Nave Studio:{" "}
             <span className="text-accent">Respiración Método Wim Hof</span> + Inmersión en Agua Fría
           </h1>
 
           <p className="text-xl md:text-2xl font-inter mb-8 max-w-3xl mx-auto opacity-90">
             Una sesión guiada para entrenar tu sistema nervioso con respiración, presencia y frío
             en la Nave ❄️🛸. Apta para principiantes y también para quienes ya practican.
           </p>
 
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
               <Shield className="w-6 h-6 text-accent flex-shrink-0" />
               <span className="text-left font-inter">Guía paso a paso y seguridad (si vienes partiendo)</span>
             </div>
             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
               <Target className="w-6 h-6 text-accent flex-shrink-0" />
               <span className="text-left font-inter">Técnica y control (si ya tienes experiencia)</span>
             </div>
             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
               <Zap className="w-6 h-6 text-accent flex-shrink-0" />
               <span className="text-left font-inter">Energía, calma y claridad mental desde el cuerpo</span>
             </div>
             <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
               <Sparkles className="w-6 h-6 text-accent flex-shrink-0" />
               <span className="text-left font-inter">Experiencia completa: preparación + inmersión + recuperación</span>
             </div>
           </div>
 
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button
               size="lg"
               className="bg-accent hover:bg-accent/90 text-white font-semibold text-lg px-8 py-6"
               onClick={() => navigate("/agenda-nave-studio")}
             >
               <Calendar className="w-5 h-5 mr-2" />
               Agendar sesión
             </Button>
             <Button
               size="lg"
               variant="outline"
             className="border-white text-white bg-transparent hover:bg-white/10 font-semibold text-lg px-8 py-6"
               onClick={() => scrollToSection("horarios")}
             >
               <Clock className="w-5 h-5 mr-2" />
               Ver horarios
             </Button>
           </div>
         </div>
       </section>
 
       {/* Qué es Criomedicina */}
       <section className="py-16 bg-background">
         <div className="container mx-auto px-6 max-w-4xl">
           <h2 className="text-3xl md:text-4xl font-bold font-space text-primary text-center mb-8">
             ¿Qué es Criomedicina?
           </h2>
           <p className="text-lg font-inter text-foreground/80 text-center mb-6 leading-relaxed">
             Criomedicina es una práctica guiada que combina el <strong>Método Wim Hof</strong>{" "}
             (respiración + enfoque mental) con exposición al frío para entrenar tu capacidad de
             regular el estrés. No se trata de "aguantar", sino de aprender a entrar con técnica,
             presencia y control.
           </p>
           <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-xl">
             <p className="text-xl font-inter text-primary italic text-center">
               "El frío no es el objetivo. Es el medio para entrenar resiliencia."
             </p>
           </div>
         </div>
       </section>
 
       {/* Cómo es una sesión - Paso a Paso */}
       <section className="py-16 bg-muted/30">
         <div className="container mx-auto px-6">
           <h2 className="text-3xl md:text-4xl font-bold font-space text-primary text-center mb-4">
             ¿Cómo es la sesión del Método Wim Hof + Agua Fría?
           </h2>
           <p className="text-lg font-inter text-foreground/70 text-center mb-12 max-w-3xl mx-auto">
             Cada sesión está diseñada para que vivas una experiencia segura, progresiva y
             profunda. Te acompañamos desde la preparación hasta la recuperación final.
           </p>
 
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
             {[
               {
                 step: 1,
                 icon: Users,
                 title: "Bienvenida y preparación",
                 time: "5–10 min",
                 description:
                   "Te recibimos, revisamos contraindicaciones y resolvemos dudas. Explicamos el objetivo: regulación del sistema nervioso, no resistencia bruta.",
               },
               {
                 step: 2,
                 icon: Wind,
                 title: "Respiración Método Wim Hof guiada",
                 time: "20–30 min",
                 description:
                   "Rondas de respiración guiadas (a tu ritmo), con pausas y enfoque. El objetivo es preparar el cuerpo: energía, claridad y presencia.",
               },
               {
                 step: 3,
                 icon: Target,
                 title: "Transición al frío + técnica",
                 time: "5 min",
                 description:
                   'Te mostramos cómo entrar, cómo respirar y cómo "leer" el cuerpo. Ajustamos la inmersión según tu nivel.',
               },
               {
                 step: 4,
                 icon: Snowflake,
                 title: "Inmersión en agua fría en la Nave ❄️🛸",
                 time: "1–3 min aprox.",
                 description:
                   "Agua aprox. 3°C. Entras con guía: respiración, postura, enfoque y control. La duración no es el 'premio': lo importante es la calidad de la regulación.",
               },
               {
                 step: 5,
                 icon: Heart,
                 title: "Recuperación e integración",
                 time: "10–15 min",
                 description:
                   "Salida del agua + respiración de recuperación. Vuelves al equilibrio: calma, presencia, cuerpo 'encendido'.",
               },
             ].map((item) => (
               <Card key={item.step} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
                 <div className="absolute top-0 left-0 w-12 h-12 bg-primary text-white flex items-center justify-center font-bold text-xl rounded-br-2xl">
                   {item.step}
                 </div>
                 <CardContent className="pt-16 pb-6 px-6">
                   <item.icon className="w-10 h-10 text-secondary mb-4" />
                   <h3 className="text-xl font-bold font-space text-primary mb-2">{item.title}</h3>
                   <p className="text-sm text-secondary font-semibold mb-3">{item.time}</p>
                   <p className="text-foreground/70 font-inter">{item.description}</p>
                 </CardContent>
               </Card>
             ))}
           </div>
 
           <div className="bg-accent/10 rounded-2xl p-8 max-w-3xl mx-auto">
             <h3 className="text-xl font-bold font-space text-primary mb-4 text-center">
               Ajuste por nivel
             </h3>
             <div className="grid md:grid-cols-2 gap-6">
               <div className="flex gap-4">
                 <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                 <div>
                   <p className="font-semibold text-primary">Si eres principiante:</p>
                   <p className="text-foreground/70 font-inter">
                     Entramos progresivo, con guía constante, priorizando técnica y seguridad.
                   </p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-1" />
                 <div>
                   <p className="font-semibold text-primary">Si ya tienes experiencia:</p>
                   <p className="text-foreground/70 font-inter">
                     Trabajamos refinamiento: respiración, enfoque, control del impulso, y consistencia.
                   </p>
                 </div>
               </div>
             </div>
           </div>
 
           <p className="text-center text-lg font-inter text-primary mt-8 font-medium">
             Sales con una sensación muy concreta: "puedo regularme bajo estrés".
           </p>
         </div>
       </section>
 
       {/* Beneficios esperables */}
       <section className="py-16 bg-background">
         <div className="container mx-auto px-6 max-w-4xl">
           <h2 className="text-3xl md:text-4xl font-bold font-space text-primary text-center mb-10">
             Qué puedes sentir después
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {[
               {
                 icon: Brain,
                 title: "Calma mental",
                 description: "Mejor relación con el estrés y mayor claridad para tomar decisiones.",
               },
               {
                 icon: Zap,
                 title: "Energía y enfoque",
                 description: 'Sensación de "reset" que te activa sin agotarte.',
               },
               {
                 icon: Shield,
                 title: "Confianza corporal y mental",
                 description: "Más seguridad en tu capacidad de manejar situaciones difíciles.",
               },
               {
                 icon: Target,
                 title: "Resiliencia entrenada",
                 description: "Elegir cómo responder, no reaccionar automáticamente.",
               },
             ].map((benefit, index) => (
               <div
                 key={index}
                 className="flex gap-4 p-6 bg-muted/50 rounded-xl hover:bg-muted transition-colors"
               >
                 <benefit.icon className="w-8 h-8 text-secondary flex-shrink-0" />
                 <div>
                   <h3 className="font-bold text-primary font-space mb-1">{benefit.title}</h3>
                   <p className="text-foreground/70 font-inter">{benefit.description}</p>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </section>
 
       {/* Seguridad y contraindicaciones */}
       <section className="py-16 bg-primary/5">
         <div className="container mx-auto px-6 max-w-3xl text-center">
           <AlertTriangle className="w-12 h-12 text-warm mx-auto mb-6" />
           <h2 className="text-3xl md:text-4xl font-bold font-space text-primary mb-6">
             Seguridad primero
           </h2>
           <p className="text-lg font-inter text-foreground/80 mb-8 leading-relaxed">
             La sesión es guiada y segura, pero hay contraindicaciones. Si estás embarazada, tienes
             epilepsia, problemas cardíacos severos, hipertensión no controlada u otra condición
             relevante, <strong>contáctanos antes de agendar</strong>.
           </p>
           <a
             href="https://wa.me/56946120426?text=Hola%21%20Tengo%20una%20consulta%20sobre%20contraindicaciones%20para%20Criomedicina"
             target="_blank"
             rel="noopener noreferrer"
           >
             <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
               <MessageCircle className="w-5 h-5 mr-2" />
               Hablar por WhatsApp
             </Button>
           </a>
         </div>
       </section>
 
       {/* Qué traer */}
       <section className="py-16 bg-background">
         <div className="container mx-auto px-6 max-w-3xl">
           <h2 className="text-3xl md:text-4xl font-bold font-space text-primary text-center mb-10">
             Qué traer
           </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
             {[
               "Traje de baño puesto o fácil de poner",
               "Toalla grande",
               "Bolsa para ropa mojada",
               "Ven en ayunas ligeras y llega puntual",
             ].map((item, index) => (
               <div
                 key={index}
                 className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl"
               >
                 <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                 <span className="font-inter text-foreground/80">{item}</span>
               </div>
             ))}
           </div>
           <p className="text-center text-lg font-inter text-primary font-medium">
             Todo lo demás que necesitas lo tenemos en la Nave.
           </p>
         </div>
       </section>
 
       {/* Paquetes */}
       <section id="paquetes" className="py-16 bg-muted/30">
         <div className="container mx-auto px-6">
           <h2 className="text-3xl md:text-4xl font-bold font-space text-primary text-center mb-4">
             Elige tu formato
           </h2>
           <p className="text-lg font-inter text-foreground/70 text-center mb-10 max-w-2xl mx-auto">
             Puedes agendar una sesión suelta o elegir un paquete para venir con más consistencia.
           </p>
 
           {loading ? (
             <div className="flex justify-center">
               <div className="animate-pulse text-foreground/50">Cargando paquetes...</div>
             </div>
           ) : packages.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
               {packages.map((pkg) => (
                 <Card key={pkg.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                   <CardContent className="p-6">
                     <h3 className="text-xl font-bold font-space text-primary mb-2">{pkg.name}</h3>
                     {pkg.description && (
                       <p className="text-foreground/70 font-inter text-sm mb-4">{pkg.description}</p>
                     )}
                     <div className="flex items-baseline gap-2 mb-4">
                       <span className="text-3xl font-bold text-secondary">{formatPrice(pkg.price_clp)}</span>
                       <span className="text-foreground/50 text-sm">/ {pkg.sessions_quantity} sesiones</span>
                     </div>
                     <p className="text-sm text-foreground/60 mb-6">
                       Válido por {pkg.validity_days} días
                     </p>
                     <Link to={`/bonos?package=${pkg.id}`}>
                       <Button className="w-full bg-secondary hover:bg-secondary/90">
                         Comprar paquete
                         <ArrowRight className="w-4 h-4 ml-2" />
                       </Button>
                     </Link>
                   </CardContent>
                 </Card>
               ))}
             </div>
           ) : null}
 
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link to="/bonos">
               <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto">
                 Ver todos los paquetes
               </Button>
             </Link>
             <Link to="/giftcards">
               <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white w-full sm:w-auto">
                 🎁 Regalar una sesión
               </Button>
             </Link>
           </div>
         </div>
       </section>
 
       {/* Membresías */}
       <section className="py-16 bg-primary/5">
         <div className="container mx-auto px-6">
           <div className="max-w-4xl mx-auto text-center">
             <h2 className="text-3xl md:text-4xl font-bold font-space text-primary mb-4">
               ¿Quieres venir todas las semanas?
             </h2>
             <p className="text-lg font-inter text-foreground/70 mb-6 max-w-2xl mx-auto">
               Con nuestras membresías mensuales tienes acceso ilimitado a todas las experiencias de Nave Studio: 
               clases de yoga, breathwork, agua fría, sauna y más.
             </p>
             <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-muted mb-8">
               <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="text-left">
                   <h3 className="text-xl font-bold font-space text-primary mb-2">
                     Membresía Nave
                   </h3>
                   <ul className="space-y-2 text-foreground/70 font-inter">
                     <li className="flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                       Acceso ilimitado a todas las clases grupales
                     </li>
                     <li className="flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                       Yoga, breathwork, agua fría, sauna
                     </li>
                     <li className="flex items-center gap-2">
                       <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                       30% dcto en tu primer mes con código 1MES
                     </li>
                   </ul>
                 </div>
                 <div className="flex-shrink-0">
                   <Link to="/planes#habito-semanal">
                     <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-semibold px-8">
                       Ver membresías
                       <ArrowRight className="w-4 h-4 ml-2" />
                     </Button>
                   </Link>
                 </div>
               </div>
             </div>
             <p className="text-sm text-foreground/60 font-inter">
               Ideal si quieres crear un hábito constante y aprovechar todas las experiencias.
             </p>
           </div>
         </div>
       </section>

       {/* Horarios */}
       <section id="horarios" className="py-16 bg-background">
         <div className="container mx-auto px-6">
           <h2 className="text-3xl md:text-4xl font-bold font-space text-primary text-center mb-4">
             Horarios Método Wim Hof
           </h2>
           <p className="text-lg font-inter text-foreground/70 text-center mb-10 max-w-2xl mx-auto">
             Estos son los horarios actualizados de sesiones de agua fría / Método Wim Hof en Nave Studio.
           </p>
 
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-6xl mx-auto mb-10">
             {wimHofSchedule.map((day) => (
               <Card key={day.day} className="overflow-hidden">
                 <div className="bg-primary text-white py-3 px-4">
                   <h3 className="font-bold font-space">{day.dayName}</h3>
                 </div>
                 <CardContent className="p-4">
                   {day.classes.map((cls, idx) => (
                     <div
                       key={idx}
                       className={`py-3 ${idx !== day.classes.length - 1 ? "border-b border-muted" : ""}`}
                     >
                       <p className="font-bold text-secondary">{cls.time}</p>
                       <p className="text-sm text-foreground/80 font-inter">{cls.title}</p>
                       {cls.instructor && (
                         <p className="text-xs text-foreground/60 mt-1">con {cls.instructor}</p>
                       )}
                       {cls.badges.length > 0 && (
                         <div className="flex flex-wrap gap-1 mt-2">
                           {cls.badges.map((badge, i) => (
                             <span
                               key={i}
                               className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full"
                             >
                               {badge}
                             </span>
                           ))}
                         </div>
                       )}
                     </div>
                   ))}
                 </CardContent>
               </Card>
             ))}
           </div>
 
           <div className="text-center">
             <Link to="/horarios">
               <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                 Ver horario completo
                 <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
             </Link>
           </div>
         </div>
       </section>
 
       {/* Agenda */}
       <section id="agenda" className="py-16 bg-secondary/10">
         <div className="container mx-auto px-6 text-center">
           <Calendar className="w-16 h-16 text-secondary mx-auto mb-6" />
           <h2 className="text-3xl md:text-4xl font-bold font-space text-primary mb-4">
             Agenda tu sesión ahora
           </h2>
           <p className="text-lg font-inter text-foreground/70 mb-8 max-w-2xl mx-auto">
             Reserva tu cupo aquí mismo. Te llegará la confirmación con todos los detalles.
           </p>
           <Link to="/agenda-nave-studio">
             <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-white font-semibold text-lg px-10 py-6">
               <Calendar className="w-5 h-5 mr-2" />
               Ir a la agenda
             </Button>
           </Link>
           <p className="text-sm text-foreground/60 mt-6 font-inter">
             Si compraste un pack, igual agenda tu cupo desde la agenda.
           </p>
         </div>
       </section>
 
       {/* FAQ */}
       <section className="py-16 bg-background">
         <div className="container mx-auto px-6 max-w-3xl">
           <h2 className="text-3xl md:text-4xl font-bold font-space text-primary text-center mb-10">
             Preguntas frecuentes
           </h2>
           <Accordion type="single" collapsible className="w-full">
             {[
               {
                 q: "¿Necesito experiencia?",
                 a: "No. Es apto para principiantes y adaptamos la sesión a tu nivel.",
               },
               {
                 q: "¿Cuánto dura la sesión?",
                 a: "Depende del formato, pero considera aproximadamente 60–90 minutos.",
               },
               {
                 q: "¿Tengo que estar mucho rato en el agua fría?",
                 a: "No. La duración se ajusta. El objetivo es técnica y regulación, no récords.",
               },
               {
                 q: "¿Qué pasa si me da ansiedad o pánico?",
                 a: "Para eso está la guía. Respiración + técnica + progresión. Tú mandas el ritmo.",
               },
               {
                 q: "¿Dónde es?",
                 a: "En Nave Studio, Antares 259, Las Condes (cerca de metro Los Domínicos). Los detalles exactos llegan en la confirmación de tu reserva.",
               },
             ].map((item, index) => (
               <AccordionItem key={index} value={`item-${index}`}>
                 <AccordionTrigger className="text-left font-space text-primary hover:text-secondary">
                   {item.q}
                 </AccordionTrigger>
                 <AccordionContent className="font-inter text-foreground/80">
                   {item.a}
                 </AccordionContent>
               </AccordionItem>
             ))}
           </Accordion>
         </div>
       </section>
 
       {/* Instructores */}
       <CoachesSection filterIds={["alan", "sol", "maral", "rolo"]} />
 
       {/* Gift Card Section */}
       <GiftCardSection />
 
       {/* CTA Final */}
       <section className="py-16 bg-primary text-white">
         <div className="container mx-auto px-6 text-center">
           <h2 className="text-3xl md:text-4xl font-bold font-space mb-6">
             Tu primera sesión se agenda hoy
           </h2>
           <p className="text-xl font-inter opacity-90 mb-10 max-w-2xl mx-auto">
             No lo pienses tanto. La mente siempre va a buscar excusas.
             <br />
             Tu cuerpo aprende en la experiencia.
           </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button
               size="lg"
               className="bg-accent hover:bg-accent/90 text-white font-semibold text-lg px-8 py-6"
               onClick={() => scrollToSection("agenda")}
             >
               <Calendar className="w-5 h-5 mr-2" />
               Agendar ahora
             </Button>
             <Button
               size="lg"
               variant="outline"
               className="border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 bg-transparent"
               onClick={() => scrollToSection("paquetes")}
             >
               Ver paquetes
             </Button>
             <a
               href="https://wa.me/56946120426"
               target="_blank"
               rel="noopener noreferrer"
             >
               <Button
                 size="lg"
                 variant="outline"
                 className="border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 bg-transparent"
               >
                 <MessageCircle className="w-5 h-5 mr-2" />
                 WhatsApp
               </Button>
             </a>
           </div>
         </div>
       </section>
 
       {/* Sticky CTA Mobile */}
       {isMobile && (
         <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-muted z-50">
           <Button
             className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold py-6"
             onClick={() => navigate("/agenda-nave-studio")}
           >
             <Calendar className="w-5 h-5 mr-2" />
             Agendar sesión
           </Button>
         </div>
       )}
 
       <Footer />
     </>
   );
 };
 
 export default CriomedicinAdsLanding;