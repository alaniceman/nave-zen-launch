import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import TalleresRetirosCorreos from "@/pages/TalleresRetirosCorreos";

export const Route = createFileRoute("/talleres-retiros-correos")({
  head: () => routeHead("/talleres-retiros-correos"),
  component: TalleresRetirosCorreos,
});
