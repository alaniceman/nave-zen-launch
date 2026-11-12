import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import InstructorProfile from "@/pages/InstructorProfile";

export const Route = createFileRoute("/instructor/$slug")({
  head: ({ params }) => routeHead(`/instructor/${params.slug}`),
  component: InstructorProfile,
});
