import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cyber-nave-studio-paquetes")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
