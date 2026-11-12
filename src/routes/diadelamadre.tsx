import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/diadelamadre")({
  beforeLoad: () => {
    throw redirect({ to: "/dia-de-la-madre", replace: true });
  },
});
