import { createFileRoute } from "@tanstack/react-router";
import AdminProfessionals from "@/pages/admin/AdminProfessionals";

export const Route = createFileRoute("/admin/profesionales")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminProfessionals,
});
