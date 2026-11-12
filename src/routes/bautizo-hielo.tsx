import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BautizoHielo from "@/pages/BautizoHielo";

export const Route = createFileRoute("/bautizo-hielo")({
  head: () => routeHead("/bautizo-hielo"),
  component: BautizoHielo,
});
