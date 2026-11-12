import { createFileRoute } from "@tanstack/react-router";
import AdminCyberStock from "@/pages/admin/AdminCyberStock";

export const Route = createFileRoute("/admin/cyber-cupos")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminCyberStock,
});
