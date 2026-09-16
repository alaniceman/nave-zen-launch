export type TallerKey = "fundamentos" | "avanzado";

// Edición octubre 2026. Horarios en America/Santiago (UTC-03 en esas fechas).
export const TALLERES = {
  fundamentos: {
    nombre: "Taller Fundamentales Método Wim Hof",
    nombreCorto: "Fundamentales",
    fechaISO: "2026-10-03",
    fechaLarga: "Sábado 3 de octubre de 2026",
    horario: "11:30 a 15:00",
    duracion: "3,5 horas",
    valor: 50000,
    eventId: "santiago_fundamentos_2026_10_03",
    // Día siguiente al taller: envío del agradecimiento/encuesta
    thankYouDateISO: "2026-10-04",
  },
  avanzado: {
    nombre: "Taller Avanzado Método Wim Hof",
    nombreCorto: "Avanzado",
    fechaISO: "2026-10-04",
    fechaLarga: "Domingo 4 de octubre de 2026",
    horario: "11:30 a 15:00",
    duracion: "3,5 horas",
    valor: 60000,
    eventId: "santiago_avanzado_2026_10_04",
    thankYouDateISO: "2026-10-05",
  },
} as const;

export const TALLER_MAPS_URL = "https://maps.app.goo.gl/4BvC7kC3JpVdQVkFA";
export const TALLER_DIRECCION = "Nave Studio, Antares 259, Las Condes, Santiago";
export const TALLER_WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/H9sRekuU8Mh1VPZdCqMe1t?mode=gi_t";
export const TALLER_ENCUESTA_URL = "https://tally.so/r/yPGbxX";

export function tallerKeyFromNivel(nivel: string | null | undefined): TallerKey {
  return nivel === "avanzado" ? "avanzado" : "fundamentos";
}
