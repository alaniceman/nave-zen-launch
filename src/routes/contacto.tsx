import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Contacto from "@/pages/Contacto";

export const Route = createFileRoute("/contacto")({
  head: () => routeHead("/contacto"),
  component: Contacto,
});
