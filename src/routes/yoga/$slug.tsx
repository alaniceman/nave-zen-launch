import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import YogaStylePage from "@/pages/yoga/YogaStylePage";

export const Route = createFileRoute("/yoga/$slug")({
  head: ({ params }) => routeHead(`/yoga/${params.slug}`),
  component: YogaStylePage,
});
