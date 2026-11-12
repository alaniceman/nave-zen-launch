import { createFileRoute } from "@tanstack/react-router";
import AdminAvailability from "@/pages/admin/AdminAvailability";

export const Route = createFileRoute("/admin/disponibilidad")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminAvailability,
});
