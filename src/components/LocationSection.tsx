import { Button } from "@/components/ui/button";
const LocationSection = () => {
  return <section className="bg-background py-[38px]">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex justify-center">
          {/* Panel de información */}
          <div className="bg-white rounded-[10px] p-8 lg:p-10 shadow-sm animate-fade-in max-w-2xl w-full">
            <div className="text-primary">
              <h2 className="text-3xl font-bold mb-6 font-space-grotesk">
                Visítanos en Nave Studio
              </h2>
              
              <div className="mb-6">
                <p className="font-inter text-muted-foreground mb-2">
                  Antares 259, Las Condes
                </p>
                <a href="https://maps.app.goo.gl/oW6G58gLd5oYWmGn8" target="_blank" rel="noopener noreferrer" aria-label="Ver ubicación en Google Maps" className="text-accent underline hover:text-primary transition-colors duration-300 font-inter font-medium">
                  Ver mapa →
                </a>
              </div>
              
              <div className="mb-6">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3330.1805968439147!2d-70.51820932443378!3d-33.409785773343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf6bd6e9ed1f%3A0x123456789abcdef0!2sAntares%20259%2C%20Las%20Condes%2C%20Regi%C3%B3n%20Metropolitana%2C%20Chile!5e0!3m2!1sen!2scl!4v1635123456789!5m2!1sen!2scl" width="100%" height="220" loading="lazy" className="rounded-lg border" title="Mapa de ubicación Nave Studio - Antares 259, Las Condes"></iframe>
              </div>

              <div className="mb-8">
                <p className="font-inter mb-4">
                  <strong className="font-semibold">Contacto rápido</strong>
                </p>
                <p className="font-inter text-muted-foreground mb-2">
                  WhatsApp:{" "}
                  <a href="https://wa.me/56946120426" target="_blank" rel="noopener noreferrer" aria-label="Contactar por WhatsApp" className="text-accent underline hover:text-primary transition-colors duration-300 font-medium">
                    +56 9 4612 0426
                  </a>
                </p>
                <p className="font-inter text-muted-foreground">
                  Instagram:{" "}
                  <a href="https://www.instagram.com/nave.icestudio" target="_blank" rel="noopener noreferrer" aria-label="Seguir en Instagram" className="text-accent underline hover:text-primary transition-colors duration-300 font-medium">
                    @nave.icestudio
                  </a>
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Button asChild className="btn-primary bg-accent hover:bg-primary text-white font-inter font-medium py-3 px-6 rounded-[10px] hover:scale-105 transition-all duration-300 w-full">
                  <a href="#planes">Explorar planes</a>
                </Button>
                
                <Button variant="outline" asChild className="btn-secondary border-2 border-accent text-accent hover:bg-accent hover:text-white font-inter font-medium py-3 px-6 rounded-[10px] hover:scale-105 transition-all duration-300 w-full">
                  
                </Button>
                
                <Button variant="ghost" asChild className="btn-tertiary text-accent underline hover:text-primary font-inter font-medium py-3 px-6 hover:scale-105 transition-all duration-300 w-full">
                  
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export { LocationSection };