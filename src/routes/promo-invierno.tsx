import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import PromoInvierno from "@/pages/PromoInvierno";

export const Route = createFileRoute("/promo-invierno")({
  head: () => routeHead("/promo-invierno"),
  component: PromoInvierno,
});
