import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Camera, Instagram, X, ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "@/assets/taller-whm-santiago/IMG_4847.webp.asset.json";
import img2 from "@/assets/taller-whm-santiago/IMG_4869.webp.asset.json";
import img3 from "@/assets/taller-whm-santiago/IMG_4870.webp.asset.json";
import img4 from "@/assets/taller-whm-santiago/IMG_4871.webp.asset.json";
import img5 from "@/assets/taller-whm-santiago/IMG_4872.webp.asset.json";
import img6 from "@/assets/taller-whm-santiago/IMG_4877.webp.asset.json";
import img7 from "@/assets/taller-whm-santiago/IMG_4878.webp.asset.json";
import img8 from "@/assets/taller-whm-santiago/IMG_4879.webp.asset.json";
import img9 from "@/assets/taller-whm-santiago/IMG_4883.webp.asset.json";
import img10 from "@/assets/taller-whm-santiago/IMG_4884.webp.asset.json";

const photos = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10].map(
  (a, i) => ({ url: a.url, alt: `Taller Wim Hof Santiago — foto ${i + 1}` })
);

const FotosTallerWimHofSantiago = () => {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <Helmet>
        <title>Fotos Taller Wim Hof Santiago | Nave Studio</title>
        <meta name="robots" content="noindex,nofollow" />
        <meta name="description" content="Revisa las fotos del Taller Wim Hof Santiago en Nave Studio." />
      </Helmet>

      <main className="min-h-screen bg-background pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Taller Wim Hof Santiago
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Revisa las fotos del taller. No olvides mencionar a{" "}
              <a
                href="https://instagram.com/alan_iceman"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                <Instagram className="h-4 w-4" />
                @alan_iceman
              </a>{" "}
              al compartir.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={`Abrir ${p.alt}`}
              >
                <img
                  src={p.url}
                  alt={p.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        </div>

        {open && index !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setIndex(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setIndex(null); }}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
              aria-label="Cerrar"
            >
              <X className="h-7 w-7" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIndex((i) => (i! - 1 + photos.length) % photos.length); }}
              className="absolute left-2 md:left-6 text-white/80 hover:text-white p-2"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <img
              src={photos[index].url}
              alt={photos[index].alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
            />
            <button
              onClick={(e) => { e.stopPropagation(); setIndex((i) => (i! + 1) % photos.length); }}
              className="absolute right-2 md:right-6 text-white/80 hover:text-white p-2"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default FotosTallerWimHofSantiago;
