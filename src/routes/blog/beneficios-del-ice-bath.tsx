import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BlogBeneficiosIceBath from "@/pages/BlogBeneficiosIceBath";

export const Route = createFileRoute("/blog/beneficios-del-ice-bath")({
  head: () => routeHead("/blog/beneficios-del-ice-bath"),
  component: BlogBeneficiosIceBath,
});
