import { createFileRoute } from "@tanstack/react-router";
import AdminTrialBookings from "@/pages/admin/AdminTrialBookings";

export const Route = createFileRoute("/admin/clases-prueba")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminTrialBookings,
});
