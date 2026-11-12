import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import TallerCheckout from "@/pages/TallerCheckout";

export const Route = createFileRoute("/checkout")({
  head: () => routeHead("/checkout"),
  component: TallerCheckout,
});
