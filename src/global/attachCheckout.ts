import { toast } from "@/components/ui/use-toast";

export type CheckoutClickDetails = {
  url: string;
  plan?: string | null;
  /** valor del plan en CLP, si el botón lo declara vía data-checkout-value */
  value?: number;
  /** id semántico estable para content_ids, vía data-meta-content-id */
  contentId?: string | null;
  /** true si el origen ya emitió su propio InitiateCheckout (data-no-meta-track) */
  skipTracking: boolean;
  element: HTMLElement;
  event: MouseEvent;
};


// Attaches a delegated click handler for any element matching [data-checkout-url]
export function attachCheckoutRedirect(
  onFound: (details: CheckoutClickDetails) => void
) {
  const handleClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    const el = target.closest<HTMLElement>("[data-checkout-url]");
    if (!el) return;

    const url = el.getAttribute("data-checkout-url");
    const plan = el.getAttribute("data-plan");
    const rawValue = el.getAttribute("data-checkout-value");
    const parsedValue = rawValue ? Number(rawValue) : NaN;
    const skipTracking = el.hasAttribute("data-no-meta-track");
    const contentId = el.getAttribute("data-meta-content-id");

    event.preventDefault();
    event.stopPropagation();

    if (!url) {
      toast({
        title: "No encontramos el link de pago",
        description: "Intenta más tarde o contáctanos.",
        variant: "destructive",
      });
      return;
    }

    onFound({
      url,
      plan,
      value: Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : undefined,
      contentId,
      skipTracking,
      element: el,
      event,
    });

  };

  document.addEventListener("click", handleClick, true);

  return () => {
    document.removeEventListener("click", handleClick, true);
  };
}
