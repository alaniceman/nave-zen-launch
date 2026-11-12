import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BajaRecordatorios from "@/pages/BajaRecordatorios";

export const Route = createFileRoute("/baja-recordatorios")({
  head: () => routeHead("/baja-recordatorios"),
  component: BajaRecordatorios,
});
