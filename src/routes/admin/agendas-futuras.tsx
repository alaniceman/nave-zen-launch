import { createFileRoute } from "@tanstack/react-router";
import AdminFutureSlots from "@/pages/admin/AdminFutureSlots";

export const Route = createFileRoute("/admin/agendas-futuras")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminFutureSlots,
});
