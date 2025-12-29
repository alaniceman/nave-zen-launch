import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { TrialModalProvider } from "@/context/TrialModalProvider";
import { EmailCaptureModalProvider } from "@/context/EmailCaptureModalProvider";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import Planes from "./pages/Planes";
import Experiencias from "./pages/Experiencias";
import Coaches from "./pages/Coaches";
import Contacto from "./pages/Contacto";
import Blog from "./pages/Blog";
import BlogWimHof from "./pages/BlogWimHof";
import BlogBiohacking from "./pages/BlogBiohacking";
import BlogYinVinyasa from "./pages/BlogYinVinyasa";
import BlogHabitosDisciplina from "./pages/BlogHabitosDisciplina";
import BlogAguaFriaGuiado from "./pages/BlogAguaFriaGuiado";
import BlogProtocoloSeguro from "./pages/BlogProtocoloSeguro";
import Cyber2025 from "./pages/Cyber2025";
import Horarios from "./pages/Horarios";
import FAQ from "./pages/FAQ";
import ClaseDePrueba from "./pages/ClaseDePrueba";
import CriomedicinMetodoWimHof from "./pages/CriomedicinMetodoWimHof";
import CriomedicinIceBathEnGrupo from "./pages/CriomedicinIceBathEnGrupo";
import Terminos from "./pages/Terminos";
import Privacidad from "./pages/Privacidad";
import NotFound from "./pages/NotFound";
import Bonos from "./pages/Bonos";
import BonosSuccess from "./pages/BonosSuccess";
import GiftCards from "./pages/GiftCards";
import GiftCardsSuccess from "./pages/GiftCardsSuccess";
import GiftCardsFailure from "./pages/GiftCardsFailure";
import GiftCardView from "./pages/GiftCardView";
import AgendaNaveStudio from "./pages/AgendaNaveStudio";
import AgendaSuccess from "./pages/AgendaSuccess";
import AgendaFailure from "./pages/AgendaFailure";
import AgendaPending from "./pages/AgendaPending";
import { CheckoutRedirectManager } from "@/components/CheckoutRedirectManager";
import { SEOHead } from "@/components/SEOHead";
import { TrialDelegationHandler } from "@/components/TrialDelegationHandler";
import FacebookPixelRouterTracker from "@/components/FacebookPixelRouterTracker";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminProfessionals from "./pages/admin/AdminProfessionals";
import AdminServices from "./pages/admin/AdminServices";
import AdminAvailability from "./pages/admin/AdminAvailability";
import AdminFutureSlots from "./pages/admin/AdminFutureSlots";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminCapacityOverrides from "./pages/admin/AdminCapacityOverrides";
import AdminSessionPackages from "./pages/admin/AdminSessionPackages";
import AdminSessionCodes from "./pages/admin/AdminSessionCodes";
import AdminBranches from "./pages/admin/AdminBranches";

const queryClient = new QueryClient();

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
              <SEOHead />
              <FacebookPixelRouterTracker />
              <TrialDelegationHandler />
              <Header />
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
            <Route path="/cyber-2025" element={<Cyber2025 />} />
            <Route path="/horarios" element={<Horarios />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/clase-de-prueba" element={<ClaseDePrueba />} />
            <Route path="/criomedicina-metodo-wim-hof" element={<CriomedicinMetodoWimHof />} />
            <Route path="/criomedicina-ice-bath-en-grupo" element={<CriomedicinIceBathEnGrupo />} />
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
              <Route path="agenda" element={<AdminBookings />} />
              <Route path="sucursales" element={<AdminBranches />} />
              <Route path="profesionales" element={<AdminProfessionals />} />
              <Route path="servicios" element={<AdminServices />} />
              <Route path="cupones" element={<AdminCoupons />} />
              <Route path="disponibilidad" element={<AdminAvailability />} />
              <Route path="agendas-futuras" element={<AdminFutureSlots />} />
              <Route path="capacidad" element={<AdminCapacityOverrides />} />
              <Route path="paquetes-sesiones" element={<AdminSessionPackages />} />
              <Route path="codigos-sesiones" element={<AdminSessionCodes />} />
            </Route>
            
            {/* Redirect legacy routes */}
            <Route path="/planes" element={<Navigate to="/planes-precios" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
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
