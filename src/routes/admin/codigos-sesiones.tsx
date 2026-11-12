import { createFileRoute } from "@tanstack/react-router";
import AdminSessionCodes from "@/pages/admin/AdminSessionCodes";

export const Route = createFileRoute("/admin/codigos-sesiones")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminSessionCodes,
});
