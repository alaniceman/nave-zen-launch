// Schedule data structure
export interface ClassItem {
  time: string;
  title: string;
  tags: string[];
  badges: string[];
  duration: number;
  isPersonalized?: boolean;
  goLiveDate?: string; // "YYYY-MM-DD" — visible 'normal' desde esta fecha (CLT). Antes = "Pronto"
  instructor?: string; // "Maral", "Mar", etc.
  slug?: string; // "pronto" for coming soon
  is_trial_enabled?: boolean; // true = permite clase de prueba
  description?: string; // breve descripcion 1-2 lineas
}

// Zona horaria consistente
export const CL_TZ = 'America/Santiago';

// Descripciones por defecto según tipo de clase
const trialDescriptions: Record<string, string> = {
  "Yin Yoga": "Posturas pasivas y prolongadas para soltar tensión profunda y ganar flexibilidad.",
  "Yang Yoga": "Yoga dinámico que fortalece y activa el cuerpo con movimiento fluido.",
  "Vinyasa Yoga": "Flujo continuo de posturas sincronizado con la respiración.",
  "Yoga Integral": "Combina fuerza, flexibilidad y meditación en una práctica completa.",
  "Power Yoga": "Yoga de alta intensidad enfocado en fuerza y resistencia muscular.",
  "Isométrica": "Ejercicios isométricos que desarrollan fuerza y estabilidad profunda.",
  "HIIT + Ice Bath": "Entrenamiento de alta intensidad seguido de inmersión en agua fría.",
  "Breathwork Wim Hof": "Sesión guiada de respiración Wim Hof para energía y claridad mental.",
  "Método Wim Hof": "Breathwork avanzado + inmersión en agua fría. Requiere sesión previa.",
  "Personalizado": "Sesión personalizada 1-a-1 con instructor certificado Wim Hof.",
};

// Helper to determine trial eligibility and description from class data
const getTrialInfo = (item: Omit<ClassItem, 'is_trial_enabled' | 'description'>): { is_trial_enabled: boolean; description: string } => {
  const isWimHofFull = item.tags.includes("Método Wim Hof") && !item.tags.includes("Personalizado") && item.title.includes("Breathwork + Ice Bath");
  const isPersonalized = item.isPersonalized || item.tags.includes("Personalizado");
  
  const is_trial_enabled = !isWimHofFull && !isPersonalized;
  
  // Pick description
  let description = "";
  if (isPersonalized) description = trialDescriptions["Personalizado"];
  else if (isWimHofFull) description = trialDescriptions["Método Wim Hof"];
  else if (item.title.includes("Yin Yoga")) description = trialDescriptions["Yin Yoga"];
  else if (item.title.includes("Yang Yoga")) description = trialDescriptions["Yang Yoga"];
  else if (item.title.includes("Vinyasa")) description = trialDescriptions["Vinyasa Yoga"];
  else if (item.title.includes("Integral")) description = trialDescriptions["Yoga Integral"];
  else if (item.title.includes("Power Yoga")) description = trialDescriptions["Power Yoga"];
  else if (item.title.includes("Isométrica")) description = trialDescriptions["Isométrica"];
  else if (item.title.includes("HIIT")) description = trialDescriptions["HIIT + Ice Bath"];
  else if (item.title.includes("Breathwork Wim Hof")) description = trialDescriptions["Breathwork Wim Hof"];
  
  return { is_trial_enabled, description };
};

// Build a class item with auto-computed trial fields
const c = (item: Omit<ClassItem, 'is_trial_enabled' | 'description'>): ClassItem => {
  const { is_trial_enabled, description } = getTrialInfo(item);
  return { ...item, is_trial_enabled, description };
};

export const scheduleData: Record<string, ClassItem[]> = {
  lunes: [
    c({
      time: "06:30",
      title: "Yang Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: [],
      duration: 60,
      instructor: "Maral"
    }),
    c({
      time: "08:00",
      title: "Isométrica + Flexibilidad",
      tags: ["Yoga"],
      badges: [],
      duration: 60,
      instructor: "Maral Hekmat"
    }),
    c({
      time: "09:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    }),
    c({
      time: "18:30",
      title: "Yin Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60,
      instructor: "Val Medina"
    })
  ],
  martes: [
    c({
      time: "08:00",
      title: "Vinyasa Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: [],
      duration: 60,
      instructor: "Mar"
    }),
    c({
      time: "10:00",
      title: "Personalizado Método Wim Hof",
      tags: ["Personalizado", "Método Wim Hof"],
      badges: ["Máx 1–2 personas"],
      duration: 60,
      isPersonalized: true
    }),
    c({
      time: "11:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    }),
    c({
      time: "19:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    }),
    c({
      time: "20:15",
      title: "Yoga Integral + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    })
  ],
  miercoles: [
    c({
      time: "06:30",
      title: "Yang Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: [],
      duration: 60,
      instructor: "Maral"
    }),
    c({
      time: "08:00",
      title: "HIIT + Ice Bath",
      tags: ["HIIT"],
      badges: [],
      duration: 60,
      instructor: "Maral Hekmat"
    }),
    c({
      time: "09:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    }),
    c({
      time: "18:30",
      title: "Yin Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60,
      instructor: "Maral Hekmat"
    }),
    c({
      time: "19:30",
      title: "Breathwork Wim Hof",
      tags: ["Breathwork & Meditación"],
      badges: ["Sin inmersión"],
      duration: 60
    })
  ],
  jueves: [
    c({
      time: "08:00",
      title: "Vinyasa Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: [],
      duration: 60,
      instructor: "Mar"
    }),
    c({
      time: "10:00",
      title: "Personalizado Método Wim Hof",
      tags: ["Personalizado", "Método Wim Hof"],
      badges: ["Máx 1–2 personas"],
      duration: 60,
      isPersonalized: true
    }),
    c({
      time: "11:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    }),
    c({
      time: "19:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    })
  ],
  viernes: [
    c({
      time: "07:00",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    }),
    c({
      time: "09:00",
      title: "Vinyasa Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60,
      instructor: "Val Medina"
    }),
    c({
      time: "15:00",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60,
      instructor: "Sol"
    }),
    c({
      time: "18:00",
      title: "Yoga Integral + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60,
      instructor: "Maral Hekmat"
    })
  ],
  sabado: [
    c({
      time: "09:00",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    }),
    c({
      time: "10:15",
      title: "Vinyasa Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    }),
    c({
      time: "11:45",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    })
  ],
  domingo: [
    c({
      time: "09:00",
      title: "Power Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    }),
    c({
      time: "10:15",
      title: "Power Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    })
  ]
};

export const dayNames: Record<string, string> = {
  lunes: "Lunes",
  martes: "Martes",
  miercoles: "Miércoles",
  jueves: "Jueves",
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo"
};

export const getTodayInSantiago = () => {
  const now = new Date();
  const santiago = new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    timeZone: 'America/Santiago'
  }).format(now).toLowerCase();
  
  const dayMap: { [key: string]: string } = {
    'lunes': 'lunes',
    'martes': 'martes',
    'miércoles': 'miercoles',
    'jueves': 'jueves',
    'viernes': 'viernes',
    'sábado': 'sabado',
    'domingo': 'domingo'
  };
  
  return dayMap[santiago] || 'lunes';
};
