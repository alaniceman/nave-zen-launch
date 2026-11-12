import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import FAQ from "@/pages/FAQ";

export const Route = createFileRoute("/faq")({
  head: () => routeHead("/faq"),
  component: FAQ,
});
