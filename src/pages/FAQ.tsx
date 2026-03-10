import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Footer } from "@/components/Footer";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "¿Es seguro el Ice Bath? ¿Qué precauciones debo tener?",
      answer: "El Ice Bath es seguro cuando se practica correctamente bajo supervisión. Nuestros coaches están certificados para guiarte paso a paso. Contraindicaciones: embarazo, problemas cardíacos graves, presión arterial descontrolada. Siempre consulta con tu médico si tienes dudas."
    },
    {
      question: "¿Puedo tomar una clase de prueba antes de suscribirme?",
      answer: "¡Por supuesto! Ofrecemos clases de prueba gratuitas para que experimentes nuestras metodologías. Puedes agendar directamente desde nuestra web en la sección 'Clase de prueba'."
    },
    {
      question: "¿La clase de prueba incluye inmersión en agua fría?",
      answer: "No. Las clases de prueba no incluyen inmersión en hielo al final, independiente de si ya has hecho baños de hielo antes o no. Esto es parte del proceso para que primero conozcas el espacio, la práctica y cómo trabajamos. Si te interesa el hielo, te invitamos a agendar una sesión del Método Wim Hof."
    },
    {
      question: "¿Puedo acceder al agua fría después de una clase de yoga pagada?",
      answer: "Sí, pero con condiciones. Para poder terminar una clase de yoga en el agua fría debes haber realizado previamente una sesión guiada del Método Wim Hof con nosotros. Esto aplica aunque ya hayas hecho baños de hielo en otro lugar, ya que necesitamos asegurarnos de que conozcas nuestra forma de trabajar y que sea una experiencia segura para ti. El tiempo máximo de inmersión después de yoga es de 2 minutos (esto es estricto), y la dinámica es entrar y salir para respetar el tiempo de la instructora y el flujo de la clase."
    },
    {
      question: "¿Qué debo llevar a mi primera clase?",
      answer: "Para Ice Bath o Wim Hof: traje de baño (ojalá ya puesto), toalla, bolsa para ropa mojada y buena actitud. Para Yoga: ropa deportiva cómoda. Nosotros proporcionamos mats y todo el equipamiento necesario."
    },
    {
      question: "¿Cuánto dura cada sesión y qué incluye?",
      answer: "Las sesiones duran entre 60-90 minutos. Ice Bath incluye preparación con breathwork, inmersión supervisada y recuperación. Yoga incluye calentamiento, práctica completa y relajación final. Todas las clases incluyen orientación personalizada."
    },
    {
      question: "¿Puedo cancelar o reprogramar mi clase?",
      answer: "Sí, puedes cancelar hasta 2 horas antes de la clase sin penalización. Para reprogramar, contáctanos por WhatsApp. Las clases perdidas sin aviso no se reponen, pero somos flexibles en casos especiales."
    },
    {
      question: "¿Necesito experiencia previa en breathwork o yoga?",
      answer: "No necesitas experiencia previa. Nuestras clases están diseñadas para todos los niveles. Los coaches adaptan las técnicas según tu experiencia y objetivos personales."
    },
    {
      question: "¿Los beneficios del Ice Bath son inmediatos?",
      answer: "Muchas personas sienten beneficios desde la primera sesión: mayor energía, claridad mental y sensación de logro. Los beneficios a largo plazo (mejor sueño, menos estrés, mayor resistencia) se desarrollan con práctica regular."
    },
    {
      question: "¿Cuánto tiempo puedo estar en el agua fría?",
      answer: "Depende del contexto. En sesiones completas del Método Wim Hof puedes permanecer más tiempo, siempre siguiendo las instrucciones del instructor. Después de una clase de yoga, el máximo es de 2 minutos estrictos. Para principiantes, comenzamos con exposiciones cortas y vamos progresando gradualmente."
    },
    {
      question: "¿Qué temperatura tiene el agua del Ice Bath?",
      answer: "Mantenemos el agua entre 8-12°C, temperatura óptima para obtener beneficios terapéuticos sin riesgo. Los principiantes comienzan con exposiciones más cortas y gradualmente aumentan el tiempo."
    },
    {
      question: "¿Cómo me ayuda el breathwork en mi día a día?",
      answer: "El breathwork te enseña a regular tu sistema nervioso en tiempo real. Aprenderás técnicas para manejar estrés, aumentar energía cuando la necesites y calmarte en situaciones difíciles. Son herramientas que llevas contigo siempre."
    },
    {
      question: "¿Ofrecen clases privadas o solo grupales?",
      answer: "Ofrecemos ambas modalidades. Las clases grupales (máximo 8 personas) crean una energía especial de comunidad. Las sesiones privadas permiten atención 100% personalizada. Contáctanos para más información sobre tarifas privadas."
    },
    {
      question: "¿Qué pasa si tengo una lesión o limitación física?",
      answer: "Nuestros coaches están capacitados para adaptar las prácticas según tus necesidades. Informa cualquier lesión o limitación al agendar. El yoga y breathwork son especialmente beneficiosos para la recuperación cuando se practican correctamente."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Preguntas frecuentes | Nave Studio</title>
        <meta name="description" content="Resolvemos dudas sobre clases, hielo, breathwork, seguridad y reservas en Nave Studio." />
        <link rel="canonical" href="https://studiolanave.com/faq" />
        <meta property="og:title" content="Preguntas frecuentes sobre Ice Bath y Wim Hof | Nave Studio" />
        <meta property="og:description" content="Resolvemos tus dudas sobre inmersión en frío, breathwork, seguridad y reservas. Todo lo que necesitas saber." />
        <meta property="og:image" content="https://studiolanave.com/og-image.png" />
        <meta property="og:url" content="https://studiolanave.com/faq" />
        <meta property="og:type" content="website" />
      </Helmet>
      <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-primary mb-6">
              Preguntas Frecuentes
            </h1>
            <p className="text-lg md:text-xl text-neutral-mid mb-8 max-w-3xl mx-auto">
              Resolvemos todas tus dudas sobre nuestras clases, seguridad, equipamiento y más.
              Si no encuentras tu respuesta, escríbenos por WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl border border-border overflow-hidden shadow-light">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-neutral-light/50 transition-colors"
                  >
                    <h3 className="text-lg font-medium text-primary pr-4">
                      {faq.question}
                    </h3>
                    {openItems.includes(index) ? (
                      <ChevronUp className="w-5 h-5 text-secondary flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-secondary flex-shrink-0" />
                    )}
                  </button>
                  
                  {openItems.includes(index) && (
                    <div className="px-6 pb-5">
                      <p className="text-neutral-mid leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-heading text-primary mb-4">
            ¿Tienes más preguntas?
          </h2>
          <p className="text-neutral-mid mb-8 max-w-2xl mx-auto">
            Nuestro equipo está disponible para resolver cualquier duda específica sobre tu situación.
          </p>
          <a
            href="https://wa.me/56912345678"
            className="inline-flex items-center justify-center px-8 py-3 bg-secondary hover:bg-primary text-white font-medium rounded-lg transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </section>

      {/* FAQ Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "inLanguage": "es-CL",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })}
      </script>

      <Footer />
    </main>
    </>
  );
};

export default FAQ;