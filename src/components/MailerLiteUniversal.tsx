import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Loads the MailerLite Universal JavaScript snippet globally.
 * Fetches the account ID from the integrations_mailerlite config table.
 * Required for campaign attribution on purchases.
 */
export function MailerLiteUniversal() {
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      const { data } = await supabase
        .from("integrations_mailerlite")
        .select("mailerlite_account_id")
        .eq("is_active", true)
        .maybeSingle();

      if (data?.mailerlite_account_id) {
        setAccountId(data.mailerlite_account_id);
      }
    }

    fetchConfig();
  }, []);

  useEffect(() => {
    if (!accountId) return;

    // Check if already loaded
    if ((window as any).ml) {
      (window as any).ml("account", accountId);
      return;
    }

    // MailerLite Universal JS snippet
    (function (
      w: any,
      d: Document,
      e: string,
      u: string,
      f: string,
      l?: HTMLScriptElement,
      n?: Element
    ) {
      w[f] =
        w[f] ||
        function () {
          (w[f].q = w[f].q || []).push(arguments);
        };
      l = d.createElement(e) as HTMLScriptElement;
      l.async = true;
      l.src = u;
      n = d.getElementsByTagName(e)[0];
      n?.parentNode?.insertBefore(l, n);
    })(
      window,
      document,
      "script",
      "https://assets.mailerlite.com/js/universal.js",
      "ml"
    );

    (window as any).ml("account", accountId);
  }, [accountId]);

  return null;
}
