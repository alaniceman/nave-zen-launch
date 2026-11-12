import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import ReglasNaveStudio from "@/pages/ReglasNaveStudio";

export const Route = createFileRoute("/reglas-nave-studio")({
  head: () => routeHead("/reglas-nave-studio"),
  component: ReglasNaveStudio,
});
