import { createFileRoute } from "@tanstack/react-router";
import AdminBookings from "@/pages/admin/AdminBookings";

export const Route = createFileRoute("/admin/agenda")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminBookings,
});
