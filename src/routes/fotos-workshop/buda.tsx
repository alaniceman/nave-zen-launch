import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import FotosWorkshopBuda from "@/pages/FotosWorkshopBuda";

export const Route = createFileRoute("/fotos-workshop/buda")({
  head: () => routeHead("/fotos-workshop/buda"),
  component: FotosWorkshopBuda,
});
