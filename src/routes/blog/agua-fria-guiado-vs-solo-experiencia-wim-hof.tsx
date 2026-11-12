import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import BlogAguaFriaGuiado from "@/pages/BlogAguaFriaGuiado";

export const Route = createFileRoute("/blog/agua-fria-guiado-vs-solo-experiencia-wim-hof")({
  head: () => routeHead("/blog/agua-fria-guiado-vs-solo-experiencia-wim-hof"),
  component: BlogAguaFriaGuiado,
});
