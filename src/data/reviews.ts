export type ReviewCategory = "Yoga" | "Método Wim Hof" | "Ice Bath" | "Experiencia";

export type Review = {
  id: number;
  text: string;
  author: string;
  category: ReviewCategory;
};

export const reviews: Review[] = [
  { id: 1, text: "la amanda es una excelente profe, es súper cercana y amable y te va corrigiendo los pasos para una óptima realización. Sin duda volvería!!! :-)", author: "Alumna de Amanda", category: "Yoga" },
  { id: 2, text: "Una calma desde la entrada a la salida. La Sol lo hace todo por convencerte de que puedes hacerlo y mas. Y efectivamente lo hice y mas!", author: "Alumna de Sol", category: "Ice Bath" },
  { id: 3, text: "Amanda fue un amor de persona y la clase conjunto al lugar es hermoso ; muchas gracias seguro volveré 💌❤️", author: "Alumna de Amanda", category: "Yoga" },
  { id: 4, text: "Maravillosa clase, Maral es la mejor!", author: "Alumna de Maral", category: "Yoga" },
  { id: 5, text: "Excelente clase! Mariela es seca, muy buena profesora, sus clases son dinámicas y desafiantes", author: "Alumna de Mariela", category: "Yoga" },
  { id: 6, text: "Buena clase y muy buen lugar, recomiendo", author: "Comunidad Nave", category: "Experiencia" },
  { id: 7, text: "me gusto mucho! muy relajante, lindo y limpio el lugar, la profesora muy simpática", author: "Comunidad Nave", category: "Yoga" },
  { id: 8, text: "Preciosisima clase con Amanda!! de inicio a fin 💖 totalmente recomendada", author: "Alumna de Amanda", category: "Yoga" },
  { id: 9, text: "maravillosa experiencia, La instructora Sol generó un ambiente cálido y de tranquilidad para desarrollar la actividad. Super recomendado.", author: "Alumna de Sol", category: "Ice Bath" },
  { id: 10, text: "Una clase única! Dirigida y acompanhañada me sentí! Correcciones que me hicieron sentir segura y confiada de mis movimientos! Muchas gracias Amanda!", author: "Alumna de Amanda", category: "Yoga" },
  { id: 11, text: "Me gustó mucho la clase y la profesora. Me sentí muy acogida en el lugar y se nota que se preocupan de los detalles. ¡volveré!", author: "Comunidad Nave", category: "Yoga" },
  { id: 12, text: "Experiencia Maravillosa. Sol es tremenda terapeuta. La Nave es un lugar muy acogedor.", author: "Alumna de Sol", category: "Ice Bath" },
  { id: 13, text: "me encanta la clase de Maral, es muy desafiante", author: "Alumna de Maral", category: "Yoga" },
  { id: 14, text: "Muy buena experiencia, me sentí muy bienvenido y cómodo desde el principio, la profesora muy simpática y guiando la clase con mucha calma para lograr una relajación de cuerpo y mente.", author: "Comunidad Nave", category: "Yoga" },
  { id: 15, text: "Me duele todo … la mejor profe de joya", author: "Comunidad Nave", category: "Yoga" },
  { id: 16, text: "ME ENCANTO TODA LA EXPERIENCIA. Volveré. Maral es lo máximo 😍", author: "Alumna de Maral", category: "Yoga" },
  { id: 17, text: "Me encantó la clase, nunca había hecho yoga y la profe se adaptó a nosotras, muy amorosa, vuelvo si o si", author: "Comunidad Nave", category: "Yoga" },
  { id: 18, text: "Val es muy amorosa y atenta, me gustó mucho esta modalidad de yoga (vinyasa) es súper movido y eso me ayudó a estar muy concentrada. Súper buena clase, recomiendo y volvería 🌱", author: "Alumna de Val", category: "Yoga" },
  { id: 19, text: "Muy relajante, Val es un 7 y mega recomiendo la clase!!", author: "Alumna de Val", category: "Yoga" },
  { id: 20, text: "Excelente clase! mezcla fuerza y flexibilidad con meditación. Fue fácil de seguir a pesar de que las posturas eran exigentes. El centro es precioso y la profe Maral, muy buena como guía para lograr una práctica fluida y energética. Vuelvo seguro!", author: "Alumna de Maral", category: "Yoga" },
  { id: 21, text: "Me encantó la sesión, Maral acompaña muy bien en todo el proceso, totalmente recomendado!", author: "Alumna de Maral", category: "Yoga" },
  { id: 22, text: "recomiendo mucha esta experiencia, realmente una catarsis", author: "Comunidad Nave", category: "Experiencia" },
  { id: 23, text: "Me encantooo en verdad muy recomendados!", author: "Comunidad Nave", category: "Experiencia" },
  { id: 24, text: "me encantó la clase, se adapta a cada nivel y la meditación final estuvo increíble", author: "Comunidad Nave", category: "Yoga" },
  { id: 25, text: "Desafiante, diferente, en un espacio acogedor con una guía que me ayudó muchísimo. Tremenda experiencia", author: "Comunidad Nave", category: "Experiencia" },
  { id: 26, text: "Me encantó la sesión! Guiada súper bien por la profesora Maral, en todo momento preocupada por cada detalle de la experiencia. Gracias!", author: "Alumna de Maral", category: "Yoga" },
  { id: 27, text: "Clase muy personalizada, en un espacio muy acogedor y tranquilo, me encanto ❤️", author: "Comunidad Nave", category: "Yoga" },
  { id: 28, text: "la energía es increíble y la clases de Maral siempre llenan el alma.", author: "Alumna de Maral", category: "Yoga" },
  { id: 29, text: "Excelente experiencia siempre es un agrado asistir a la nave se preocupan de orientarte que la experiencia de agua fría sea la mejor y te hacen sentir muy cómodo lo recomiendo 100%", author: "Comunidad Nave", category: "Ice Bath" },
  { id: 30, text: "Hermoso el lugar tiene una energía muy linda💛 la profe Maral es secaaa excelente clase 🙌🏼", author: "Alumna de Maral", category: "Yoga" },
  { id: 31, text: "10 de 10 todo✨, la clase súper buena mi cuerpo y mente lo agradece por mil!!! La instructora Maral demasiado seca, hace sentir el yoga con toda su escencia, es súper preocupada🙏 siempre nos ayuda cuando estamos medios complicados con alguna postura, y el espacio demasiado lindo, fui a la clase de las 9 y lo único que se escuchaba eran los pajaritos 🦜🌿🍃 💛", author: "Alumna de Maral", category: "Yoga" },
  { id: 32, text: "Muy buena experiencia, junto al profesor Gastón Serrano", author: "Alumno de Gastón", category: "Experiencia" },
  { id: 33, text: "Excelente experiencia!!! 🤩🤩🤩 10/10. Maral, muy amorosa, clave la clase de yoga pre inmersión en el agua fría. El lugar muy acogedor, si o si lo recomiendo🙌", author: "Alumna de Maral", category: "Ice Bath" },
  { id: 34, text: "Increíble la clase y la instructora MARAL un 7, la amo!", author: "Alumna de Maral", category: "Yoga" },
];
