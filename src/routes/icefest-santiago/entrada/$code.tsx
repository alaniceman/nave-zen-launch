import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import IcefestAccess from "@/pages/IcefestAccess";

export const Route = createFileRoute("/icefest-santiago/entrada/$code")({
  head: ({ params }) => routeHead(`/icefest-santiago/entrada/${params.code}`),
  component: IcefestAccess,
});
