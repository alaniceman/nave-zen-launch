import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import CriomedicinAdsLanding from "@/pages/CriomedicinAdsLanding";

export const Route = createFileRoute("/criomedicina-metodo-wim-hof-las-condes")({
  head: () => routeHead("/criomedicina-metodo-wim-hof-las-condes"),
  component: CriomedicinAdsLanding,
});
