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
import { NextClassAutoWidget } from "@/components/NextClassAutoWidget"
import { AskNaveBar } from "@/components/AskNaveBar"


const Index = () => {
  return (
    <>
      <Helmet>
        <title>Yoga, Baños de Hielo y Wim Hof en Las Condes | Nave Studio</title>
        <meta name="description" content="Ice Bath, Breathwork Wim Hof, Yoga y biohacking en Las Condes. Reserva tu clase y regula tu sistema nervioso." />
        <link rel="canonical" href="https://studiolanave.com/" />
        <meta property="og:title" content="Yoga, Baños de Hielo y Wim Hof en Las Condes | Nave Studio" />
        <meta property="og:description" content="Ice Bath, Breathwork Wim Hof, Yoga y biohacking en Las Condes. Reserva tu clase y regula tu sistema nervioso." />
        <meta property="og:image" content="https://studiolanave.com/og-image.png" />
        <meta property="og:url" content="https://studiolanave.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content="Yoga, Baños de Hielo y Wim Hof en Las Condes | Nave Studio" />
        <meta name="twitter:description" content="Ice Bath, Breathwork Wim Hof, Yoga y biohacking en Las Condes. Reserva tu clase y regula tu sistema nervioso." />
      </Helmet>
      <main className="overflow-x-hidden" id="home">
      <div className="relative">
        <HeroSection />
        <AskNaveBar overlap className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-30" />
      </div>
      <SocialProofSection />

      <MethodologiesSection />
      <TrialYogaSection />
      <PricingSection />
      <CoachesSection />
      
      <LocationSection />
      <GiftCardSection />
      <Footer />
      <StickyMobileCTA />
      <NextClassAutoWidget tags={["yoga","wim-hof"]} href="/horarios" storageKey="home" />
    </main>
    </>
  );
};

export default Index;
