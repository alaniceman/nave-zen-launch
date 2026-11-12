import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Privacidad from "@/pages/Privacidad";

export const Route = createFileRoute("/privacidad")({
  head: () => routeHead("/privacidad"),
  component: Privacidad,
});
