import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/cyber-nave-studio-membresia-activos")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
