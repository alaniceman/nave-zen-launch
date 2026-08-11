/**
 * Fuente única de verdad de las landings por estilo de yoga (/yoga/*).
 *
 * Cada entrada alimenta: la ruta dinámica, el <Helmet>, el bloque de horarios
 * (que se filtra en vivo contra los servicios del admin), la prueba social
 * filtrada por instructora y el JSON-LD. Los horarios y las instructoras NO se
 * escriben aquí: se derivan de schedule_entries.
 */

export type YogaStyle = {
  /** Segmento de URL: /yoga/<slug> */
  slug: string;
  /** Nombre del estilo tal como se muestra al usuario */
  name: string;
  /** Frase corta bajo el H1 */
  tagline: string;
  /** Bajada larga: qué es el estilo */
  intro: string;
  /** 3 beneficios */
  benefits: string[];
  /** Subtítulo de la sección de beneficios */
  benefitsSubtitle: string;
  /** Para quién es */
  audience: string[];
  /** Título SEO (<60-65 chars ideal) */
  title: string;
  /** Meta description */
  description: string;
  /** Nombre exacto del servicio en el admin (match del horario propio) */
  serviceMatch: RegExp;
  /** Servicios relacionados que se muestran como "también te puede servir" */
  relatedMatch?: RegExp;
  /** Instructoras por defecto si aún no hay horarios cargados */
  fallbackCoachIds: string[];
  /** Artículo del blog relacionado */
  article?: { title: string; href: string };
  /** Preguntas frecuentes propias del estilo */
  faqs: { q: string; a: string }[];
};

export const YOGA_HERO_IMAGE = "/lovable-uploads/82672388-9723-4aee-a1f2-ac72618cd26a.png";
export const YOGA_OG_IMAGE = `https://studiolanave.com${YOGA_HERO_IMAGE}`;

const COMMON_FAQS: { q: string; a: string }[] = [
  {
    q: "¿Necesito experiencia previa?",
    a: "No. Cada clase incluye variaciones y progresiones, así que puedes entrar siendo principiante o con años de práctica. Si es tu primera vez, avísale a la instructora al llegar.",
  },
  {
    q: "¿Qué llevo a la clase?",
    a: "Ropa cómoda y una botella de agua. Los mats, cojines, bloques y mantas están disponibles sin costo. Te recomendamos llegar 10 minutos antes.",
  },
  {
    q: "¿Cuánto dura la clase?",
    a: "60 minutos. Las clases son presenciales en Antares 259, Las Condes, a pasos del Metro Los Domínicos.",
  },
  {
    q: "¿El Ice Bath es obligatorio?",
    a: "No, es totalmente opcional. Puedes venir solo a yoga. Si quieres complementar con hielo (3 °C), primero necesitas una sesión guiada de Método Wim Hof por seguridad.",
  },
];

export const yogaStyles: YogaStyle[] = [
  {
    slug: "yin-yoga-las-condes",
    name: "Yin Yoga",
    tagline: "Posturas pasivas, respiración profunda y calma activa",
    intro:
      "El Yin Yoga es una práctica pasiva donde las posturas se mantienen de 3 a 5 minutos, trabajando sobre tejido conectivo, articulaciones y fascia. A diferencia del yoga dinámico, aquí no buscamos generar calor muscular, sino soltar la tensión profunda que acumulamos por estrés, sedentarismo o sobreentrenamiento.",
    benefits: [
      "Flexibilidad profunda y movilidad articular",
      "Relajación del sistema nervioso",
      "Liberación de fascia y tensión acumulada",
    ],
    benefitsSubtitle: "Por qué incluirlo en tu rutina semanal",
    audience: [
      "Personas con mucho estrés o dificultad para desconectar",
      "Deportistas que necesitan recuperar y soltar tensión",
      "Quienes trabajan sentados muchas horas",
      "Principiantes que buscan una entrada suave al yoga",
    ],
    title: "Yin Yoga en Las Condes — Clases Presenciales | Nave Studio",
    description:
      "Clases presenciales de Yin Yoga en Las Condes, Santiago. Posturas pasivas para soltar tensión profunda y ganar flexibilidad. Horarios reales, 60 min, Antares 259. Plan de prueba $9.900.",
    serviceMatch: /^Yin Yoga$/i,
    relatedMatch: /Vinyasa \+ Yin/i,
    fallbackCoachIds: ["amanda", "maral"],
    article: {
      title: "Yin Yoga: beneficios para movilidad y flexibilidad",
      href: "/blog/yin-yoga-beneficios-movilidad-flexibilidad",
    },
    faqs: [
      {
        q: "¿En qué se diferencia el Yin de un yoga normal?",
        a: "En el Yin las posturas se sostienen entre 3 y 5 minutos y se trabaja con el músculo relajado. El objetivo es el tejido conectivo y la fascia, no la fuerza muscular.",
      },
      ...COMMON_FAQS,
    ],
  },
  {
    slug: "vinyasa-yoga-las-condes",
    name: "Vinyasa Yoga",
    tagline: "Flujo continuo entre postura y respiración",
    intro:
      "El Vinyasa Yoga conecta una postura con la siguiente a través del flujo y la respiración. Cada movimiento está sincronizado con una inhalación o exhalación, creando una meditación en movimiento que fortalece, moviliza y centra. En Nave Studio practicamos un Vinyasa creativo donde la técnica se une a la expresión personal.",
    benefits: [
      "Coordinación cuerpo-mente profunda",
      "Resistencia cardiovascular natural",
      "Creatividad y expresión en movimiento",
    ],
    benefitsSubtitle: "Por qué el flujo cambia tu energía",
    audience: [
      "Quienes buscan un yoga dinámico y fluido",
      "Personas que quieren quemar estrés con movimiento",
      "Practicantes que disfrutan la danza y la expresión corporal",
      "Cualquiera que quiera mejorar la respiración consciente",
    ],
    title: "Vinyasa Yoga en Las Condes — Clases Presenciales | Nave Studio",
    description:
      "Clases presenciales de Vinyasa Yoga en Las Condes, Santiago. Flujo continuo sincronizado con la respiración para fuerza, resistencia y claridad mental. Antares 259. Plan de prueba $9.900.",
    serviceMatch: /^Vinyasa Yoga$/i,
    relatedMatch: /Vinyasa \+ Yin|Vinyasa Som|Power Vinyasa/i,
    fallbackCoachIds: ["mar", "maral"],
    article: {
      title: "Vinyasa Yoga: el flujo entre respiración y movimiento",
      href: "/blog/vinyasa-yoga-flujo-respiracion-las-condes",
    },
    faqs: [
      {
        q: "¿El Vinyasa es muy exigente para empezar?",
        a: "Es dinámico, pero cada secuencia tiene opciones más suaves. Si vienes sin experiencia, la instructora te dará variaciones para seguir el ritmo sin forzar.",
      },
      ...COMMON_FAQS,
    ],
  },
  {
    slug: "power-yoga-las-condes",
    name: "Power Yoga",
    tagline: "Fuerza, resistencia y foco en cada clase",
    intro:
      "El Power Yoga lleva la energía del yoga a su máxima expresión física. Secuencias dinámicas con más repeticiones, sostenes más largos y transiciones exigentes que desarrollan fuerza, resistencia y estabilidad. Es yoga como entrenamiento: cada clase es un desafío que superas con la respiración como aliada.",
    benefits: [
      "Alta intensidad con técnica segura",
      "Tonificación muscular profunda",
      "Desafío físico y mental en cada clase",
    ],
    benefitsSubtitle: "Por qué el desafío transforma",
    audience: [
      "Quienes buscan un entrenamiento funcional dentro del yoga",
      "Personas con experiencia en fitness que quieren probar yoga intenso",
      "Practicantes de yoga que quieren llevar su límite más allá",
      "Cualquiera que quiera quemar estrés y ganar fuerza al mismo tiempo",
    ],
    title: "Power Yoga en Las Condes — Clases Presenciales | Nave Studio",
    description:
      "Clases presenciales de Power Yoga en Las Condes, Santiago. Yoga intenso para fuerza, resistencia muscular y foco mental. Horarios reales, 60 min, Antares 259. Plan de prueba $9.900.",
    serviceMatch: /^Power Yoga$/i,
    relatedMatch: /Power Vinyasa/i,
    fallbackCoachIds: ["maral", "amanda"],
    article: {
      title: "Power Yoga: construir fuerza y resistencia sobre el mat",
      href: "/blog/power-yoga-fuerza-resistencia",
    },
    faqs: [
      {
        q: "¿Sirve como entrenamiento de fuerza?",
        a: "Sí. Trabajas con tu propio peso en sostenes largos y transiciones exigentes, lo que desarrolla fuerza, estabilidad del core y resistencia muscular.",
      },
      ...COMMON_FAQS,
    ],
  },
  {
    slug: "integral-yoga-las-condes",
    name: "Yoga Integral",
    tagline: "Fuerza, flexibilidad y meditación en una sola práctica",
    intro:
      "El Yoga Integral integra las diferentes dimensiones del yoga en una sola sesión equilibrada: posturas de fuerza, secuencias de flexibilidad, ejercicios de respiración y momentos de meditación activa. Es la práctica ideal si quieres tocar todas las bases en una clase, sin perder profundidad en ninguna.",
    benefits: [
      "Equilibrio completo entre fuerza y flexibilidad",
      "Meditación activa integrada en el movimiento",
      "Adaptable a todos los niveles de experiencia",
    ],
    benefitsSubtitle: "Una práctica que lo abarca todo",
    audience: [
      "Quienes buscan una práctica de yoga completa sin especializarse",
      "Personas nuevas en yoga que quieren probar todo en una sola clase",
      "Practicantes que quieren complementar su disciplina principal",
      "Cualquiera que busque equilibrio físico y mental en una misma sesión",
    ],
    title: "Yoga Integral en Las Condes — Clases Presenciales | Nave Studio",
    description:
      "Clases presenciales de Yoga Integral en Las Condes, Santiago. Fuerza, flexibilidad, respiración y meditación en una práctica para todos los niveles. Antares 259. Plan de prueba $9.900.",
    serviceMatch: /^Yoga Integral$/i,
    relatedMatch: /Vinyasa \+ Yin/i,
    fallbackCoachIds: ["maral", "amanda"],
    article: {
      title: "Yoga Integral: equilibrio entre práctica física y meditación",
      href: "/blog/integral-yoga-equilibrio-meditacion",
    },
    faqs: [
      {
        q: "¿Es una buena primera clase de yoga?",
        a: "Sí. Es una de las opciones que más recomendamos para empezar, porque en 60 minutos conoces posturas, respiración y meditación con acompañamiento cercano.",
      },
      ...COMMON_FAQS,
    ],
  },
  {
    slug: "power-vinyasa-las-condes",
    name: "Power Vinyasa",
    tagline: "Fuerza, movilidad y conciencia corporal en movimiento",
    intro:
      "El Power Vinyasa es una práctica dinámica y energizante que combina el flujo del Vinyasa con el trabajo de fuerza del Power Yoga. Cada clase ofrece opciones y progresiones para adaptar las posturas a tu nivel, así ganas fuerza y movilidad sin perder el disfrute del proceso.",
    benefits: [
      "Fuerza y movilidad en la misma clase",
      "Progresiones adaptables a tu nivel",
      "Conciencia corporal y control del movimiento",
    ],
    benefitsSubtitle: "Intensidad con técnica y disfrute",
    audience: [
      "Quienes ya practican yoga y quieren subir la intensidad",
      "Personas que buscan fuerza sin renunciar al flujo",
      "Practicantes que quieren mejorar movilidad y control",
      "Cualquiera que disfrute clases dinámicas y bien guiadas",
    ],
    title: "Power Vinyasa en Las Condes — Clases Presenciales | Nave Studio",
    description:
      "Clases presenciales de Power Vinyasa en Las Condes, Santiago. Flujo dinámico con trabajo de fuerza, movilidad y progresiones para cada nivel. Antares 259. Plan de prueba $9.900.",
    serviceMatch: /^Power Vinyasa/i,
    relatedMatch: /^Power Yoga$|^Vinyasa Yoga$/i,
    fallbackCoachIds: ["karim"],
    faqs: [
      {
        q: "¿Cuál es la diferencia con el Vinyasa clásico?",
        a: "El Power Vinyasa mantiene el flujo con la respiración, pero agrega sostenes y transiciones de fuerza. Es más exigente físicamente y siempre con progresiones.",
      },
      ...COMMON_FAQS,
    ],
  },
  {
    slug: "vinyasa-somatico-las-condes",
    name: "Vinyasa Somático",
    tagline: "Movimiento, respiración y quietud para regular tu sistema nervioso",
    intro:
      "El Vinyasa Somático regula tu sistema nervioso a través del flujo de movimiento, respiración, vibración y quietud. Es una invitación a habitar tu cuerpo y soltar lo rígido: menos exigencia sobre la forma exacta de la postura y más escucha de lo que tu cuerpo necesita ese día.",
    benefits: [
      "Regulación del sistema nervioso",
      "Soltar tensión profunda y rigidez",
      "Conexión cuerpo-mente y presencia",
    ],
    benefitsSubtitle: "Cuando tu cuerpo necesita escucha, no exigencia",
    audience: [
      "Personas con estrés crónico o sistema nervioso acelerado",
      "Quienes quieren un yoga más suave y consciente",
      "Practicantes que buscan reconectar con la sensación corporal",
      "Cualquiera que venga de un período de sobrecarga",
    ],
    title: "Vinyasa Somático en Las Condes — Clases Presenciales | Nave Studio",
    description:
      "Clases presenciales de Vinyasa Somático en Las Condes, Santiago. Movimiento, respiración y quietud para regular el sistema nervioso y soltar tensión. Antares 259. Plan de prueba $9.900.",
    serviceMatch: /^Vinyasa Som/i,
    relatedMatch: /^Yin Yoga$|^Vinyasa Yoga$/i,
    fallbackCoachIds: ["amanda"],
    faqs: [
      {
        q: "¿Qué significa que sea 'somático'?",
        a: "Que el foco está en la sensación interna del movimiento más que en la forma exacta de la postura. Se trabaja con movimientos suaves, respiración y pausas para regular el sistema nervioso.",
      },
      ...COMMON_FAQS,
    ],
  },
];

export const getYogaStyle = (slug?: string) =>
  yogaStyles.find((s) => s.slug === slug);

/** Otros estilos, para el bloque de enlaces internos */
export const otherYogaStyles = (slug: string) =>
  yogaStyles.filter((s) => s.slug !== slug);
