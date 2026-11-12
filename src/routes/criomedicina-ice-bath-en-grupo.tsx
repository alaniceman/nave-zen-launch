import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import CriomedicinIceBathEnGrupo from "@/pages/CriomedicinIceBathEnGrupo";

export const Route = createFileRoute("/criomedicina-ice-bath-en-grupo")({
  head: () => routeHead("/criomedicina-ice-bath-en-grupo"),
  component: CriomedicinIceBathEnGrupo,
});
