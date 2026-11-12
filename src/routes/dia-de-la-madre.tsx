import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import DiaDeLaMadre from "@/pages/DiaDeLaMadre";

export const Route = createFileRoute("/dia-de-la-madre")({
  head: () => routeHead("/dia-de-la-madre"),
  component: DiaDeLaMadre,
});
