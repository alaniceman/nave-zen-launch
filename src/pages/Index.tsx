import { HeroSection } from "@/components/HeroSection"
import { SocialProofSection } from "@/components/SocialProofSection"
import { MethodologiesSection } from "@/components/MethodologiesSection"
import { PricingSection } from "@/components/PricingSection"
import { CoachesSection } from "@/components/CoachesSection"
import { FreeYogaSection } from "@/components/FreeYogaSection"
import { LocationSection } from "@/components/LocationSection"
import { Footer } from "@/components/Footer"
import { TrialMiniBar } from "@/components/TrialMiniBar"
import { TrialYogaSection } from "@/components/TrialYogaSection"

const Index = () => {
  return (
    <main className="overflow-x-hidden" id="home">
      <HeroSection />
      <TrialMiniBar />
      <SocialProofSection />
      <MethodologiesSection />
      <TrialYogaSection />
      <PricingSection />
      <CoachesSection />
      <FreeYogaSection />
      <LocationSection />
      
      <Footer />
      </main>
  );
};

export default Index;
