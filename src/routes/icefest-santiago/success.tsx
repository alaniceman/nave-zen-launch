import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import IcefestAccess from "@/pages/IcefestAccess";

export const Route = createFileRoute("/icefest-santiago/success")({
  head: () => routeHead("/icefest-santiago/success"),
  component: IcefestAccess,
});
