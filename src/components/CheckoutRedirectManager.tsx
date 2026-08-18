import { useEffect } from "react";
import RedirectModal from "@/components/RedirectModal";
import { attachCheckoutRedirect } from "@/global/attachCheckout";
import { useCheckoutRedirect } from "@/hooks/useCheckoutRedirect";
import { trackMetaClientEvent } from "@/lib/metaTracking";

// Mounts the redirect modal globally and wires delegated clicks to it
export function CheckoutRedirectManager() {
  const { isOpen, checkoutUrl, plan, start, cancel, onOpenChange } = useCheckoutRedirect();

  useEffect(() => {
    const detach = attachCheckoutRedirect(({ url, plan, value, contentId, skipTracking }) => {
      // InitiateCheckout exactamente una vez, al activarse el redirect real.
      // Los flujos que ya lo emiten (formularios) marcan data-no-meta-track.
      if (!skipTracking) {
        const name = plan || "Checkout BoxMagic";
        // content_id semántico y estable cuando existe; la URL es el último recurso.
        const stableId = contentId || plan || url;
        trackMetaClientEvent("InitiateCheckout", {
          contentName: name,
          contentType: "product",
          contentCategory: "membership",
          contentIds: [stableId],
          numItems: 1,
          value,
          currency: "CLP",
          funnel: "membership",
          entityType: "membership_plan",
          entityId: stableId,
          pixelParams: {
            content_name: name,
            content_category: "membership",
            content_ids: [stableId],
            value,
            currency: "CLP",
          },
        });
      }
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
