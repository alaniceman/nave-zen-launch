import { createFileRoute } from "@tanstack/react-router";
import AdminTallerInscripciones from "@/pages/admin/AdminTallerInscripciones";

export const Route = createFileRoute("/admin/talleres-inscripciones")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminTallerInscripciones,
});
