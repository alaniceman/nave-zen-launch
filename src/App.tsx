import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import Planes from "./pages/Planes";
import Experiencias from "./pages/Experiencias";
import Coaches from "./pages/Coaches";
import Contacto from "./pages/Contacto";
import NotFound from "./pages/NotFound";
import { CheckoutRedirectManager } from "@/components/CheckoutRedirectManager";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CheckoutRedirectManager />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/experiencias" element={<Experiencias />} />
          <Route path="/coaches" element={<Coaches />} />
          <Route path="/contacto" element={<Contacto />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
