import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import PromoTalleres from "@/pages/PromoTalleres";

export const Route = createFileRoute("/promo-talleres")({
  head: () => routeHead("/promo-talleres"),
  component: PromoTalleres,
});
