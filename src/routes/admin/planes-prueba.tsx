import { createFileRoute } from "@tanstack/react-router";
import AdminPlanesPrueba from "@/pages/admin/AdminPlanesPrueba";

export const Route = createFileRoute("/admin/planes-prueba")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminPlanesPrueba,
});
