export type ReviewCategory =
  | "Yoga"
  | "Método Wim Hof"
  | "Ice Bath"
  | "Experiencia"
  // Categorías usadas solo por los testimonios del Taller Wim Hof
  | "Respiración"
  | "Hielo"
  | "Comunidad"
  | "Lugar";

export type Review = {
  id: number;
  text: string;
  author: string;
  category: ReviewCategory;
  /** Reseñas destacadas (Prioridad 1) para home y landings */
  featured?: boolean;
};

/**
 * Set curado de reseñas reales de la comunidad Nave Studio.
 * Prioridad 1 (featured) primero, luego reseñas de apoyo y rotación.
 */
export const reviews: Review[] = [
  // ── Prioridad 1 ─────────────────────────────────────────────────────────
  { id: 1, text: "Primera vez en el agua helada y fue una excelente experiencia. Sol se tomó el tiempo de explicarme todo el proceso antes de entrar a la sesión, lo que me hizo sentir muy tranquila y segura. Además, el ambiente es súper acogedor y transmite mucha confianza.", author: "Paulina", category: "Ice Bath", featured: true },
  { id: 2, text: "Me encantó toda la práctica: el ejercicio de respiración, la inmersión en agua fría y hasta el té final. El ambiente es amable y la práctica se explica en detalle. Sin duda volveré.", author: "Mónica B.", category: "Ice Bath", featured: true },
  { id: 3, text: "Me gustó mucho la clase de yoga con Maral y luego la sesión de ice bath. El equipo es muy acogedor y el centro muy cómodo. Volveré feliz.", author: "Mariana Bengoa", category: "Ice Bath", featured: true },
  { id: 4, text: "Agradezco mucho la experiencia. Desde que llegué me sentí muy cómoda. La respiración y la inmersión me llevaron a conectar con una presencia y plenitud que hace mucho no sentía.", author: "Comunidad Nave", category: "Ice Bath", featured: true },
  { id: 5, text: "Me gustó muchísimo la experiencia. El frío se está transformando en mi nuevo aliado. Sentí muchísima calma dentro del agua, lo que me sorprendió por ser mi primera sesión. Además, el tiempo se me pasó volando.", author: "Comunidad Nave", category: "Ice Bath", featured: true },
  { id: 6, text: "Excelente lugar, ambiente y experiencia. Es muy bien guiado el paso a paso previo para ir por primera vez y la organización es muy buena. Los felicito y espero regresar.", author: "Comunidad Nave", category: "Experiencia", featured: true },
  { id: 7, text: "No imaginan cuánto me encantó la clase. Nunca había realizado esta práctica y muchas veces pensé que el yoga no era para mí, pero después de hoy creo que simplemente no había llegado al lugar indicado.", author: "Comunidad Nave", category: "Yoga", featured: true },
  { id: 8, text: "La sesión de crio fue una experiencia muy grata, en la que me sorprendió la capacidad de reacción de mi mente y mi cuerpo. Cuando tenga la oportunidad, la volveré a tomar.", author: "Melissa Rojas Valenzuela", category: "Ice Bath", featured: true },
  { id: 9, text: "Me encantó la sesión guiada por Maral. Es una mujer muy empática y amorosa. La recomiendo 100%. Me sentí muy bien y en un espacio seguro en todo momento.", author: "Alumna de Maral", category: "Yoga", featured: true },
  { id: 10, text: "Una calma desde la entrada hasta la salida. Sol hace todo por convencerte de que puedes hacerlo y más. Y efectivamente, lo hice.", author: "Alumna de Sol", category: "Ice Bath", featured: true },
  { id: 11, text: "Es un centro maravilloso, tanto para yoga como para baños de hielo y experiencias integradoras. Los guías, los profesores, la vibra del lugar, los alumnos y el ambiente invitan a la paz y al autodesarrollo en cada disciplina.", author: "Juan Sebastián Inostroza Chuaqui", category: "Experiencia", featured: true },
  { id: 12, text: "Súper rica la clase. Ideal para cerrar el día. El lugar impecable, iluminación ideal y buena música relajante. Al final, durante savasana, la instructora tocó cuencos y otros instrumentos. Lo recomiendo.", author: "Lorena", category: "Yoga", featured: true },
  { id: 13, text: "Excelente clase. Mezcla fuerza y flexibilidad con meditación. Fue fácil de seguir, a pesar de que las posturas eran exigentes. El centro es precioso y Maral es una muy buena guía para lograr una práctica fluida y energética. Vuelvo seguro.", author: "Alumna de Maral", category: "Yoga", featured: true },
  { id: 14, text: "La respiración me llevó a una relajación absoluta y la inmersión en hielo me dejó con mucha energía y claridad. Tienen un espacio muy lindo.", author: "Comunidad Nave", category: "Ice Bath", featured: true },
  { id: 15, text: "Fue una experiencia mágica. Se agradece mucho la guía amorosa y respetuosa desde la vivencia de cada uno. Fui sin expectativas y terminé superando todas mis expectativas conmigo misma y con mi reacción al frío.", author: "Comunidad Nave", category: "Ice Bath", featured: true },
  { id: 16, text: "Una clase única. Me sentí dirigida y acompañada. Las correcciones me hicieron sentir segura y confiada en mis movimientos.", author: "Alumna de Amanda", category: "Yoga", featured: true },
  { id: 17, text: "Me encanta ir. Es un lugar seguro, confortable y con excelentes profesionales. Súper recomendable; no se arrepentirán de ir.", author: "Andrea Durán", category: "Experiencia", featured: true },
  { id: 18, text: "Fue una muy buena instancia. Salí con las energías renovadas.", author: "Comunidad Nave", category: "Experiencia", featured: true },
  { id: 19, text: "Me encantó la clase. Nunca había hecho yoga y la profesora se adaptó a nosotras. Fue muy amorosa. Vuelvo sí o sí.", author: "Comunidad Nave", category: "Yoga", featured: true },
  { id: 20, text: "Una experiencia realmente transformadora. Vine desde Arica con mi esposo para vivirla y terminamos comprando una Nave para nuestro hogar. El agua fría te cambia la vida.", author: "Bárbara Gutiérrez", category: "Ice Bath", featured: true },
  { id: 21, text: "Es tremendo todo lo que se vive en cada minuto. Pausar y darle calma a la vida ajetreada es impagable. Conectarse con la respiración, mentalizarse para un desafío interno y poder vivirlo no tiene precio.", author: "Comunidad Nave", category: "Ice Bath", featured: true },
  { id: 22, text: "Mágica experiencia para el cuerpo y el alma. Alan fue increíble y transmitió seguridad y paz durante todo el proceso.", author: "Alumno de Alan", category: "Ice Bath", featured: true },
  { id: 23, text: "Fue divertido y relajante, en un espacio muy bonito y cómodo. Gracias a la profesora pude entender mucho del Yin Yoga y me ayudó en las posturas con diversos implementos. Salí con un segundo aire.", author: "Camilo", category: "Yoga", featured: true },
  { id: 24, text: "Una experiencia totalmente recomendada. El ambiente es increíble y te hacen sentir como en casa.", author: "Luis Arcos", category: "Experiencia", featured: true },

  // ── Prioridad 2: Método Wim Hof, respiración y agua fría ────────────────
  { id: 25, text: "De verdad fue una experiencia increíble. Poder regular ese momento de inmersión te hace sentir que, a través de la respiración y la concentración, puedes lograr eso y más.", author: "Comunidad Nave", category: "Ice Bath" },
  { id: 26, text: "Poder experimentar la inmersión en agua fría me reenergizó y me ayudó a reconocer el poder del cuerpo para adaptarse a las adversidades. Me fui orgullosa de mí.", author: "Comunidad Nave", category: "Ice Bath" },
  { id: 27, text: "Fue una experiencia difícil, pero muy positiva para mí. Muchísimas gracias por la contención y el apoyo durante la inmersión.", author: "Comunidad Nave", category: "Ice Bath" },
  { id: 28, text: "Me encantó el acompañamiento mientras estuve sumergida en el agua. La voz y la melodía me mantuvieron en calma.", author: "Comunidad Nave", category: "Ice Bath" },
  { id: 29, text: "Fue una experiencia bacán. La buena onda de Alan, sus ganas de enseñar y todo lo que sabe generan mucha confianza.", author: "Alumno de Alan", category: "Ice Bath" },
  { id: 30, text: "Una experiencia que se debe vivir. Puede cambiar tu mentalidad si la conviertes en una práctica constante.", author: "Comunidad Nave", category: "Ice Bath" },
  { id: 31, text: "Me encantó toda la experiencia. Gracias por la contención. Se la he recomendado a todo el mundo.", author: "Comunidad Nave", category: "Ice Bath" },
  { id: 32, text: "Me gustó mucho la experiencia y me sentí en confianza. De todas maneras pienso repetirla.", author: "Comunidad Nave", category: "Ice Bath" },
  { id: 33, text: "Renaces en cada inmersión. Recomiendo 100% probar el ice bath acompañado por Sol.", author: "Daniela Monje", category: "Ice Bath" },
  { id: 34, text: "La energía del lugar, los instructores y el efecto del baño hacen que cada experiencia sea extraordinaria.", author: "María Cecilia Vergara", category: "Ice Bath" },
  { id: 35, text: "Excelente servicio y una experiencia completa, con mucho conocimiento sobre criomedicina y otras temáticas de bienestar. Recomendado 1.000%.", author: "Luis Alberto Alvear Gacitua", category: "Ice Bath" },
  { id: 36, text: "Una de las mejores experiencias que he tenido. Te desconectas del mundo. Súper recomendado.", author: "Fabián Prieto", category: "Ice Bath" },
  { id: 37, text: "Maravillosa experiencia. Sol generó un ambiente cálido y tranquilo para desarrollar la actividad. Súper recomendado.", author: "Alumna de Sol", category: "Ice Bath" },
  { id: 38, text: "Experiencia maravillosa. Sol es una tremenda terapeuta y Nave es un lugar muy acogedor.", author: "Alumna de Sol", category: "Ice Bath" },
  { id: 39, text: "Excelente experiencia. Siempre es un agrado asistir a Nave: se preocupan de orientarte para que la experiencia de agua fría sea la mejor y te hacen sentir muy cómodo. Lo recomiendo 100%.", author: "Comunidad Nave", category: "Ice Bath" },

  // ── Prioridad 2: Yoga ───────────────────────────────────────────────────
  { id: 40, text: "Si quieres ir a la mejor clase de yoga de tu vida, con una profesora increíble, anda con Maral.", author: "Ayleen", category: "Yoga" },
  { id: 41, text: "Maral es seca, muy amable y la clase buenísima.", author: "Elba", category: "Yoga" },
  { id: 42, text: "Amanda es una excelente profesora: cercana, amable y atenta a corregir los movimientos para realizar la práctica de forma óptima. Sin duda volvería.", author: "Alumna de Amanda", category: "Yoga" },
  { id: 43, text: "Me gustó mucho la clase y la profesora. Me sentí muy acogida en el lugar y se nota que se preocupan de los detalles. Volveré.", author: "Comunidad Nave", category: "Yoga" },
  { id: 44, text: "Preciosa clase con Amanda, de inicio a fin. Totalmente recomendada.", author: "Alumna de Amanda", category: "Yoga" },
  { id: 45, text: "Val es muy amorosa y atenta. Me gustó mucho esta modalidad de yoga; es dinámica y me ayudó a estar muy concentrada. Recomiendo la clase y volvería.", author: "Alumna de Val", category: "Yoga" },
  { id: 46, text: "Me encantó la clase: se adapta a cada nivel y la meditación final estuvo increíble.", author: "Comunidad Nave", category: "Yoga" },
  { id: 47, text: "Clase muy personalizada, en un espacio acogedor y tranquilo. Me encantó.", author: "Comunidad Nave", category: "Yoga" },
  { id: 48, text: "La energía es increíble y las clases de Maral siempre llenan el alma.", author: "Alumna de Maral", category: "Yoga" },
  { id: 49, text: "El lugar tiene una energía muy linda y Maral es seca. Excelente clase.", author: "Alumna de Maral", category: "Yoga" },
  { id: 50, text: "10 de 10. Mi cuerpo y mi mente lo agradecen. Maral hace sentir el yoga desde su esencia, se preocupa de ayudarnos con cada postura y el espacio es hermoso.", author: "Alumna de Maral", category: "Yoga" },
  { id: 51, text: "Excelente experiencia. Maral es muy amorosa y la clase de yoga antes de la inmersión fue clave. El lugar es muy acogedor; lo recomiendo sí o sí.", author: "Alumna de Maral", category: "Ice Bath" },
  { id: 52, text: "Me encanta Nave. Es un lugar muy familiar, todas las profesoras de yoga son increíbles y los espacios son limpios y bonitos. Lo recomiendo totalmente.", author: "Francisca Forciniti", category: "Yoga" },

  // ── Prioridad 2: Espacio, equipo y comunidad ────────────────────────────
  { id: 53, text: "El mejor lugar. Es cómodo, limpio y bello, y todos quienes atienden son un amor. Lo recomiendo.", author: "Ámbar Vidal", category: "Experiencia" },
  { id: 54, text: "Un lugar soñado que supera las expectativas.", author: "Constanza Hernández", category: "Experiencia" },
  { id: 55, text: "Aquí encuentro mi equilibrio.", author: "Daniela Emma Frez", category: "Experiencia" },
  { id: 56, text: "Realmente es una experiencia fantástica que se debe vivir.", author: "Javier Pedreros", category: "Experiencia" },
  { id: 57, text: "Muy buena experiencia, excelente lugar y excelentes personas.", author: "Toshiroo Kohn", category: "Experiencia" },
  { id: 58, text: "Tremenda experiencia, lugar impecable y mejor atención.", author: "Cristian Cifuentes", category: "Experiencia" },
  { id: 59, text: "El lugar tiene mucha onda y la profesora fue muy buena.", author: "Daniela", category: "Yoga" },
  { id: 60, text: "Me sentí como en casa. Muchas gracias por eso.", author: "Comunidad Nave", category: "Experiencia" },
  { id: 61, text: "El lugar es cálido y me gustó mucho cómo estuvo organizada la sesión: primero conocernos, luego respirar y después entrar al agua.", author: "Comunidad Nave", category: "Ice Bath" },
  { id: 62, text: "Una experiencia muy linda y un ambiente muy cercano.", author: "Comunidad Nave", category: "Experiencia" },
  { id: 63, text: "Me encanta ir. Es un regalo que me doy: quedo relajada y recargada para seguir con las cosas de la vida.", author: "Comunidad Nave", category: "Experiencia" },
  { id: 64, text: "La organización y el seguimiento previo y posterior te acompañan con calidez y atención durante toda la experiencia.", author: "Comunidad Nave", category: "Experiencia" },
];

/** Total de reseñas curadas publicadas en el sitio */
export const REVIEWS_COUNT = reviews.length;

/** Reseñas destacadas (Prioridad 1) */
export const featuredReviews = reviews.filter((r) => r.featured);
