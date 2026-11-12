import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import IcefestBlog from "@/pages/IcefestBlog";

export const Route = createFileRoute("/icefest-santiago/blog")({
  head: () => routeHead("/icefest-santiago/blog"),
  component: IcefestBlog,
});
