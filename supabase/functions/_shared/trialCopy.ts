// Day-by-day copy for Plan de Prueba daily reminder emails.
// Two sequences: 7 days and 15 days. Selected by dayNumber (the day being shown).

export type TrialCta = "reserve" | "convert";

export interface TrialCopy {
  subject: string;
  preview: string;
  // HTML body copy (paragraphs). Rendered between greeting and classes block.
  bodyHtml: string;
  cta: TrialCta;
}

function p(html: string): string {
  return `<p style="margin:0 0 16px;color:#2A2A2A;font-size:15px;line-height:1.7">${html}</p>`;
}

const SEQ_7: Record<number, (v: Vars) => TrialCopy> = {
  1: (v) => ({
    subject: `${v.firstName}, mañana comienza tu Plan de Prueba en Nave ❄️`,
    preview: "Revisa los horarios y deja reservadas tus primeras clases.",
    bodyHtml:
      p("¡Mañana comienza tu Plan de Prueba de 7 días!") +
      p("Para aprovecharlo de verdad, te recomendamos entrar hoy a BoxMagic y dejar reservadas tus primeras dos clases.") +
      p("Tu desafío para esta semana es simple: realizar al menos cuatro visitas y descubrir qué prácticas funcionan mejor para ti."),
    cta: "reserve",
  }),
  2: () => ({
    subject: "Nave Studio — Día 2: construyamos continuidad",
    preview: "Revisa las clases de mañana y reserva tu próximo horario.",
    bodyHtml:
      p("El cambio no ocurre en una sola clase, sino cuando vuelves.") +
      p("Si todavía tienes una sola reserva, este es un buen momento para organizar las siguientes. Tenerlas agendadas desde ahora hace mucho más fácil completar tu experiencia."),
    cta: "reserve",
  }),
  3: () => ({
    subject: "Nave Studio — Día 3: prueba algo diferente",
    preview: "Yoga, respiración o agua fría: explora tu próxima práctica.",
    bodyHtml:
      p("Durante tu Plan de Prueba puedes explorar las distintas experiencias de Nave.") +
      p("Si hasta ahora sólo has practicado Yoga, puedes probar respiración o Método Wim Hof. Si has venido principalmente al agua fría, una clase de Yoga puede ayudarte a descubrir otra forma de regular tu cuerpo y tu mente."),
    cta: "reserve",
  }),
  4: (v) => ({
    subject: "Nave Studio — ¿Ya tienes cuatro visitas reservadas?",
    preview: "Quienes más aprovechan su prueba suelen dejar sus clases agendadas.",
    bodyHtml:
      p("Ya estás llegando a la mitad de tu Plan de Prueba.") +
      p("La mejor manera de evaluar si Nave puede formar parte de tu rutina es vivir la experiencia varias veces. Intenta completar al menos cuatro visitas antes de terminar tu plan.") +
      (v.completedReservations != null
        ? p(`<strong>${v.completedReservations}</strong> reservas realizadas hasta ahora.`)
        : ""),
    cta: "reserve",
  }),
  5: () => ({
    subject: "Nave Studio — ¿Qué práctica te ha hecho mejor?",
    preview: "Observa qué experiencia quieres incorporar a tu semana.",
    bodyHtml:
      p("Tu Plan de Prueba entra en su etapa final.") +
      p("Piensa en cómo te has sentido después de cada experiencia: con más calma, energía, claridad o conexión con tu cuerpo.") +
      p("Eso puede ayudarte a elegir la práctica y frecuencia que quieres mantener después de tu prueba."),
    cta: "reserve",
  }),
  6: (v) => ({
    subject: `${v.firstName}, mañana es tu penúltimo día en Nave`,
    preview: "Reserva tu próxima clase y comienza a pensar cómo quieres continuar.",
    bodyHtml:
      p("Te queda poco tiempo para seguir explorando tu Plan de Prueba.") +
      p("Reserva la clase que todavía quieras conocer. Si ya encontraste tus favoritas, piensa cuántas veces por semana te gustaría mantener esta práctica.") +
      p("Podemos ayudarte a elegir una membresía o pack según lo que realmente utilizaste."),
    cta: "convert",
  }),
  7: (v) => ({
    subject: `${v.firstName}, hoy completas tu Plan de Prueba`,
    preview: "Conversemos para encontrar la mejor forma de continuar.",
    bodyHtml:
      p("Hoy completas tu Plan de Prueba en Nave Studio.") +
      p("Esperamos que estos días te hayan ayudado a descubrir qué tipo de práctica y frecuencia te hacen mejor.") +
      p("No necesitas elegir el plan más grande, sino el que puedas sostener:") +
      `<ul style="margin:0 0 16px 20px;padding:0;color:#2A2A2A;font-size:15px;line-height:1.7">
        <li>Si preferiste Yoga, podemos recomendarte una membresía según tu frecuencia.</li>
        <li>Si preferiste Método Wim Hof, también tenemos packs de sesiones.</li>
        <li>Si disfrutaste ambas experiencias, podemos ayudarte a elegir un plan combinado.</li>
      </ul>` +
      p("Responde este correo o escríbenos por WhatsApp y te recomendaremos personalmente la mejor alternativa para continuar."),
    cta: "convert",
  }),
};

const SEQ_15: Record<number, (v: Vars) => TrialCopy> = {
  1: (v) => ({
    subject: `${v.firstName}, mañana comienza tu Plan de Prueba en Nave ❄️`,
    preview: "Revisa los horarios y deja reservadas tus primeras clases.",
    bodyHtml:
      p("¡Mañana comienza tu Plan de Prueba de 15 días!") +
      p("Para aprovecharlo de verdad, entra hoy a BoxMagic y deja reservadas tus primeras dos clases.") +
      p("Durante estos días podrás explorar diferentes prácticas y descubrir cuáles quieres incorporar a tu rutina."),
    cta: "reserve",
  }),
  2: () => ({
    subject: "Nave Studio — Tu segunda oportunidad para practicar",
    preview: "Revisa las clases de mañana y reserva tu próximo horario.",
    bodyHtml:
      p("La primera clase te permite conocer la experiencia. Volver es lo que te permite comenzar a sentir el proceso.") +
      p("Revisa los horarios de mañana y deja agendada tu próxima visita."),
    cta: "reserve",
  }),
  3: (v) => ({
    subject: `${v.firstName}, organiza tus próximas clases en Nave`,
    preview: "Reservar con anticipación te ayudará a aprovechar los 15 días.",
    bodyHtml:
      p("No esperes hasta el final para decidir cuándo volver.") +
      p("Entra a BoxMagic y deja reservadas las clases que quieres realizar durante los próximos días. Te recomendamos probar al menos cuatro experiencias durante tu plan."),
    cta: "reserve",
  }),
  4: () => ({
    subject: "Nave Studio — Prueba una experiencia diferente",
    preview: "Descubre Yoga, respiración y exposición guiada al frío.",
    bodyHtml:
      p("Tu Plan de Prueba está diseñado para que conozcas Nave de manera completa.") +
      p("Si has practicado principalmente Yoga, puedes explorar respiración o Método Wim Hof. Si viniste por el agua fría, prueba también una clase de Yoga y observa cómo cambia tu experiencia."),
    cta: "reserve",
  }),
  5: () => ({
    subject: "Nave Studio — La frecuencia cambia la experiencia",
    preview: "Revisa las clases disponibles y reserva tu próxima visita.",
    bodyHtml:
      p("Una sesión puede hacerte sentir bien. Varias sesiones te permiten descubrir qué sucede cuando la práctica empieza a formar parte de tu semana.") +
      p("Sigue construyendo continuidad y reserva tu próxima clase."),
    cta: "reserve",
  }),
  6: (v) => ({
    subject: `${v.firstName}, ¿qué cambios has notado hasta ahora?`,
    preview: "Observa cómo responde tu cuerpo después de cada práctica.",
    bodyHtml:
      p("Haz una pausa y observa cómo te has sentido después de tus clases.") +
      p("¿Más calma? ¿Más energía? ¿Mejor descanso? ¿Mayor conexión con tu cuerpo?") +
      p("Reconocer esos cambios te ayudará a identificar la práctica que más sentido tiene para ti."),
    cta: "reserve",
  }),
  7: (v) => ({
    subject: "Nave Studio — ¿Ya completaste cuatro visitas?",
    preview: "Aún tienes tiempo para aprovechar tu Plan de Prueba.",
    bodyHtml:
      p("Estás acercándote a la mitad de tu Plan de Prueba.") +
      p("Nuestra recomendación es completar al menos cuatro visitas para evaluar Nave desde la experiencia y no desde una sola clase.") +
      (v.completedReservations != null
        ? p(`<strong>${v.completedReservations}</strong> reservas realizadas hasta ahora.`)
        : ""),
    cta: "reserve",
  }),
  8: (v) => ({
    subject: `${v.firstName}, llegaste a la mitad de tu Plan de Prueba`,
    preview: "Este es un buen momento para organizar la segunda mitad.",
    bodyHtml:
      p("Ya recorriste la primera mitad de tu Plan de Prueba.") +
      p("Ahora puedes usar lo que descubriste para elegir mejor tus próximas clases: repetir tus favoritas o explorar algo que todavía no hayas probado.") +
      p("Entra a BoxMagic y organiza la segunda mitad de tu experiencia."),
    cta: "reserve",
  }),
  9: () => ({
    subject: "Nave Studio — Repite la práctica que más te gustó",
    preview: "Volver a una clase permite vivirla de una manera diferente.",
    bodyHtml:
      p("Hoy te invitamos a repetir la experiencia que más te haya gustado.") +
      p("La segunda o tercera vez suele sentirse diferente: conoces mejor la práctica, disminuye la incertidumbre y puedes observar con mayor claridad cómo responde tu cuerpo."),
    cta: "reserve",
  }),
  10: (v) => ({
    subject: `${v.firstName}, ¿en qué horario cabría Nave en tu semana?`,
    preview: "Empieza a imaginar una rutina que puedas sostener.",
    bodyHtml:
      p("Más que encontrar tiempo, se trata de elegir un horario que puedas sostener.") +
      p("Piensa qué clase, día y hora encajan naturalmente en tu semana. Esa respuesta te ayudará a elegir cómo continuar después de la prueba."),
    cta: "reserve",
  }),
  11: () => ({
    subject: "Nave Studio — Yoga, Wim Hof o una combinación",
    preview: "Tu comportamiento durante la prueba puede mostrarte qué elegir.",
    bodyHtml:
      p("Después de varias experiencias, probablemente ya tengas una preferencia:") +
      `<ul style="margin:0 0 16px 20px;padding:0;color:#2A2A2A;font-size:15px;line-height:1.7">
        <li>Yoga para movilidad, fuerza, presencia y regulación.</li>
        <li>Método Wim Hof para respiración, exposición al frío y resiliencia.</li>
        <li>Una combinación para una práctica más completa.</li>
      </ul>` +
      p("No existe una opción correcta para todos. La mejor es la que realmente quieras mantener."),
    cta: "reserve",
  }),
  12: (v) => ({
    subject: `${v.firstName}, ¿cuántas veces por semana quieres continuar?`,
    preview: "Tu frecuencia ideal nos ayuda a recomendarte el plan correcto.",
    bodyHtml:
      p("Piensa en una frecuencia realista para continuar:") +
      `<ul style="margin:0 0 16px 20px;padding:0;color:#2A2A2A;font-size:15px;line-height:1.7">
        <li>Una vez por semana para crear constancia.</li>
        <li>Dos veces por semana para profundizar.</li>
        <li>Acceso ilimitado para integrar Nave a tu rutina.</li>
      </ul>` +
      p("Si prefieres venir ocasionalmente a Método Wim Hof, también podemos recomendarte un pack de sesiones."),
    cta: "reserve",
  }),
  13: (v) => ({
    subject: `Nave Studio — Te quedan ${v.remainingDays} días de prueba`,
    preview: "Reserva las experiencias que todavía quieras conocer.",
    bodyHtml:
      p("Tu Plan de Prueba está llegando a su etapa final.") +
      p("Este es el momento de reservar las prácticas que todavía quieras conocer o repetir tu clase favorita antes de decidir cómo continuar."),
    cta: "reserve",
  }),
  14: (v) => ({
    subject: `${v.firstName}, mañana es tu último día de prueba`,
    preview: "Aprovecha tu última jornada y conversemos sobre cómo continuar.",
    bodyHtml:
      p("Mañana es el último día de tu Plan de Prueba.") +
      p("Si Nave te hizo bien, queremos ayudarte a encontrar una forma realista de mantener la práctica. Podemos recomendarte una membresía o pack según las clases que elegiste y la frecuencia con la que asististe."),
    cta: "convert",
  }),
  15: (v) => ({
    subject: `${v.firstName}, hoy completas tu Plan de Prueba`,
    preview: "Descubre la alternativa más adecuada para continuar en Nave.",
    bodyHtml:
      p("Hoy completas tus 15 días de prueba en Nave Studio.") +
      p("Esperamos que este tiempo te haya permitido experimentar, repetir y descubrir qué prácticas quieres mantener.") +
      p("Para continuar:") +
      `<ul style="margin:0 0 16px 20px;padding:0;color:#2A2A2A;font-size:15px;line-height:1.7">
        <li>Si preferiste Yoga, podemos recomendarte una membresía según tu frecuencia.</li>
        <li>Si preferiste Método Wim Hof, tenemos packs de sesiones.</li>
        <li>Si disfrutaste ambas experiencias, podemos ayudarte a elegir un plan combinado.</li>
      </ul>` +
      p("Responde este correo o escríbenos por WhatsApp. Revisaremos tu experiencia y te recomendaremos personalmente la alternativa más adecuada."),
    cta: "convert",
  }),
};

export interface Vars {
  firstName: string;
  dayNumber: number;
  totalDays: number;
  remainingDays: number;
  completedReservations?: number | null;
}

export function getTrialCopy(v: Vars): TrialCopy {
  const seq = v.totalDays === 15 ? SEQ_15 : SEQ_7;
  const day = Math.min(Math.max(v.dayNumber, 1), v.totalDays);
  const fn = seq[day] || seq[v.totalDays];
  return fn(v);
}
