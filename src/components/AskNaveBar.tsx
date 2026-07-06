import { useState, useMemo, useEffect, FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

/**
 * Contextual placeholder questions per route.
 * Home rotates through several suggestions to inspire the user.
 */
function getContextualQuestions(pathname: string): string[] {
  const p = pathname.toLowerCase();

  if (p === "/" || p === "") {
    return [
      "¿Qué me recomiendas para empezar en Nave?",
      "¿Cómo funciona el Plan de Prueba?",
      "¿Qué estilos de yoga tienen?",
      "¿Qué es el Método Wim Hof?",
      "¿Cuál es la promo activa este mes?",
      "¿Qué horarios de yoga tienen esta semana?",
      "¿Cómo son los baños de hielo en grupo?",
    ];
  }

  if (p.startsWith("/criomedicina-metodo-wim-hof-las-condes"))
    return ["¿Cómo son las clases de Método Wim Hof aquí?"];
  if (p.startsWith("/criomedicina-metodo-wim-hof"))
    return ["¿Qué beneficios tiene el Método Wim Hof?"];
  if (p.startsWith("/criomedicina-ice-bath"))
    return ["¿Cómo funcionan los baños de hielo en grupo?"];
  if (p.startsWith("/yoga/yin-yoga")) return ["¿Para quién es el Yin Yoga?"];
  if (p.startsWith("/yoga/vinyasa")) return ["¿En qué consiste el Vinyasa Yoga?"];
  if (p.startsWith("/yoga/power")) return ["¿Qué intensidad tiene el Power Yoga?"];
  if (p.startsWith("/yoga/integral")) return ["¿Qué es el Yoga Integral?"];
  if (p.startsWith("/yoga-las-condes")) return ["¿Qué estilos de yoga puedo probar?"];
  if (p.startsWith("/experiencias")) return ["¿Qué experiencia me recomiendas para empezar?"];
  if (p.startsWith("/planes-precios") || p.startsWith("/planes"))
    return ["¿Qué plan me conviene según cuántas veces voy?"];
  if (p.startsWith("/horarios")) return ["¿Cuándo es la próxima clase disponible?"];
  if (p.startsWith("/plan-de-prueba")) return ["¿Qué incluye el plan de prueba?"];
  if (p.startsWith("/agenda")) return ["¿Cómo reservo mi clase?"];
  if (p.startsWith("/bonos")) return ["¿Cuál es el mejor bono para mí?"];
  if (p.startsWith("/giftcard")) return ["¿Cómo funciona la gift card?"];
  if (p.startsWith("/tienda")) return ["¿Qué productos recomiendan?"];
  if (p.startsWith("/conoce-el-lugar")) return ["¿Dónde queda el studio y cómo llego?"];
  if (p.startsWith("/faq")) return ["¿Puedo hacerte una pregunta rápida?"];
  if (p.startsWith("/coaches") || p.startsWith("/instructor"))
    return ["¿Quién dicta las clases y qué formación tienen?"];
  if (p.startsWith("/blog/beneficios-del-ice-bath"))
    return ["¿Cuáles son los principales beneficios del ice bath?"];
  if (p.startsWith("/blog/protocolo-15-minutos"))
    return ["¿Cómo hago el protocolo de 15 minutos en casa?"];
  if (p.startsWith("/blog/protocolo-seguro"))
    return ["¿Cómo empezar a hacer agua fría de forma segura?"];
  if (p.startsWith("/blog/metodo-wim-hof"))
    return ["¿Cómo se practica el Método Wim Hof?"];
  if (p.startsWith("/blog")) return ["¿Puedes contarme más sobre este tema?"];
  if (p.startsWith("/icefest")) return ["¿Qué es el Icefest?"];
  if (p.startsWith("/bautizo-hielo")) return ["¿Qué es el bautizo de hielo?"];
  if (p.startsWith("/talleres") || p.startsWith("/taller"))
    return ["¿Qué talleres tienen próximamente?"];

  return ["¿Qué quieres saber de Nave Studio?"];
}

interface AskNaveBarProps {
  /** Override the contextual placeholder */
  placeholder?: string;
  /** When true, overlaps the previous section (typically the hero) */
  overlap?: boolean;
  className?: string;
}

export const AskNaveBar = ({ placeholder, overlap = true, className = "" }: AskNaveBarProps) => {
  const { pathname } = useLocation();
  const [value, setValue] = useState("");
  const [idx, setIdx] = useState(0);

  const suggestions = useMemo(
    () => (placeholder ? [placeholder] : getContextualQuestions(pathname)),
    [placeholder, pathname]
  );

  // Rotate through suggestions when there is more than one (e.g. home)
  useEffect(() => {
    setIdx(0);
    if (suggestions.length <= 1) return;
    const id = window.setInterval(() => {
      setIdx((i) => (i + 1) % suggestions.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [suggestions]);

  const contextual = suggestions[idx] ?? suggestions[0];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const question = value.trim() || contextual;
    window.dispatchEvent(new CustomEvent("nave:ask", { detail: { question } }));
    setValue("");
  };

  return (
    <section
      className={`w-full px-4 sm:px-6 ${
        overlap ? "relative z-20 -mt-10 md:-mt-16 pb-0" : "py-5 sm:py-6"
      } ${className}`}
      aria-label="Preguntar a Nave AI"
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-background border border-border shadow-2xl rounded-2xl p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2 pl-1">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.18em] font-semibold text-foreground">
              Pregúntale a Nave AI
            </span>
          </div>
          <form
            onSubmit={submit}
            className="flex items-stretch gap-2"
          >
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={contextual}
              aria-label="Escribe tu pregunta"
              className="flex-1 bg-muted/50 outline-none text-foreground placeholder:text-muted-foreground rounded-xl px-3 py-3 text-[10px] sm:text-xs md:text-sm truncate"
              maxLength={300}
            />
            <button
              type="submit"
              aria-label="Enviar pregunta a Nave AI"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold uppercase tracking-wider text-[10px] sm:text-xs md:text-sm px-3 sm:px-6 py-3 rounded-xl whitespace-nowrap transition-colors"
            >
              Enviar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AskNaveBar;
