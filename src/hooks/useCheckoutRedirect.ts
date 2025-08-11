import { useCallback, useEffect, useRef, useState } from "react";

export function useCheckoutRedirect() {
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const cleanupTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const cancel = useCallback(() => {
    cleanupTimer();
    if (isOpen) {
      try {
        // Optional analytics
        // @ts-expect-error - dataLayer might not exist
        window?.dataLayer?.push?.({ event: "checkout_redirect_cancelled", plan: plan ?? undefined });
      } catch {}
    }
    setIsOpen(false);
    setCheckoutUrl(null);
  }, [isOpen, plan]);

  const start = useCallback((url: string, planName?: string | null) => {
    cleanupTimer();
    setCheckoutUrl(url);
    setPlan(planName ?? null);
    setIsOpen(true);

    try {
      // Optional analytics
      // @ts-expect-error - dataLayer might not exist
      window?.dataLayer?.push?.({ event: "checkout_redirect_started", plan: planName });
    } catch {}

    timerRef.current = window.setTimeout(() => {
      // Proceed to navigate
      window.location.assign(url);
    }, 1200);
  }, []);

  useEffect(() => () => cleanupTimer(), []);

  return {
    isOpen,
    checkoutUrl,
    plan,
    start,
    cancel,
    onOpenChange: (open: boolean) => {
      if (!open) cancel();
    },
  };
}
