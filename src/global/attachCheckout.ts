import { toast } from "@/components/ui/use-toast";

export type CheckoutClickDetails = {
  url: string;
  plan?: string | null;
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

    onFound({ url, plan, element: el, event });
  };

  document.addEventListener("click", handleClick, true);

  return () => {
    document.removeEventListener("click", handleClick, true);
  };
}
