export const GiftCardSection = () => {
  return (
    <section className="py-8 md:py-10 bg-accent/5">
      <div className="container mx-auto px-6 max-w-xl text-center">
        {/* Compact icon row */}
        <div className="flex justify-center gap-2 text-2xl mb-3">
          ❄️🎁
        </div>

        {/* Title */}
        <h2 className="text-lg md:text-xl font-space font-bold text-primary mb-2">
          Regala una experiencia de Criomedicina
        </h2>

        {/* Description */}
        <p className="text-sm font-inter text-muted-foreground mb-5 leading-relaxed">
          Sorprende a alguien con una sesión de Criomedicina y Método Wim Hof en Nave Studio.
        </p>

        {/* CTA Button */}
        <a
          href="/giftcards"
          className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-primary
                     text-white font-semibold text-sm px-6 py-2.5 rounded-lg
                     transition-all duration-300 hover:scale-105 shadow-md"
        >
          Comprar Gift Card
        </a>
      </div>
    </section>
  );
};
