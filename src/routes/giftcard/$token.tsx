import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import GiftCardView from "@/pages/GiftCardView";

export const Route = createFileRoute("/giftcard/$token")({
  head: ({ params }) => routeHead(`/giftcard/${params.token}`),
  component: GiftCardView,
});
