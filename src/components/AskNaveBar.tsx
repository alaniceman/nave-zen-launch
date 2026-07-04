import { useState, useMemo, FormEvent } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

/**
 * Contextual placeholder question per route.
 * The user can submit either the placeholder (empty input) or their own text.
 */
function getContextualQuestion(pathname: string): string {
  const p = pathname.toLowerCase();

  if (p.startsWith("/criomedicina-metodo-wim-hof-las-condes"))
    return "¿Cómo son las clases de Método Wim Hof aquí?";
  if (p.startsWith("/criomedicina-metodo-wim-hof"))
    return "¿Qué beneficios tiene el Método Wim Hof?";
  if (p.startsWith("/criomedicina-ice-bath"))
    return "¿Cómo funcionan los baños de hielo en grupo?";
  if (p.startsWith("/yoga/yin-yoga")) return "¿Para quién es el Yin Yoga?";
  if (p.startsWith("/yoga/vinyasa")) return "¿En qué consiste el Vinyasa Yoga?";
  if (p.startsWith("/yoga/power")) return "¿Qué intensidad tiene el Power Yoga?";
  if (p.startsWith("/yoga/integral")) return "¿Qué es el Yoga Integral?";
  if (p.startsWith("/yoga-las-condes")) return "¿Qué estilos de yoga puedo probar?";
  if (p.startsWith("/experiencias")) return "¿Qué experiencia me recomiendas para empezar?";
  if (p.startsWith("/planes-precios") || p.startsWith("/planes"))
    return "¿Qué plan me conviene según cuántas veces voy?";
  if (p.startsWith("/horarios")) return "¿Cuándo es la próxima clase disponible?";
  if (p.startsWith("/plan-de-prueba")) return "¿Qué incluye el plan de prueba?";
  if (p.startsWith("/agenda")) return "¿Cómo reservo mi clase?";
  if (p.startsWith("/bonos")) return "¿Cuál es el mejor bono para mí?";
  if (p.startsWith("/giftcard")) return "¿Cómo funciona la gift card?";
  if (p.startsWith("/tienda")) return "¿Qué productos recomiendan?";
  if (p.startsWith("/conoce-el-lugar")) return "¿Dónde queda el studio y cómo llego?";
  if (p.startsWith("/faq")) return "¿Puedo hacerte una pregunta rápida?";
  if (p.startsWith("/coaches") || p.startsWith("/instructor"))
    return "¿Quién dicta las clases y qué formación tienen?";
  if (p.startsWith("/blog/beneficios-del-ice-bath"))
    return "¿Cuáles son los principales beneficios del ice bath?";
  if (p.startsWith("/blog/protocolo-15-minutos"))
    return "¿Cómo hago el protocolo de 15 minutos en casa?";
  if (p.startsWith("/blog/protocolo-seguro"))
    return "¿Cómo empezar a hacer agua fría de forma segura?";
  if (p.startsWith("/blog/metodo-wim-hof"))
    return "¿Cómo se practica el Método Wim Hof?";
  if (p.startsWith("/blog")) return "¿Puedes contarme más sobre este tema?";
  if (p.startsWith("/icefest")) return "¿Qué es el Icefest?";
  if (p.startsWith("/bautizo-hielo")) return "¿Qué es el bautizo de hielo?";
  if (p.startsWith("/talleres") || p.startsWith("/taller"))
    return "¿Qué talleres tienen próximamente?";

  return "¿Qué quieres saber de Nave Studio?";
}

interface AskNaveBarProps {
  /** Override the contextual placeholder */
  placeholder?: string;
  className?: string;
}

export const AskNaveBar = ({ placeholder, className = "" }: AskNaveBarProps) => {
  const { pathname } = useLocation();
  const [value, setValue] = useState("");

  const contextual = useMemo(
    () => placeholder ?? getContextualQuestion(pathname),
    [placeholder, pathname]
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const question = value.trim() || contextual;
    window.dispatchEvent(
      new CustomEvent("nave:ask", { detail: { question } })
    );
    setValue("");
  };

  return (
    <section
      className={`w-full px-4 py-5 sm:py-6 bg-gradient-to-b from-muted/40 to-transparent ${className}`}
      aria-label="Preguntar a Nave AI"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-2 text-xs sm:text-sm text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Pregúntale a <strong className="text-foreground font-semibold">Nave AI</strong></span>
        </div>
        <form
          onSubmit={submit}
          className="flex items-center gap-2 bg-background border border-border rounded-full shadow-sm hover:shadow-md transition-shadow pl-4 pr-1.5 py-1.5 focus-within:ring-2 focus-within:ring-primary/40"
        >
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={contextual}
            aria-label="Escribe tu pregunta"
            className="flex-1 bg-transparent outline-none text-sm sm:text-base text-foreground placeholder:text-muted-foreground/80 py-1.5"
            style={{ fontSize: "16px" }}
            maxLength={300}
          />
          <button
            type="submit"
            aria-label="Enviar pregunta a Nave AI"
            className="flex-shrink-0 inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-9 h-9 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
};

export default AskNaveBar;
