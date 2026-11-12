import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BlogWimHof from "@/pages/BlogWimHof";

export const Route = createFileRoute("/blog/metodo-wim-hof-respiracion-frio-mente")({
  head: () => routeHead("/blog/metodo-wim-hof-respiracion-frio-mente"),
  component: BlogWimHof,
});
