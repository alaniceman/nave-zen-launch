import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import CriomedicinMetodoWimHof from "@/pages/CriomedicinMetodoWimHof";

export const Route = createFileRoute("/criomedicina-metodo-wim-hof")({
  head: () => routeHead("/criomedicina-metodo-wim-hof"),
  component: CriomedicinMetodoWimHof,
});
