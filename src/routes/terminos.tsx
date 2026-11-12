import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Terminos from "@/pages/Terminos";

export const Route = createFileRoute("/terminos")({
  head: () => routeHead("/terminos"),
  component: Terminos,
});
