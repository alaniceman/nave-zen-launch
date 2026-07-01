import { lazy, Suspense, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TrialModalProvider } from "@/context/TrialModalProvider";
import { EmailCaptureModalProvider } from "@/context/EmailCaptureModalProvider";
import { Header } from "@/components/Header";
import { CheckoutRedirectManager } from "@/components/CheckoutRedirectManager";
import { SEOHead } from "@/components/SEOHead";
import { TrialDelegationHandler } from "@/components/TrialDelegationHandler";
import FacebookPixelRouterTracker from "@/components/FacebookPixelRouterTracker";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { ChatWidget, ChatWidgetHandle } from "@/components/ChatWidget";
import { AuthProvider } from "@/context/AuthContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { MailerLiteUniversal } from "@/components/MailerLiteUniversal";
import { GtagClickTracker } from "@/components/GtagClickTracker";
import { Loader2 } from "lucide-react";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const Planes = lazy(() => import("./pages/Planes"));
const Experiencias = lazy(() => import("./pages/Experiencias"));
const Coaches = lazy(() => import("./pages/Coaches"));
const Contacto = lazy(() => import("./pages/Contacto"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogWimHof = lazy(() => import("./pages/BlogWimHof"));
const BlogBiohacking = lazy(() => import("./pages/BlogBiohacking"));
const BlogYinVinyasa = lazy(() => import("./pages/BlogYinVinyasa"));
const BlogHabitosDisciplina = lazy(() => import("./pages/BlogHabitosDisciplina"));
const BlogAguaFriaGuiado = lazy(() => import("./pages/BlogAguaFriaGuiado"));
const BlogProtocoloSeguro = lazy(() => import("./pages/BlogProtocoloSeguro"));
const BlogProtocolo15Minutos = lazy(() => import("./pages/BlogProtocolo15Minutos"));
const Cyber2025 = lazy(() => import("./pages/Cyber2025"));
const PlanAnual2026 = lazy(() => import("./pages/PlanAnual2026"));
const SanValentin = lazy(() => import("./pages/SanValentin"));
const MarzoReset = lazy(() => import("./pages/MarzoReset"));
const DiaDeLaMadre = lazy(() => import("./pages/DiaDeLaMadre"));
const PromoInvierno = lazy(() => import("./pages/PromoInvierno"));
const Horarios = lazy(() => import("./pages/Horarios"));
const ConoceElLugar = lazy(() => import("./pages/ConoceElLugar"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PlanDePrueba = lazy(() => import("./pages/PlanDePrueba"));
const CriomedicinMetodoWimHof = lazy(() => import("./pages/CriomedicinMetodoWimHof"));
const CriomedicinIceBathEnGrupo = lazy(() => import("./pages/CriomedicinIceBathEnGrupo"));
const CriomedicinAdsLanding = lazy(() => import("./pages/CriomedicinAdsLanding"));
const Terminos = lazy(() => import("./pages/Terminos"));
const Privacidad = lazy(() => import("./pages/Privacidad"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Bonos = lazy(() => import("./pages/Bonos"));
const BonosSuccess = lazy(() => import("./pages/BonosSuccess"));
const GiftCards = lazy(() => import("./pages/GiftCards"));
const GiftCardsSuccess = lazy(() => import("./pages/GiftCardsSuccess"));
const GiftCardsFailure = lazy(() => import("./pages/GiftCardsFailure"));
const GiftCardView = lazy(() => import("./pages/GiftCardView"));
const AgendaNaveStudio = lazy(() => import("./pages/AgendaNaveStudio"));
const AgendaSuccess = lazy(() => import("./pages/AgendaSuccess"));
const AgendaFailure = lazy(() => import("./pages/AgendaFailure"));
const AgendaPending = lazy(() => import("./pages/AgendaPending"));
const YogaLasCondes = lazy(() => import("./pages/YogaLasCondes"));
const Icefest = lazy(() => import("./pages/Icefest"));
const BautizoHielo = lazy(() => import("./pages/BautizoHielo"));
const InstructorProfile = lazy(() => import("./pages/InstructorProfile"));
const Generative = lazy(() => import("./pages/Generative"));
const FotosWorkshopBuda = lazy(() => import("./pages/FotosWorkshopBuda"));
const FotosTallerWimHofSantiago = lazy(() => import("./pages/FotosTallerWimHofSantiago"));
const TallerSantiago = lazy(() => import("./pages/TallerSantiago"));
const TalleresYRetiros = lazy(() => import("./pages/TalleresYRetiros"));
const Tienda = lazy(() => import("./pages/Tienda"));
const TiendaSuccess = lazy(() => import("./pages/TiendaSuccess"));
const TiendaFailure = lazy(() => import("./pages/TiendaFailure"));
const TiendaPending = lazy(() => import("./pages/TiendaPending"));

// Lazy-loaded admin pages
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const AdminProfessionals = lazy(() => import("./pages/admin/AdminProfessionals"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminAvailability = lazy(() => import("./pages/admin/AdminAvailability"));
const AdminFutureSlots = lazy(() => import("./pages/admin/AdminFutureSlots"));
const AdminCoupons = lazy(() => import("./pages/admin/AdminCoupons"));
const AdminCapacityOverrides = lazy(() => import("./pages/admin/AdminCapacityOverrides"));
const AdminSessionPackages = lazy(() => import("./pages/admin/AdminSessionPackages"));
const AdminSessionCodes = lazy(() => import("./pages/admin/AdminSessionCodes"));
const AdminBranches = lazy(() => import("./pages/admin/AdminBranches"));
const AdminPackageOrders = lazy(() => import("./pages/admin/AdminPackageOrders"));
const AdminAbandonedCarts = lazy(() => import("./pages/admin/AdminAbandonedCarts"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminMailerLite = lazy(() => import("./pages/admin/AdminMailerLite"));
const AdminScheduleEntries = lazy(() => import("./pages/admin/AdminScheduleEntries"));
const AdminTrialBookings = lazy(() => import("./pages/admin/AdminTrialBookings"));
const AdminPlanesPrueba = lazy(() => import("./pages/admin/AdminPlanesPrueba"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminCustomerDetail = lazy(() => import("./pages/admin/AdminCustomerDetail"));
const AdminMembershipPlans = lazy(() => import("./pages/admin/AdminMembershipPlans"));
const AdminEmailTemplates = lazy(() => import("./pages/admin/AdminEmailTemplates"));
const AdminChatLogs = lazy(() => import("./pages/admin/AdminChatLogs"));
const AdminBrain = lazy(() => import("./pages/admin/AdminBrain"));
const AdminAIKnowledge = lazy(() => import("./pages/admin/AdminAIKnowledge"));
const AdminShopProducts = lazy(() => import("./pages/admin/AdminShopProducts"));
const AdminShopOrders = lazy(() => import("./pages/admin/AdminShopOrders"));

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => {
  const chatRef = useRef<ChatWidgetHandle>(null);
  return (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <TrialModalProvider>
              <Toaster />
              <Sonner />
              <CheckoutRedirectManager />
              <EmailCaptureModalProvider>
             <ScrollToTop />
              <SEOHead />
              <FacebookPixelRouterTracker />
              <GtagClickTracker />
              <MailerLiteUniversal />
              <TrialDelegationHandler />
              <Header />
            <Suspense fallback={<LoadingSpinner />}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/planes-precios" element={<Planes />} />
            <Route path="/experiencias" element={<Experiencias />} />
            <Route path="/coaches" element={<Coaches />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/metodo-wim-hof-respiracion-frio-mente" element={<BlogWimHof />} />
            <Route path="/blog/biohacking-hiit-breathwork-agua-fria-longevidad" element={<BlogBiohacking />} />
            <Route path="/blog/yin-yoga-vinyasa-yoga-beneficios-como-combinarlos" element={<BlogYinVinyasa />} />
            <Route path="/blog/habitos-disciplina-como-construirte-a-ti-mismo" element={<BlogHabitosDisciplina />} />
            <Route path="/blog/agua-fria-guiado-vs-solo-experiencia-wim-hof" element={<BlogAguaFriaGuiado />} />
            <Route path="/blog/protocolo-seguro-agua-fria-respiracion" element={<BlogProtocoloSeguro />} />
            <Route path="/blog/protocolo-15-minutos-respiracion-agua-fria" element={<BlogProtocolo15Minutos />} />
            <Route path="/cyber-2025" element={<Cyber2025 />} />
            <Route path="/anual" element={<PlanAnual2026 />} />
            <Route path="/san-valentin" element={<SanValentin />} />
            <Route path="/marzo-reset" element={<MarzoReset />} />
            <Route path="/dia-de-la-madre" element={<DiaDeLaMadre />} />
            <Route path="/diadelamadre" element={<Navigate to="/dia-de-la-madre" replace />} />
            <Route path="/promo-invierno" element={<PromoInvierno />} />
            <Route path="/dia-del-padre" element={<Navigate to="/promo-invierno" replace />} />
            <Route path="/diadelpadre" element={<Navigate to="/promo-invierno" replace />} />
            <Route path="/horarios" element={<Horarios />} />
            <Route path="/conoce-el-lugar" element={<ConoceElLugar />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/plan-de-prueba" element={<PlanDePrueba />} />
            <Route path="/prueba-nave-studio" element={<Navigate to="/plan-de-prueba" replace />} />
            <Route path="/clase-de-prueba" element={<Navigate to="/plan-de-prueba" replace />} />
            <Route path="/clase-de-prueba/agendar" element={<Navigate to="/plan-de-prueba" replace />} />
            <Route path="/agendar" element={<Navigate to="/agenda-nave-studio" replace />} />
            <Route path="/criomedicina-metodo-wim-hof" element={<CriomedicinMetodoWimHof />} />
            <Route path="/criomedicina-ice-bath-en-grupo" element={<CriomedicinIceBathEnGrupo />} />
            <Route path="/criomedicina-metodo-wim-hof-las-condes" element={<CriomedicinAdsLanding />} />
            <Route path="/terminos" element={<Terminos />} />
            <Route path="/privacidad" element={<Privacidad />} />
            <Route path="/bonos" element={<Bonos />} />
            <Route path="/bonos/success" element={<BonosSuccess />} />
            <Route path="/giftcards" element={<GiftCards />} />
            <Route path="/giftcards/success" element={<GiftCardsSuccess />} />
            <Route path="/giftcards/failure" element={<GiftCardsFailure />} />
            <Route path="/giftcard/:token" element={<GiftCardView />} />
            <Route path="/agenda-nave-studio" element={<AgendaNaveStudio />} />
            <Route path="/agenda-nave-studio/success" element={<AgendaSuccess />} />
            <Route path="/agenda-nave-studio/failure" element={<AgendaFailure />} />
            <Route path="/agenda-nave-studio/pending" element={<AgendaPending />} />
            <Route path="/agenda-nave-studio/:professionalSlug" element={<AgendaNaveStudio />} />
            <Route path="/agenda-nave-studio/:professionalSlug/:dateParam" element={<AgendaNaveStudio />} />
            <Route path="/agenda-nave-studio/:professionalSlug/:dateParam/:timeParam" element={<AgendaNaveStudio />} />
            
            <Route path="/yoga-las-condes" element={<YogaLasCondes />} />
            <Route path="/icefest" element={<Icefest />} />
            <Route path="/bautizo-hielo" element={<BautizoHielo />} />
            <Route path="/instructor/:slug" element={<InstructorProfile />} />
            <Route path="/generative" element={<Generative />} />
            <Route path="/fotos-workshop/buda" element={<FotosWorkshopBuda />} />

            {/* Tienda */}
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/tienda/success" element={<TiendaSuccess />} />
            <Route path="/tienda/failure" element={<TiendaFailure />} />
            <Route path="/tienda/pending" element={<TiendaPending />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="agenda" element={<AdminBookings />} />
              <Route path="ordenes" element={<AdminPackageOrders />} />
              <Route path="carros-abandonados" element={<AdminAbandonedCarts />} />
              <Route path="sucursales" element={<AdminBranches />} />
              <Route path="profesionales" element={<AdminProfessionals />} />
              <Route path="servicios" element={<AdminServices />} />
              <Route path="cupones" element={<AdminCoupons />} />
              <Route path="disponibilidad" element={<AdminAvailability />} />
              <Route path="agendas-futuras" element={<AdminFutureSlots />} />
              <Route path="capacidad" element={<AdminCapacityOverrides />} />
              <Route path="paquetes-sesiones" element={<AdminSessionPackages />} />
              <Route path="codigos-sesiones" element={<AdminSessionCodes />} />
              <Route path="clases-prueba" element={<AdminTrialBookings />} />
              <Route path="planes-prueba" element={<AdminPlanesPrueba />} />
              <Route path="clientes" element={<AdminCustomers />} />
              <Route path="clientes/:id" element={<AdminCustomerDetail />} />
              <Route path="membresias" element={<AdminMembershipPlans />} />
              <Route path="horarios" element={<AdminScheduleEntries />} />
              <Route path="mailerlite" element={<AdminMailerLite />} />
              <Route path="emails" element={<AdminEmailTemplates />} />
              <Route path="chat-logs" element={<AdminChatLogs />} />
              <Route path="brain" element={<AdminBrain />} />
              <Route path="nave-ai" element={<AdminAIKnowledge />} />
              <Route path="tienda" element={<AdminShopProducts />} />
              <Route path="tienda-ordenes" element={<AdminShopOrders />} />
            </Route>
            
            {/* Redirect legacy routes */}
            <Route path="/planes" element={<Navigate to="/planes-precios" replace />} />
            <Route path="/taller-wim-hof-santiago-fundamentales-avanzado" element={<TallerSantiago />} />
            <Route path="/talleres-y-retiros" element={<TalleresYRetiros />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          <WhatsAppWidget onOpenChat={() => chatRef.current?.open()} />
          <ChatWidget ref={chatRef} />
          </EmailCaptureModalProvider>
            </TrialModalProvider>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
  );
};


export default App;
