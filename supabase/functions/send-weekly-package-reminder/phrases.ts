// Banco de frases de poder + asuntos para el recordatorio semanal.
// Rotan según el número de semana ISO, así nadie recibe la misma dos semanas seguidas.

export const POWER_PHRASES: Array<{ quote: string; support: string }> = [
  {
    quote: "El frío no te castiga. Te despierta.",
    support: "Cada inmersión es un recordatorio de que puedes sostener más de lo que crees.",
  },
  {
    quote: "Dos minutos de incomodidad, un día entero de claridad.",
    support: "Nada de lo que te espera hoy se siente difícil después del agua fría.",
  },
  {
    quote: "Tu mente se rinde mucho antes que tu cuerpo.",
    support: "El hielo te enseña a quedarte cuando todo te pide salir.",
  },
  {
    quote: "Respira. Entra. Quédate. Eso es todo.",
    support: "No hay técnica secreta: hay presencia, y se entrena.",
  },
  {
    quote: "La calma no se encuentra: se construye bajo presión.",
    support: "Y no hay mejor laboratorio que 3°C.",
  },
  {
    quote: "No entras al hielo para aguantar. Entras para regularte.",
    support: "La calidad de tu respiración vale más que los segundos en el reloj.",
  },
  {
    quote: "Hoy tu versión más fuerte está esperándote a 3°C.",
    support: "Solo tienes que llegar. El resto lo hace el agua.",
  },
  {
    quote: "El cuerpo se adapta. La mente se expande.",
    support: "Cada sesión mueve un poco más ese límite que creías fijo.",
  },
  {
    quote: "Lo que te incomoda hoy, mañana te sostiene.",
    support: "Constancia sobre intensidad: una sesión por semana cambia todo.",
  },
  {
    quote: "Ganas el día en los primeros 30 segundos.",
    support: "Después de eso, todo lo demás es fácil.",
  },
  {
    quote: "No es fuerza bruta. Es control.",
    support: "Respirar bien es la habilidad más útil que vas a aprender este año.",
  },
  {
    quote: "El agua fría no negocia. Y por eso funciona.",
    support: "Te devuelve al presente sin pedir permiso.",
  },
  {
    quote: "Tu sistema nervioso también entrena.",
    support: "Frío, respiración y foco: la combinación que baja el ruido de la cabeza.",
  },
  {
    quote: "Elige el hielo antes de que la semana te elija a ti.",
    support: "Agenda primero. La motivación llega después.",
  },
  {
    quote: "Sales del agua siendo otra persona. Literalmente.",
    support: "Energía, ánimo y foco por horas. Eso no se compra.",
  },
];

export const SUBJECTS: string[] = [
  "❄️ Tu semana empieza en el agua fría",
  "❄️ {remaining} {plural} esperándote esta semana",
  "❄️ Elige tu día: horarios de la semana en Nave Studio",
  "❄️ Dos minutos de frío, una semana distinta",
  "❄️ Tu recordatorio semanal: agenda tu sesión",
  "❄️ Esta semana toca hielo",
  "❄️ Ya tienes tus sesiones. Solo falta la fecha",
];

// ISO week number (1-53)
export function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function weekKey(date: Date): string {
  const week = isoWeekNumber(date);
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function pickPhrase(week: number) {
  return POWER_PHRASES[week % POWER_PHRASES.length];
}

export function pickSubject(week: number, remaining: number) {
  const raw = SUBJECTS[week % SUBJECTS.length];
  return raw
    .replace("{remaining}", String(remaining))
    .replace("{plural}", remaining === 1 ? "sesión" : "sesiones");
}
