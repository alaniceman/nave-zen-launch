import { createFileRoute } from "@tanstack/react-router";
import AdminScheduleEntries from "@/pages/admin/AdminScheduleEntries";

export const Route = createFileRoute("/admin/horarios")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminScheduleEntries,
});
