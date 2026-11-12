import { createFileRoute } from "@tanstack/react-router";
import AdminSessionPackages from "@/pages/admin/AdminSessionPackages";

export const Route = createFileRoute("/admin/paquetes-sesiones")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminSessionPackages,
});
