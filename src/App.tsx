import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import Planes from "./pages/Planes";
import Experiencias from "./pages/Experiencias";
import Coaches from "./pages/Coaches";
import Contacto from "./pages/Contacto";
import Blog from "./pages/Blog";
import BlogWimHof from "./pages/BlogWimHof";
import FAQ from "./pages/FAQ";
import Terminos from "./pages/Terminos";
import Privacidad from "./pages/Privacidad";
import NotFound from "./pages/NotFound";
import { CheckoutRedirectManager } from "@/components/CheckoutRedirectManager";
import { SEOHead } from "@/components/SEOHead";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CheckoutRedirectManager />
      <BrowserRouter>
        <SEOHead />
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/planes-precios" element={<Planes />} />
          <Route path="/experiencias" element={<Experiencias />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/metodo-wim-hof-respiracion-frio-mente" element={<BlogWimHof />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          {/* Redirect legacy routes */}
          <Route path="/planes" element={<Navigate to="/planes-precios" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
