import { Helmet } from "react-helmet-async"
import { HeroSection } from "@/components/HeroSection"
import { SocialProofSection } from "@/components/SocialProofSection"
import { MethodologiesSection } from "@/components/MethodologiesSection"
import { PricingSection } from "@/components/PricingSection"
import { CoachesSection } from "@/components/CoachesSection"

import { LocationSection } from "@/components/LocationSection"
import { Footer } from "@/components/Footer"
import { TrialMiniBar } from "@/components/TrialMiniBar"
import { TrialYogaSection } from "@/components/TrialYogaSection"
import { GiftCardSection } from "@/components/GiftCardSection"
import { StickyMobileCTA } from "@/components/StickyMobileCTA"
import { BautizoHieloPromo } from "@/components/BautizoHieloPromo"

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Nave Studio | Centro de bienestar basado en ciencia en Las Condes</title>
        <meta name="description" content="Ice Bath, Método Wim Hof, Yoga y Breathwork en Las Condes. Reserva tu clase y regula tu sistema nervioso." />
        <link rel="canonical" href="https://studiolanave.com/" />
        <meta property="og:title" content="Nave Studio | Ice Bath, Método Wim Hof y Yoga en Las Condes" />
        <meta property="og:description" content="Centro de bienestar basado en ciencia. Regula tu sistema nervioso con Método Wim Hof, baños de hielo y yoga. Primera clase gratis." />
        <meta property="og:image" content="https://studiolanave.com/og-image.png" />
        <meta property="og:url" content="https://studiolanave.com/" />
        <meta property="og:type" content="website" />
      </Helmet>
      <main className="overflow-x-hidden" id="home">
      <HeroSection />
      <TrialMiniBar />
      <SocialProofSection />
      <BautizoHieloPromo />
      <MethodologiesSection />
      <TrialYogaSection />
      <PricingSection />
      <CoachesSection />
      
      <LocationSection />
      <GiftCardSection />
      <Footer />
      <StickyMobileCTA />
    </main>
    </>
  );
};

export default Index;
