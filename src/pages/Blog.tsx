import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Tag } from "lucide-react";
import heroImage from "@/assets/blog-wim-hof-hero.jpg";
import biohackingHeroImage from "@/assets/blog-biohacking-hero.jpg";
import yinVinyasaHeroImage from "@/assets/blog-yin-vinyasa-hero.jpg";
import habitosDisciplinaHeroImage from "@/assets/blog-habitos-disciplina-hero.jpg";
import aguaFriaGuiadoHeroImage from "@/assets/blog-agua-fria-guiado-hero.jpg";
import protocoloSeguroHeroImage from "@/assets/blog-protocolo-seguro-hero.jpg";

const Blog = () => {
  const blogPosts = [
    {
      title: "Lo que nadie te cuenta del agua fría y la respiración",
      slug: "/blog/protocolo-seguro-agua-fria-respiracion",
      excerpt: "El protocolo seguro para iniciar con agua fría y respiración. Las 3 fases esenciales que nadie te cuenta para empezar sin traumas ni forzar nada.",
      author: "Alan Iceman Earle",
      date: "16 de agosto, 2025",
      categories: ["Wim Hof Method", "Protocolo seguro", "Agua fría", "Respiración guiada"],
      image: protocoloSeguroHeroImage,
      imageAlt: "Protocolo seguro de inmersión en agua fría y respiración en Nave Studio"
    },
    {
      title: "Agua fría: la diferencia entre hacerlo solo y vivirlo guiado (y por qué nunca es lo mismo)",
      slug: "/blog/agua-fria-guiado-vs-solo-experiencia-wim-hof",
      excerpt: "Duchas frías en casa pueden cambiar tu energía, pero vivir el agua fría guiado cambia tu mente. Conoce la diferencia entre hacerlo solo y vivirlo con acompañamiento.",
      author: "Alan Iceman Earle",
      date: "15 de agosto, 2025",
      categories: ["Agua fría", "Criomedicina", "Wim Hof Method", "Respiración consciente"],
      image: aguaFriaGuiadoHeroImage,
      imageAlt: "Sesión guiada de inmersión en agua fría en Nave Studio Las Condes"
    },
    {
      title: "Hábitos y disciplina: el arte de construirte a ti mismo (paso a paso)",
      slug: "/blog/habitos-disciplina-como-construirte-a-ti-mismo",
      excerpt: "La motivación prende la chispa, pero la disciplina mantiene el fuego. Aprende a construir hábitos sostenibles para cuerpo, mente y espíritu.",
      author: "Alan Iceman Earle",
      date: "14 de agosto, 2025",
      categories: ["Hábitos", "Disciplina", "Criocoaching", "Crecimiento personal"],
      image: habitosDisciplinaHeroImage,
      imageAlt: "Hábitos y disciplina para el crecimiento personal en Nave Studio"
    },
    {
      title: "Yin Yoga y Vinyasa Yoga: dos caminos complementarios para regular tu cuerpo y tu mente",
      slug: "/blog/yin-yoga-vinyasa-yoga-beneficios-como-combinarlos",
      excerpt: "Yin calma y movilidad; Vinyasa activa y fortalece. Cómo funcionan, a quién sirven y cómo combinarlos (con respiración y agua fría opcional).",
      author: "Alan Iceman Earle",
      date: "13 de agosto, 2025",
      categories: ["Yoga", "Yin", "Vinyasa", "Regulación del estrés"],
      image: yinVinyasaHeroImage,
      imageAlt: "Práctica de Yin Yoga y Vinyasa Yoga en Nave Studio"
    },
    {
      title: "Biohacking para longevidad: HIIT + Breathwork + Agua fría (la tríada que entrena tu futuro)",
      slug: "/blog/biohacking-hiit-breathwork-agua-fria-longevidad",
      excerpt: "HIIT, breathwork y agua fría generan hormesis bien dosificada: mejor VO₂ máx, regulación del estrés y flexibilidad metabólica para vivir más y mejor.",
      author: "Alan Iceman Earle",
      date: "12 de agosto, 2025",
      categories: ["Biohacking", "HIIT", "Respiración WHM", "Longevidad"],
      image: biohackingHeroImage,
      imageAlt: "Entrenamiento HIIT combinado con breathwork y agua fría para biohacking"
    },
    {
      title: "Método Wim Hof: respiración, frío y mente — lo esencial (y cómo empezar hoy)",
      slug: "/blog/metodo-wim-hof-respiracion-frio-mente",
      excerpt: "Tres pilares —respiración, exposición al frío y compromiso mental— para entrenar tu fisiología y tu carácter. Guía práctica, segura y aplicable desde hoy.",
      author: "Alan Iceman Earle",
      date: "12 de agosto, 2025",
      categories: ["Ice Bath", "Respiración WHM", "Ciencia del bienestar"],
      image: heroImage,
      imageAlt: "Persona en respiración guiada antes del baño de hielo en Nave Studio"
    }
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-primary mb-6">
              Blog: Ciencia del Bienestar
            </h1>
            <p className="text-lg md:text-xl text-neutral-mid mb-8 max-w-3xl mx-auto">
              Artículos con ciencia aplicada a Ice Bath, WHM y bienestar. Aprende y mejora tu energía con nuestras guías basadas en evidencia.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.imageAlt}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.categories.map((category, catIndex) => (
                        <span
                          key={catIndex}
                          className="inline-flex items-center gap-1 text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full"
                        >
                          <Tag className="w-3 h-3" />
                          {category}
                        </span>
                      ))}
                    </div>
                    <CardTitle className="text-xl leading-tight hover:text-primary transition-colors">
                      <a href={post.slug}>{post.title}</a>
                    </CardTitle>
                    <CardDescription className="text-neutral-mid">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-neutral-mid mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <a href={post.slug}>
                        Leer artículo completo
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Coming Soon Notice */}
            <div className="mt-16 max-w-3xl mx-auto text-center">
              <div className="bg-white rounded-2xl p-8 shadow-light border border-border">
                <h2 className="text-2xl font-heading text-primary mb-4">
                  Más contenido en camino
                </h2>
                <p className="text-neutral-mid mb-6">
                  Estamos preparando más artículos de alta calidad sobre respiración consciente, 
                  terapia de frío, yoga y optimización del rendimiento. 
                </p>
                <p className="text-sm text-neutral-mid">
                  Mientras tanto, te invitamos a experimentar nuestras clases presenciales.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-heading text-primary mb-4">
            ¿Listo para experimentar?
          </h2>
          <p className="text-neutral-mid mb-8 max-w-2xl mx-auto">
            No esperes más artículos. Ven y vive la experiencia completa en nuestro estudio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/planes-precios"
              className="inline-flex items-center justify-center px-8 py-3 bg-secondary hover:bg-primary text-white font-medium rounded-lg transition-colors"
            >
              Ver planes
            </a>
            <a
              href="/contacto"
              className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white font-medium rounded-lg transition-colors"
            >
              Contactar
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Blog;