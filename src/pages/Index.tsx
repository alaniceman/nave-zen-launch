import { HeroSection } from "@/components/HeroSection"
import { SocialProofSection } from "@/components/SocialProofSection"
import { MethodologiesSection } from "@/components/MethodologiesSection"
import { PricingSection } from "@/components/PricingSection"
import { CoachesSection } from "@/components/CoachesSection"
import { FreeYogaSection } from "@/components/FreeYogaSection"

const Index = () => {
  return (
    <main className="overflow-x-hidden" id="home">
      <HeroSection />
      <SocialProofSection />
      <MethodologiesSection />
      <PricingSection />
      <CoachesSection />
      <FreeYogaSection />
      
      {/* Wim Hof Certification Logo */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6 text-center">
          <img 
            src="/lovable-uploads/2d68d2b6-677d-403e-ae7f-60367ea2147c.png" 
            alt="Wim Hof Method Certified Instructor"
            className="mx-auto h-32 object-contain"
          />
        </div>
      </section>
      </main>
  );
};

export default Index;
