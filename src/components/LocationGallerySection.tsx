import { useEffect, useState, useCallback } from "react";
import { MapPin, Phone, Instagram, Clock, X, ChevronLeft, ChevronRight, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

import yogaPurple from "@/assets/space/yoga-purple-overhead.webp";
import maralPortrait from "@/assets/space/maral-portrait.webp";
import bowlsCircle from "@/assets/space/sound-bowls-circle.webp";
import soundAurora from "@/assets/space/sound-journey-aurora.webp";
import bowlsGreen from "@/assets/space/bowls-green-light.webp";
import bowlsPink from "@/assets/space/bowls-pink-light.webp";
import iceSmile from "@/assets/space/ice-bath-smile.webp";
import meditationAurora from "@/assets/space/meditation-aurora-ceiling.webp";
import yinRelax from "@/assets/space/yin-relaxation.webp";
import savasanaRest from "@/assets/space/savasana-rest.webp";

type GalleryImage = { src: string; alt: string };

const gallery: GalleryImage[] = [
  { src: meditationAurora, alt: "Meditación guiada con luces aurora en Nave Studio" },
  { src: iceSmile, alt: "Mujer sonriendo dentro del ice bath en Nave Studio" },
  { src: bowlsCircle, alt: "Círculo de cuencos de cuarzo durante una sesión de sonido" },
  { src: soundAurora, alt: "Sound journey con proyecciones aurora en el techo" },
  { src: yogaPurple, alt: "Clase de yoga con luz púrpura vista desde arriba" },
  { src: yinRelax, alt: "Sesión de Yin Yoga y relajación profunda" },
  { src: bowlsPink, alt: "Cuencos de cuarzo iluminados con luz rosa" },
  { src: bowlsGreen, alt: "Cuencos de cuarzo con luz verde durante meditación" },
  { src: savasanaRest, alt: "Savasana y descanso final en clase de yoga" },
  { src: maralPortrait, alt: "Maral, instructora de Nave Studio" },
];

const ADDRESS = "Antares 259, Las Condes, Santiago";
const MAPS_URL = "https://maps.app.goo.gl/RZmsnSLuxH8XkW2K6";
const WHATSAPP_URL = "https://wa.me/56946120426";
const WHATSAPP_DISPLAY = "+56 9 4612 0426";
const INSTAGRAM_URL = "https://www.instagram.com/nave.icestudio";

export const LocationGallerySection = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i - 1 + gallery.length) % gallery.length)),
    []
  );
  const next = useCallback(
    () => setLightboxIndex((i) => (i === null ? null : (i + 1) % gallery.length)),
    []
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightboxIndex, close, prev, next]);

  // Touch swipe support
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (dx > 40) prev();
    else if (dx < -40) next();
    setTouchStartX(null);
  };

  return (
    <section className="bg-background py-16 md:py-20" id="conoce-el-lugar">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14 animate-fade-in">
          <p className="font-inter text-sm uppercase tracking-[0.18em] text-warm mb-3">
            Visítanos
          </p>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary mb-4">
            Conoce Nave Studio
          </h2>
          <p className="font-inter text-base md:text-lg text-neutral-mid max-w-2xl mx-auto leading-relaxed">
            Un espacio cálido y cuidado en Las Condes para volver a ti, respirar y reconectar.
            Te invitamos a conocerlo en persona.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Gallery — editorial grid */}
          <div className="lg:col-span-7 animate-fade-in">
            <div className="grid grid-cols-6 auto-rows-[110px] sm:auto-rows-[140px] md:auto-rows-[160px] gap-3 md:gap-4">
              {gallery.slice(0, 7).map((img, i) => {
                // Editorial pattern: feature first, mix tall/wide
                const layouts = [
                  "col-span-6 row-span-2", // 0 hero
                  "col-span-3 row-span-2", // 1
                  "col-span-3 row-span-2", // 2
                  "col-span-2 row-span-2", // 3
                  "col-span-2 row-span-2", // 4
                  "col-span-2 row-span-2", // 5
                  "col-span-6 row-span-2", // 6 wide
                ];
                return (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setLightboxIndex(i)}
                    className={`${layouts[i]} group relative overflow-hidden rounded-[10px] shadow-[var(--shadow-light)] focus:outline-dashed focus:outline-2 focus:outline-secondary`}
                    aria-label={`Ampliar imagen: ${img.alt}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                  </button>
                );
              })}
            </div>

            {/* "Ver más" thumbnails row */}
            {gallery.length > 7 && (
              <div className="grid grid-cols-3 gap-3 md:gap-4 mt-3 md:mt-4">
                {gallery.slice(7).map((img, i) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setLightboxIndex(7 + i)}
                    className="relative aspect-[4/3] overflow-hidden rounded-[10px] shadow-[var(--shadow-light)] group focus:outline-dashed focus:outline-2 focus:outline-secondary"
                    aria-label={`Ampliar imagen: ${img.alt}`}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Contact / Location card */}
          <aside className="lg:col-span-5 lg:sticky lg:top-24 animate-fade-in">
            <div className="bg-card rounded-[10px] shadow-[var(--shadow-light)] p-7 md:p-8 border border-border">
              <h3 className="font-heading text-2xl text-primary mb-2">
                Estamos en Las Condes
              </h3>
              <p className="font-inter text-neutral-mid text-sm leading-relaxed mb-6">
                Un espacio diseñado para la calma, la conexión y el bienestar. Ven a vivirlo.
              </p>

              <ul className="space-y-4 mb-6">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-inter text-sm font-medium text-neutral-dark">{ADDRESS}</p>
                    <p className="font-inter text-xs text-neutral-mid mt-0.5">
                      A pasos del Mall Apumanque y Metro Manquehue
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-inter text-xs text-neutral-mid">WhatsApp</p>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-inter text-sm font-medium text-neutral-dark hover:text-warm transition-colors"
                    >
                      {WHATSAPP_DISPLAY}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <Instagram className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-inter text-xs text-neutral-mid">Instagram</p>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-inter text-sm font-medium text-neutral-dark hover:text-warm transition-colors"
                    >
                      @nave.icestudio
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                    <Clock className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-inter text-xs text-neutral-mid">Horario</p>
                    <p className="font-inter text-sm font-medium text-neutral-dark">
                      Lun – Dom · 07:00 – 20:00
                    </p>
                  </div>
                </li>
              </ul>

              <div className="flex flex-col gap-3">
                <Button
                  asChild
                  className="bg-secondary hover:bg-primary text-white font-inter font-medium py-3 rounded-[10px] transition-all duration-200 hover:scale-[1.02] w-full"
                >
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    Escríbenos por WhatsApp
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-inter font-medium py-3 rounded-[10px] transition-all duration-200 w-full"
                >
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
                    <Navigation className="w-4 h-4 mr-2" />
                    Cómo llegar
                  </a>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className="text-warm hover:text-primary hover:bg-warm/5 font-inter font-medium py-3 rounded-[10px] w-full"
                >
                  <a href="/horarios">Ver horarios</a>
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galería de imágenes ampliada"
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center animate-fade-in"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar galería"
            className="absolute top-4 right-4 md:top-6 md:right-6 text-white/90 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-dashed focus:outline-2 focus:outline-secondary"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Imagen anterior"
            className="hidden md:flex absolute left-4 md:left-6 text-white/90 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-dashed focus:outline-2 focus:outline-secondary"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Imagen siguiente"
            className="hidden md:flex absolute right-4 md:right-6 text-white/90 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-dashed focus:outline-2 focus:outline-secondary"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div
            className="max-w-5xl max-h-[85vh] w-[92vw] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery[lightboxIndex].src}
              alt={gallery[lightboxIndex].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-[10px] shadow-2xl"
            />
          </div>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs font-inter">
            {lightboxIndex + 1} / {gallery.length}
          </p>
        </div>
      )}
    </section>
  );
};

export default LocationGallerySection;
