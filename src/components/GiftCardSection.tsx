export const GiftCardSection = () => {
  return (
    <section className="py-16 md:py-20 bg-[#E9F6F9]">
      <div className="container mx-auto px-6 max-w-[700px] text-center">
        {/* Icons */}
        <div className="flex justify-center gap-3 text-5xl mb-6">
          ❄️🎁
        </div>
        
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-space font-bold text-primary mb-6">
          Regala una experiencia de Criomedicina (Método Wim Hof)
        </h2>
        
        {/* Description */}
        <p className="text-lg font-inter text-foreground/80 mb-8 leading-relaxed">
          Sorprende a alguien con una sesión de Criomedicina y Método Wim Hof en Nave Studio.
          Una experiencia transformadora para regular el sistema nervioso, liberar estrés 
          y reconectar con su poder interior.
        </p>
        
        {/* CTA Button */}
        <a
          href="/giftcards"
          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-primary 
                     text-white font-semibold text-lg px-8 py-4 rounded-xl 
                     transition-all duration-300 hover:scale-105 shadow-lg"
        >
          🧊 Comprar Gift Card
        </a>
        
        {/* Small text */}
        <p className="text-sm font-inter text-foreground/70 mt-6">
          Válida para una sesión de Criomedicina (Método Wim Hof). Entrega digital inmediata.
        </p>
      </div>
    </section>
  );
};
