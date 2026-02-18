import { lazy, Suspense } from "react";
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
import { AuthProvider } from "@/context/AuthContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { MailerLiteUniversal } from "@/components/MailerLiteUniversal";
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
const Horarios = lazy(() => import("./pages/Horarios"));
const FAQ = lazy(() => import("./pages/FAQ"));
const ClaseDePrueba = lazy(() => import("./pages/ClaseDePrueba"));
const TrialClassSchedule = lazy(() => import("./pages/TrialClassSchedule"));
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
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers"));
const AdminCustomerDetail = lazy(() => import("./pages/admin/AdminCustomerDetail"));
const AdminMembershipPlans = lazy(() => import("./pages/admin/AdminMembershipPlans"));

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <TrialModalProvider>
              <Toaster />
              <Sonner />
              <CheckoutRedirectManager />
              <BrowserRouter>
              <EmailCaptureModalProvider>
             <ScrollToTop />
              <SEOHead />
              <FacebookPixelRouterTracker />
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
            <Route path="/horarios" element={<Horarios />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/clase-de-prueba" element={<ClaseDePrueba />} />
            <Route path="/clase-de-prueba/agendar" element={<TrialClassSchedule />} />
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
              <Route path="clientes" element={<AdminCustomers />} />
              <Route path="clientes/:id" element={<AdminCustomerDetail />} />
              <Route path="membresias" element={<AdminMembershipPlans />} />
              <Route path="horarios" element={<AdminScheduleEntries />} />
              <Route path="mailerlite" element={<AdminMailerLite />} />
            </Route>
            
            {/* Redirect legacy routes */}
            <Route path="/planes" element={<Navigate to="/planes-precios" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
          <WhatsAppWidget />
          </EmailCaptureModalProvider>
        </BrowserRouter>
        </TrialModalProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
  );


export default App;
