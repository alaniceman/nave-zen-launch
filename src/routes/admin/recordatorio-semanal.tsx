import { createFileRoute } from "@tanstack/react-router";
import AdminWeeklyReminder from "@/pages/admin/AdminWeeklyReminder";

export const Route = createFileRoute("/admin/recordatorio-semanal")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminWeeklyReminder,
});
