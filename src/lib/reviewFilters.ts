import { reviews as allReviews, type Review } from "@/data/reviews";
import { coaches } from "@/data/coaches";

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

/** Alias de nombres que aparecen en las reseñas y apuntan al mismo coach */
const REVIEW_NAME_ALIASES: Record<string, string> = {
  mariela: "mar",
  ambar: "amber",
};

/** "Alumna de Maral" -> "maral" */
export function coachIdFromReviewAuthor(author: string): string | null {
  const match = /^alumn[oa] de\s+(.+)$/i.exec(normalize(author));
  if (!match) return null;
  const firstName = normalize(match[1]).split(" ")[0];
  if (REVIEW_NAME_ALIASES[firstName]) return REVIEW_NAME_ALIASES[firstName];
  const coach = coaches.find((c) => normalize(c.name).split(" ")[0] === firstName);
  return coach ? coach.id : null;
}

/**
 * Reseñas de yoga escritas por alumnas de las instructoras dadas.
 * Si no hay suficientes, completa con reseñas generales de yoga para que la
 * franja de prueba social nunca quede vacía.
 */
export function yogaReviewsForCoaches(
  coachIds: string[],
  min = 3
): { items: Review[]; matched: number; total: number } {
  const yoga = allReviews.filter((r) => r.category === "Yoga");
  const matched = yoga.filter((r) => {
    const id = coachIdFromReviewAuthor(r.author);
    return id ? coachIds.includes(id) : false;
  });
  if (matched.length >= min) {
    return { items: matched, matched: matched.length, total: yoga.length };
  }
  const rest = yoga.filter((r) => !matched.includes(r));
  return {
    items: [...matched, ...rest.slice(0, min - matched.length)],
    matched: matched.length,
    total: yoga.length,
  };
}
