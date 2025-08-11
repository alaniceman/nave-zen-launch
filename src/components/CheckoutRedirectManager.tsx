import { useEffect } from "react";
import RedirectModal from "@/components/RedirectModal";
import { attachCheckoutRedirect } from "@/global/attachCheckout";
import { useCheckoutRedirect } from "@/hooks/useCheckoutRedirect";

// Mounts the redirect modal globally and wires delegated clicks to it
export function CheckoutRedirectManager() {
  const { isOpen, checkoutUrl, plan, start, cancel, onOpenChange } = useCheckoutRedirect();

  useEffect(() => {
    const detach = attachCheckoutRedirect(({ url, plan }) => {
      start(url, plan ?? undefined);
    });
    return detach;
  }, [start]);

  return (
    <RedirectModal
      isOpen={isOpen}
      onClose={cancel}
      checkoutUrl={checkoutUrl}
      plan={plan}
    />
  );
}

export default CheckoutRedirectManager;
