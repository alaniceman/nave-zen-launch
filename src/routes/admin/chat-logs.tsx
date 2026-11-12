import { createFileRoute } from "@tanstack/react-router";
import AdminChatLogs from "@/pages/admin/AdminChatLogs";

export const Route = createFileRoute("/admin/chat-logs")({
  head: () => ({ meta: [{ title: "Admin | Nave Studio" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminChatLogs,
});
