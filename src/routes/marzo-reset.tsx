import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import MarzoReset from "@/pages/MarzoReset";

export const Route = createFileRoute("/marzo-reset")({
  head: () => routeHead("/marzo-reset"),
  component: MarzoReset,
});
