import { createFileRoute } from "@tanstack/react-router";
import { routeHead } from "@/lib/routeSeo";
import GiftCardsFailure from "@/pages/GiftCardsFailure";

export const Route = createFileRoute("/giftcards/failure")({
  head: () => routeHead("/giftcards/failure"),
  component: GiftCardsFailure,
});
