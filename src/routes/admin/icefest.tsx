import { createFileRoute } from "@tanstack/react-router";
import AdminIcefest from "@/pages/admin/AdminIcefest";

export const Route = createFileRoute("/admin/icefest")({
  head: () => ({ meta: [{ title: "Ventas y entradas Icefest | Nave Studio" }, { name: "description", content: "Administración de ventas, entradas y origen de pedidos Icefest Santiago." }, { property: "og:title", content: "Ventas y entradas Icefest | Nave Studio" }, { property: "og:description", content: "Administración de ventas, entradas y origen de pedidos Icefest Santiago." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminIcefest,
});
