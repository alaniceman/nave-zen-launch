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
}

// Zona horaria consistente
export const CL_TZ = 'America/Santiago';

export const scheduleData: Record<string, ClassItem[]> = {
  lunes: [
    {
      time: "06:30",
      title: "Yang Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: [],
      duration: 60,
      instructor: "Maral"
    },
    {
      time: "08:00",
      title: "Isométrica + Flexibilidad",
      tags: ["Yoga"],
      badges: [],
      duration: 60,
      instructor: "Maral Hekmat"
    },
    {
      time: "09:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "18:30",
      title: "Yin Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60,
      instructor: "Val Medina"
    }
  ],
  martes: [
    {
      time: "08:00",
      title: "Vinyasa Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: [],
      duration: 60,
      instructor: "Mar"
    },
    {
      time: "10:00",
      title: "Personalizado Método Wim Hof",
      tags: ["Personalizado", "Método Wim Hof"],
      badges: ["Máx 1–2 personas"],
      duration: 60,
      isPersonalized: true
    },
    {
      time: "11:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "13:00",
      title: "Biohacking: Breathwork + HIIT + Ice Bath",
      tags: ["Biohacking"],
      badges: ["Respiración + HIIT + Hielo"],
      duration: 60
    },
    {
      time: "19:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "20:15",
      title: "Yoga Integral + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    }
  ],
  miercoles: [
    {
      time: "06:30",
      title: "Yang Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: [],
      duration: 60,
      instructor: "Maral"
    },
    {
      time: "08:00",
      title: "Biohacking: Breathwork + HIIT + Ice Bath",
      tags: ["Biohacking"],
      badges: ["Respiración + HIIT + Hielo"],
      duration: 60,
      instructor: "Maral Hekmat"
    },
    {
      time: "09:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "18:30",
      title: "Yin Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60,
      instructor: "Maral Hekmat"
    },
    {
      time: "19:30",
      title: "Breathwork Wim Hof",
      tags: ["Breathwork & Meditación"],
      badges: ["Sin inmersión"],
      duration: 60
    }
  ],
  jueves: [
    {
      time: "08:00",
      title: "Vinyasa Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: [],
      duration: 60,
      instructor: "Mar"
    },
    {
      time: "10:00",
      title: "Personalizado Método Wim Hof",
      tags: ["Personalizado", "Método Wim Hof"],
      badges: ["Máx 1–2 personas"],
      duration: 60,
      isPersonalized: true
    },
    {
      time: "11:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "13:00",
      title: "Biohacking: Breathwork + HIIT + Ice Bath",
      tags: ["Biohacking"],
      badges: ["Respiración + HIIT + Hielo"],
      duration: 60
    },
    {
      time: "19:15",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    }
  ],
  viernes: [
    {
      time: "07:00",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "09:00",
      title: "Vinyasa Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60,
      instructor: "Val Medina"
    },
    {
      time: "15:00",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60,
      instructor: "Sol"
    },
    {
      time: "18:00",
      title: "Yoga Integral + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60,
      instructor: "Maral Hekmat"
    }
  ],
  sabado: [
    {
      time: "09:00",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    },
    {
      time: "10:15",
      title: "Vinyasa Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    },
    {
      time: "11:45",
      title: "Método Wim Hof (Breathwork + Ice Bath)",
      tags: ["Método Wim Hof"],
      badges: [],
      duration: 60
    }
  ],
  domingo: [
    {
      time: "09:00",
      title: "Power Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    },
    {
      time: "10:15",
      title: "Power Yoga + Ice Bath (opcional)",
      tags: ["Yoga"],
      badges: ["Ice Bath opcional"],
      duration: 60
    }
  ]
};

export const dayNames = {
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