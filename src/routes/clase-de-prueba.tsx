import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/clase-de-prueba")({
  beforeLoad: () => {
    throw redirect({ to: "/plan-de-prueba", replace: true });
  },
});
