import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BlogHabitosDisciplina from "@/pages/BlogHabitosDisciplina";

export const Route = createFileRoute("/blog/habitos-disciplina-como-construirte-a-ti-mismo")({
  head: () => routeHead("/blog/habitos-disciplina-como-construirte-a-ti-mismo"),
  component: BlogHabitosDisciplina,
});
