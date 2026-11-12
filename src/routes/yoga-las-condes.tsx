import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import YogaLasCondes from "@/pages/YogaLasCondes";

export const Route = createFileRoute("/yoga-las-condes")({
  head: () => routeHead("/yoga-las-condes"),
  component: YogaLasCondes,
});
