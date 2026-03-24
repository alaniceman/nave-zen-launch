export interface Coach {
  id: string;
  name: string;
  role: string;
  credentials: string;
  purpose: string;
  isFounder?: boolean;
  image: string;
  tags: string[];
  slug: string; // matches professionals.slug or custom
  bio: string;
  galleryImages: string[];
}

export const coaches: Coach[] = [
  {
    id: "alan",
    slug: "alan",
    name: "Alan Iceman Earle",
    role: "Fundador – Crioguía de Inmersiones y Breathwork",
    credentials: "Instructor Certificado Método Wim Hof · Coach Ontológico · Ingeniero Civil PUC",
    purpose: "Ayudo a las personas a vivir con la certeza de que pueden lograr lo que se propongan, sin sacrificar su bienestar.",
    isFounder: true,
    image: "/lovable-uploads/b009e7fc-5c3e-4b38-99e1-a3cc58605206.png",
    tags: ["Mindset", "Movimiento"],
    bio: "Alan es el fundador de Nave Studio y uno de los primeros instructores certificados del Método Wim Hof en Latinoamérica. Ingeniero Civil de la PUC y Coach Ontológico, combina su formación analítica con años de práctica en respiración consciente, exposición al frío y movimiento funcional. Ha guiado a cientos de personas a superar sus límites mentales y físicos a través de experiencias de inmersión en hielo y breathwork. Su misión es demostrar que el bienestar y el alto rendimiento pueden coexistir.",
    galleryImages: [],
  },
  {
    id: "maral",
    slug: "maral",
    name: "Maral Hekmat",
    role: "Instructora de Yoga y Movimiento Consciente – Kinesióloga en formación",
    credentials: "Yoga – Federación Internacional de Yoga · Kinesióloga en formación – Universidad Finis Terrae",
    purpose: "Guío prácticas que cultivan fuerza y flexibilidad sin perder el equilibrio interno.",
    image: "/lovable-uploads/30549bc9-e0a1-4084-927b-f3eadfec8372.png",
    tags: ["Movimiento", "Terapia"],
    bio: "Maral es instructora de Yoga y Movimiento Consciente con formación en Kinesiología. Especialista en biomecánica y prevención de lesiones, guía sesiones de Power Yoga e Yoga Integral con un enfoque técnico y sensible. Como Crioguía certificada, integra la exposición al frío en sus prácticas para potenciar la recuperación y la conexión mente-cuerpo. Su objetivo es ayudarte a construir un cuerpo fuerte y flexible desde la consciencia.",
    galleryImages: [],
  },
  {
    id: "sol",
    slug: "sol",
    name: "Sol Evans",
    role: "Instructora de Ice Yoga · Reikista",
    credentials: "Crioguía de Inmersiones y Breathwork · Terapeuta Holística – Reiki Master",
    purpose: "Te acompaño a encontrar calma y fortaleza a través del frío, la respiración y la energía.",
    image: "/lovable-uploads/27a0352e-30dd-41fc-8a91-48b297e8615a.png",
    tags: ["Energía", "Terapia"],
    bio: "Sol es instructora de Ice Yoga y Reiki Master con amplia experiencia en terapias holísticas. Combina la práctica del yoga con inmersiones en agua fría y técnicas de breathwork para crear experiencias transformadoras. Su enfoque integra la sanación energética con el trabajo corporal, acompañando a cada persona a encontrar su propio equilibrio entre calma interior y fortaleza física.",
    galleryImages: [],
  },
  {
    id: "rolo",
    slug: "rolo",
    name: "Rolo Varela",
    role: "Instructor Certificado – Ice Yoga Method",
    credentials: "Crioguía de Inmersiones y Breathwork",
    purpose: "Te acompaño a fortalecer cuerpo y mente con frío, respiración y movimiento, cultivando foco y resiliencia sin burnout.",
    image: "/lovable-uploads/10cde0b9-b008-44ba-aa09-dcd13c8e2826.png",
    tags: ["Ice Yoga", "Breathwork", "Movimiento"],
    bio: "Rolo es instructor certificado del Ice Yoga Method y Crioguía de inmersiones y breathwork. Su práctica se centra en la integración del frío, la respiración y el movimiento como herramientas para cultivar resiliencia y foco mental. Acompaña a sus alumnos a encontrar fortaleza física y mental sin caer en el agotamiento, promoviendo un enfoque sostenible del alto rendimiento.",
    galleryImages: [],
  },
  {
    id: "mar",
    slug: "mar",
    name: "Mar Carrasco",
    role: "Instructora de Vinyasa Yoga, Inside Flow y Danza",
    credentials: "Especialista en Conexión Movimiento–Respiración · Bailarina Profesional",
    purpose: "Guío secuencias fluidas que despiertan tu creatividad, presencia corporal y conexión interior, para habitarte con más amor, libertad y conciencia.",
    image: "/lovable-uploads/bb33cba0-3deb-41b3-97f1-c55d9dc169c1.png",
    tags: ["Movimiento", "Energía"],
    bio: "Mar es instructora de Vinyasa Yoga, Inside Flow y bailarina profesional. Especialista en la conexión movimiento-respiración, crea secuencias fluidas que combinan la técnica del yoga con la expresión artística de la danza. Sus clases invitan a despertar la creatividad, la presencia corporal y la conexión interior, generando un espacio para habitarte con más amor, libertad y conciencia.",
    galleryImages: [],
  },
  {
    id: "amanda",
    slug: "amanda",
    name: "Amanda Moutel",
    role: "Bailarina y Profesora de Yoga y Danza",
    credentials: "Facilitadora de Breathwork y Prácticas Somáticas · Terapeuta de Respiración Consciente Informada en Trauma",
    purpose: "Te acompaño a que conectes con tu soberanía interior; con paciencia, compasión, cuidado y amor.",
    image: "/lovable-uploads/amanda-moutel.webp",
    tags: ["Movimiento", "Breathwork"],
    bio: "Amanda es bailarina, profesora de Yoga y Danza, y facilitadora de prácticas somáticas. Como terapeuta de respiración consciente informada en trauma, integra el movimiento, la respiración y la conciencia corporal en cada sesión. Su enfoque busca acompañar a cada persona a conectar con su soberanía interior desde la paciencia, la compasión y el amor propio.",
    galleryImages: [],
  },
  {
    id: "amber",
    slug: "amber",
    name: "Ámbar Vidal",
    role: "Instructora de Yoga · Doula · Reikista",
    credentials: "Crioguía de Inmersiones y Yoga Integral · Facilitadora de Círculos Femeninos y Ceremonias de Cacao",
    purpose: "Te acompaño a transitar etapas de cambio con serenidad, cuerpo y corazón alineados.",
    image: "/lovable-uploads/367f27fb-5f27-4b38-bc21-af8951de42aa.png",
    tags: ["Energía", "Terapia"],
    bio: "Ámbar es instructora de Yoga Integral, Doula certificada y Reiki Master. Facilitadora de Círculos Femeninos y Ceremonias de Cacao, acompaña procesos de transformación desde una mirada holística. Como Crioguía de inmersiones, integra la exposición al frío con prácticas que honran los ciclos naturales del cuerpo y las emociones, ayudándote a transitar etapas de cambio con serenidad.",
    galleryImages: [],
  },
];

// Coaches that have a matching professional in the DB and can be booked via agenda
export const BOOKABLE_SLUGS = ["sol", "maral", "rolo", "mar", "amanda"];

export const getCoachBySlug = (slug: string): Coach | undefined =>
  coaches.find((c) => c.slug === slug);
