import { useEffect, useRef } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  type ErrorComponentProps,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { HelmetProvider } from "react-helmet-async";
import appCss from "../styles.css?url";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { TrialModalProvider } from "@/context/TrialModalProvider";
import { EmailCaptureModalProvider } from "@/context/EmailCaptureModalProvider";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";
import { CheckoutRedirectManager } from "@/components/CheckoutRedirectManager";
import { SEOHead } from "@/components/SEOHead";
import { TrialDelegationHandler } from "@/components/TrialDelegationHandler";
import FacebookPixelRouterTracker from "@/components/FacebookPixelRouterTracker";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { ChatWidget, type ChatWidgetHandle } from "@/components/ChatWidget";
import { ScrollToTop } from "@/components/ScrollToTop";
import { MailerLiteUniversal } from "@/components/MailerLiteUniversal";
import { GtagClickTracker } from "@/components/GtagClickTracker";
import { Promo18Offset } from "@/components/Promo18Banner";
import { CyberBannerOffset } from "@/components/CyberBanner";
import { useLocation } from "@/lib/router-compat";
import NotFound from "@/pages/NotFound";

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://studiolanave.com/#organization",
      name: "Nave Studio",
      url: "https://studiolanave.com/",
      logo: "https://studiolanave.com/lovable-uploads/79b55bf0-58ef-4275-a156-4523124bd6b8.png",
      sameAs: ["https://www.instagram.com/nave.icestudio", "https://www.instagram.com/alan_iceman"],
    },
    {
      "@type": "WebSite",
      "@id": "https://studiolanave.com/#website",
      url: "https://studiolanave.com/",
      name: "Nave Studio",
      publisher: { "@id": "https://studiolanave.com/#organization" },
      inLanguage: "es-CL",
    },
    {
      "@type": "HealthAndBeautyBusiness",
      "@id": "https://studiolanave.com/#localbusiness",
      name: "Nave Studio",
      image: "https://studiolanave.com/og-image.png",
      url: "https://studiolanave.com/",
      telephone: "+56946120426",
      priceRange: "$$",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Antares 259",
        addressLocality: "Las Condes",
        addressRegion: "Región Metropolitana",
        addressCountry: "CL",
      },
      sameAs: ["https://www.instagram.com/nave.icestudio", "https://www.instagram.com/alan_iceman"],
    },
  ],
};

const FB_PIXEL = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '1791940698345092');`;

const GTAG = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-JM8PCXDKSG');gtag('config', 'AW-18275451491');`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { name: "google-site-verification", content: "VnXPHKHpHykVDQB_m5eU3zUB-lzACnmhtEG05oI8xxg" },
      { name: "google-site-verification", content: "0qKUDYmE61YdnM6Wkq0oSMaJ2_3g3ua8Hg4DbARjXwU" },
      { property: "og:locale", content: "es_CL" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/inter-v20-UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2", crossOrigin: "anonymous" },
      { rel: "preload", as: "font", type: "font/woff2", href: "/fonts/spacegrotesk-v22-V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2", crossOrigin: "anonymous" },
      { rel: "icon", type: "image/png", href: "/lovable-uploads/79b55bf0-58ef-4275-a156-4523124bd6b8.png" },
    ],
    scripts: [
      { children: FB_PIXEL },
      { src: "https://www.googletagmanager.com/gtag/js?id=G-JM8PCXDKSG", async: true },
      { children: GTAG },
      { type: "application/ld+json", children: JSON.stringify(ORGANIZATION_SCHEMA) },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootError,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <noscript>
          <img height="1" width="1" style={{ display: "none" }} alt="" src="https://www.facebook.com/tr?id=1791940698345092&ev=PageView&noscript=1" />
        </noscript>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const helmetContext = {};

function SiteChrome() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/icefest-santiago")) return null;
  return (
    <>
      <Header />
      <Promo18Offset />
      <CyberBannerOffset />
    </>
  );
}

function WhatsAppWidgetWrapper({ onOpenChat }: { onOpenChat: () => void }) {
  const { pathname } = useLocation();
  if (pathname.startsWith("/icefest-santiago")) return null;
  // Hide WhatsApp FAB on mobile in /tienda so it doesn't overlap the cart bottom bar
  const hideOnMobile = pathname === "/tienda";
  return (
    <div className={hideOnMobile ? "hidden md:block" : ""}>
      <WhatsAppWidget onOpenChat={onOpenChat} />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const chatRef = useRef<ChatWidgetHandle>(null);
  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
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
                <SiteChrome />
                <Outlet />
                <WhatsAppWidgetWrapper onOpenChat={() => chatRef.current?.open()} />
                <ChatWidget ref={chatRef} />
              </EmailCaptureModalProvider>
            </TrialModalProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

function RootError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-heading">This page didn't load</h1>
        <p className="text-muted-foreground">Ocurrió un problema al cargar esta página.</p>
        <div className="flex gap-3 justify-center">
          <button
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </button>
          <Link to="/" className="px-4 py-2 rounded-md border border-border">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
