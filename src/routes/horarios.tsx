import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Horarios from "@/pages/Horarios";

export const Route = createFileRoute("/horarios")({
  head: () => routeHead("/horarios"),
  component: Horarios,
});
