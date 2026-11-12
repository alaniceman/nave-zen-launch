import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Promo18Septiembre from "@/pages/Promo18Septiembre";

export const Route = createFileRoute("/promo-18-septiembre")({
  head: () => routeHead("/promo-18-septiembre"),
  component: Promo18Septiembre,
});
