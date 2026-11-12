import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import IcefestAccess from "@/pages/IcefestAccess";

export const Route = createFileRoute("/icefest-santiago/pending")({
  head: () => routeHead("/icefest-santiago/pending"),
  component: IcefestAccess,
});
