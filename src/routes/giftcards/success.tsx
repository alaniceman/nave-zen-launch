import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import GiftCardsSuccess from "@/pages/GiftCardsSuccess";

export const Route = createFileRoute("/giftcards/success")({
  head: () => routeHead("/giftcards/success"),
  component: GiftCardsSuccess,
});
