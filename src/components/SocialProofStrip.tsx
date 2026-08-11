import { Star, MapPin, Clock, ShieldCheck } from "lucide-react";
import { reviews as allReviews, type Review } from "@/data/reviews";

const Stars = ({ size = 15 }: { size?: number }) => (
  <div className="flex items-center gap-0.5" aria-label="5 de 5 estrellas">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={size} className="fill-warm text-warm" strokeWidth={0} />
    ))}
  </div>
);

const truncate = (s: string, n = 110) =>
  s.length <= n ? s : `${s.slice(0, n).trimEnd()}…`;

type SocialProofStripProps = {
  /** Reseñas a destacar. Si no se pasan, usa las de Yoga. */
  items?: Review[];
  /** Cantidad de citas visibles */
  count?: number;
  /** Total de reseñas a comunicar (por defecto, el largo del set) */
  total?: number;
  className?: string;
};

/**
 * Franja compacta de prueba social. Va alta en la página (justo bajo el hero)
 * para que la primera pantalla ya muestre confianza sin costar altura.
 */
export const SocialProofStrip = ({
  items,
  count = 3,
  total,
  className = "",
}: SocialProofStripProps) => {
  const source = items ?? allReviews.filter((r) => r.category === "Yoga");
  const quotes = source.slice(0, count);
  const reviewTotal = total ?? source.length;

  return (
    <section className={`bg-neutral-light border-y border-border/50 ${className}`}>
      <div className="container mx-auto px-6 py-6 md:py-7">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-8">
          {/* Rating */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Stars />
            <p className="text-sm font-inter text-primary font-semibold whitespace-nowrap">
              {reviewTotal}+ reseñas de la comunidad
            </p>
          </div>

          {/* Citas */}
          <ul className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quotes.map((q) => (
              <li
                key={q.id}
                className="text-xs md:text-sm font-inter text-muted-foreground leading-snug"
              >
                <span className="text-primary">“{truncate(q.text)}”</span>
                <span className="block text-[11px] mt-1 text-muted-foreground/80">
                  — {q.author}
                </span>
              </li>
            ))}
          </ul>

          {/* Señales de confianza */}
          <ul className="flex flex-wrap lg:flex-col gap-2 lg:gap-1.5 flex-shrink-0">
            <li className="inline-flex items-center gap-1.5 text-xs font-inter text-primary">
              <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Instructoras certificadas
            </li>
            <li className="inline-flex items-center gap-1.5 text-xs font-inter text-primary">
              <MapPin className="w-3.5 h-3.5 text-accent" /> Antares 259, Las Condes
            </li>
            <li className="inline-flex items-center gap-1.5 text-xs font-inter text-primary">
              <Clock className="w-3.5 h-3.5 text-accent" /> Clases presenciales de 60 min
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
