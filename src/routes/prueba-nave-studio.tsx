import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/prueba-nave-studio")({
  beforeLoad: () => {
    throw redirect({ to: "/plan-de-prueba", replace: true });
  },
});
