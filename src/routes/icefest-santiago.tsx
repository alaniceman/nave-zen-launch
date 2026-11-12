import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import IcefestSantiago from "@/pages/IcefestSantiago";

export const Route = createFileRoute("/icefest-santiago")({
  head: () => routeHead("/icefest-santiago"),
  component: IcefestSantiago,
});
