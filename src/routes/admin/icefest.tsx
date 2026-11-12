import { createFileRoute } from "@tanstack/react-router";
import AdminIcefest from "@/pages/admin/AdminIcefest";

export const Route = createFileRoute("/admin/icefest")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminIcefest,
});
