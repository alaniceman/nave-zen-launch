import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import IcefestBlog from "@/pages/IcefestBlog";

export const Route = createFileRoute("/icefest-santiago/blog/$slug")({
  head: ({ params }) => routeHead(`/icefest-santiago/blog/${params.slug}`),
  component: IcefestBlog,
});
