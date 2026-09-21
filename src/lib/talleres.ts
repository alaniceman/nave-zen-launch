/**
 * Configuración client-side de los talleres Wim Hof (edición octubre 2026).
 * Debe mantenerse sincronizada con supabase/functions/_shared/talleres.ts.
 * Los precios mostrados son informativos: el servidor siempre resuelve el total.
 */
export type TallerKey = "fundamentos" | "avanzado";
export type SelKey = TallerKey | "pack";

export const TALLERES = {
  fundamentos: {
    nombre: "Taller Fundamentales Método Wim Hof",
    nombreCorto: "Fundamentales",
    fecha: "Sábado 3 de octubre",
    fechaLarga: "Sábado 3 de octubre de 2026",
    horario: "11:30 a 15:00",
    duracion: "3,5 horas",
    valor: 50000,
    valorTxt: "$50.000",
    cupos: 15,
    nivel: "Principiante / intermedio",
    eventId: "santiago_fundamentos_2026_10_03",
    isoStart: "2026-10-03T11:30:00-03:00",
    isoEnd: "2026-10-03T15:00:00-03:00",
  },
  avanzado: {
    nombre: "Taller Avanzado Método Wim Hof",
    nombreCorto: "Avanzado",
    fecha: "Domingo 4 de octubre",
    fechaLarga: "Domingo 4 de octubre de 2026",
    horario: "11:30 a 15:00",
    duracion: "3,5 horas",
    valor: 60000,
    valorTxt: "$60.000",
    cupos: 15,
    nivel: "Avanzado · requiere experiencia previa",
    eventId: "santiago_avanzado_2026_10_04",
    isoStart: "2026-10-04T11:30:00-03:00",
    isoEnd: "2026-10-04T15:00:00-03:00",
  },
} as const;

// Producto combinado. El precio real lo resuelve siempre el servidor.
export const PACK = {
  nombre: "Pack Talleres Wim Hof — Fundamentales + Avanzado",
  nombreCorto: "Experiencia completa",
  precio: 92000,
  precioTxt: "$92.000",
  precioNormal: 110000,
  precioNormalTxt: "$110.000",
  ahorro: 18000,
  ahorroTxt: "$18.000",
  avanzadoConDescuentoTxt: "$42.000",
  descuentoAvanzadoPct: 30,
};

export const PACK_PROGRESION =
  "No necesitas experiencia previa para elegir el pack. Fundamentales te entrega la base técnica para participar en Avanzado al día siguiente. El desafío avanzado no es una prueba de fuerza física: es principalmente mental y requiere foco y disposición a desafiarte. Al terminar Fundamentales estarás preparado para el Avanzado.";

export const TALLER_LANDING_PATH = "/taller-wim-hof-santiago-fundamentales-avanzado";
export const TALLER_MAX_QUANTITY = 20;

export const isSelKey = (v: unknown): v is SelKey =>
  v === "fundamentos" || v === "avanzado" || v === "pack";

export const clp = (n: number) => `$${n.toLocaleString("es-CL")}`;

export const contentIdsFor = (sel: SelKey): string[] =>
  sel === "pack"
    ? ["taller-whm-santiago-fundamentos", "taller-whm-santiago-avanzado"]
    : [`taller-whm-santiago-${sel}`];
