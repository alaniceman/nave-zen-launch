import { useEffect, useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";

interface NextClassWidgetProps {
  when: string;
  time: string;
  title: string;
  instructor?: string;
  href?: string;
  labelPrefix?: string;
}

const DISMISS_KEY = "nextClassWidgetDismissed";
const SCROLL_TRIGGER = 400;
const SWIPE_THRESHOLD = 60;

export const NextClassWidget = ({ when, time, title, instructor, href = "#horarios-yoga" }: NextClassWidgetProps) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const draggingRef = useRef(false);

  // Restore dismissed state per session
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
  }, []);

  // Scroll trigger
  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => setVisible(window.scrollY > SCROLL_TRIGGER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    startRef.current = { x: t.clientX, y: t.clientY };
    draggingRef.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!startRef.current || !draggingRef.current) return;
    const t = e.touches[0];
    const dx = t.clientX - startRef.current.x;
    const dy = Math.max(0, t.clientY - startRef.current.y); // allow only downward
    setDrag({ x: dx, y: dy });
  };

  const onTouchEnd = () => {
    if (!startRef.current) return;
    const { x, y } = drag;
    const shouldDismiss = Math.abs(x) > SWIPE_THRESHOLD || y > SWIPE_THRESHOLD;
    startRef.current = null;
    draggingRef.current = false;
    if (shouldDismiss) {
      // animate out in the swipe direction
      const finalX = Math.abs(x) > Math.abs(y) ? (x > 0 ? 400 : -400) : 0;
      const finalY = Math.abs(y) > Math.abs(x) ? 400 : 0;
      setDrag({ x: finalX, y: finalY });
      setTimeout(dismiss, 220);
    } else {
      setDrag({ x: 0, y: 0 });
    }
  };

  if (dismissed) return null;

  const isDragging = draggingRef.current;
  const opacity = Math.max(0, 1 - Math.max(Math.abs(drag.x), Math.abs(drag.y)) / 200);

  return (
    <div
      className={`fixed z-40 left-3 right-3 mx-auto max-w-sm bottom-24 lg:left-6 lg:right-auto lg:bottom-6 lg:max-w-xs transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
      }`}
    >
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translate(${drag.x}px, ${drag.y}px)`,
          transition: isDragging ? "none" : "transform 0.22s ease-out, opacity 0.22s ease-out",
          opacity: opacity,
          touchAction: "pan-y",
        }}
        className="relative bg-card/95 backdrop-blur-md border border-accent/30 rounded-2xl shadow-xl pl-4 pr-10 py-3"
      >
        <a href={href} className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-accent font-medium font-inter leading-tight">
              Próxima clase {when}
            </p>
            <p className="text-sm font-bold text-primary font-space leading-tight truncate">
              {time} · {title}
            </p>
            {instructor && (
              <p className="text-xs text-muted-foreground font-inter truncate">
                con {instructor}
              </p>
            )}
          </div>
        </a>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
          aria-label="Cerrar aviso"
          className="absolute top-1/2 -translate-y-1/2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {/* Swipe hint dashes (mobile only) */}
        <div className="lg:hidden absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-muted-foreground/25" aria-hidden="true" />
      </div>
    </div>
  );
};
