export type TallerKey = "fundamentos" | "avanzado";

export const TALLERES = {
  fundamentos: {
    nombre: "Taller Fundamentos Método Wim Hof",
    nombreCorto: "Fundamentos",
    fechaISO: "2026-08-23",
    fechaLarga: "Domingo 23 de agosto de 2026",
    horario: "11:30 a 15:00",
    valor: 50000,
    eventId: "santiago_fundamentos_2026_08_23",
  },
  avanzado: {
    nombre: "Taller Avanzado Método Wim Hof",
    nombreCorto: "Avanzado",
    fechaISO: "2026-08-23",
    fechaLarga: "Domingo 23 de agosto de 2026",
    horario: "15:30 a 19:00",
    valor: 60000,
    eventId: "santiago_avanzado_2026_08_23",
  },
} as const;

export const TALLER_MAPS_URL = "https://maps.app.goo.gl/4BvC7kC3JpVdQVkFA";
export const TALLER_DIRECCION = "Nave Studio, Antares 259, Las Condes, Santiago";
