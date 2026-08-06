import type { Review } from "@/data/reviews";

/**
 * Testimonios reales de participantes del Taller Wim Hof (Santiago).
 * Se usan ÚNICAMENTE en /taller-wim-hof-santiago-fundamentales-avanzado.
 */
export const tallerWimHofReviews: Review[] = [
  {
    id: 9001,
    category: "Hielo",
    text: "Me puse frente a una situación incómoda dentro del hielo y comprendí por qué estaba ahí. Conocí el hielo como medicina.",
    author: "Participante Taller Wim Hof",
  },
  {
    id: 9002,
    category: "Experiencia",
    text: "Lo que más me gustó fue el respeto, los aprendizajes y la manera en que fuimos acompañados durante toda la experiencia.",
    author: "Participante Taller Wim Hof",
  },
  {
    id: 9003,
    category: "Comunidad",
    text: "La conexión con las experiencias de los demás, el contenido del taller y la cercanía de Alan y Ámbar con cada integrante generaron una calidez humana que no se encuentra en cualquier lugar.",
    author: "Participante Taller Wim Hof",
  },
  {
    id: 9004,
    category: "Respiración",
    text: "Lo que más me motivó fue la respiración Wim Hof. Fue una experiencia profunda, guiada y muy bien acompañada.",
    author: "Participante Taller Wim Hof",
  },
  {
    id: 9005,
    category: "Experiencia",
    text: "Lo que más valoré fue la guía constante de Alan. En todo momento me sentí acompañado, contenido y seguro.",
    author: "Participante Taller Wim Hof",
  },
  {
    id: 9006,
    category: "Experiencia",
    text: "Alan no enseña solo desde la teoría, sino desde la experiencia, la práctica constante y un genuino deseo de aportar valor a los demás.",
    author: "Participante Taller Wim Hof",
  },
  {
    id: 9007,
    category: "Experiencia",
    text: "Más que asistir a un workshop, sentí que viví una experiencia cuidadosamente diseñada, con propósito, profundidad y mucho corazón.",
    author: "Participante Taller Wim Hof",
  },
  {
    id: 9008,
    category: "Comunidad",
    text: "Escuchar las experiencias de otros participantes y compartir las prácticas en comunidad hizo que todo se sintiera mucho más profundo.",
    author: "Participante Taller Wim Hof",
  },
  {
    id: 9009,
    category: "Lugar",
    text: "El espacio fue perfecto para la experiencia: cómodo, limpio, cálido y con todos los detalles pensados para generar tranquilidad y presencia.",
    author: "Participante Taller Wim Hof",
  },
  {
    id: 9010,
    category: "Lugar",
    text: "Me gustó mucho Nave Studio. Es un lugar cómodo, acogedor y completamente acorde con el tipo de experiencia que vivimos.",
    author: "Participante Taller Wim Hof",
  },
  {
    id: 9011,
    category: "Experiencia",
    text: "Todo estuvo muy bien organizado. Se disfrutó mucho y me sentí conectado y contenido durante toda la jornada.",
    author: "Participante Taller Wim Hof",
  },
  {
    id: 9012,
    category: "Hielo",
    text: "El hielo no fue solamente una situación incómoda. Fue un espacio para observarme, conectar con mi respiración y comprender por qué estaba ahí.",
    author: "Participante Taller Wim Hof",
  },
];

export const tallerWimHofReviewFilters = [
  "Respiración",
  "Hielo",
  "Comunidad",
  "Experiencia",
  "Lugar",
] as const;
