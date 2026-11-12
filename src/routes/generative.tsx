import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import Generative from "@/pages/Generative";

export const Route = createFileRoute("/generative")({
  head: () => routeHead("/generative"),
  component: Generative,
});
