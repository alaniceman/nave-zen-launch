import { Footer } from "@/components/Footer";

const Terminos = () => {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading text-primary mb-6">
              Términos de Servicio
            </h1>
            <p className="text-lg text-neutral-mid">
              Última actualización: Enero 2025
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="bg-white rounded-xl p-8 shadow-light border border-border space-y-8">
              
              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">1. Aceptación de Términos</h2>
                <p className="text-neutral-mid leading-relaxed">
                  Al acceder y utilizar los servicios de Nave Studio, ubicado en Antares 259, Las Condes, Chile, 
                  aceptas estos términos de servicio en su totalidad. Si no estás de acuerdo con estos términos, 
                  no utilices nuestros servicios.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">2. Servicios Ofrecidos</h2>
                <p className="text-neutral-mid leading-relaxed mb-4">
                  Nave Studio ofrece servicios de bienestar que incluyen:
                </p>
                <ul className="list-disc pl-6 text-neutral-mid space-y-2">
                  <li>Sesiones de Ice Bath (inmersión en frío)</li>
                  <li>Clases de Breathwork y método Wim Hof</li>
                  <li>Clases de Yoga</li>
                  <li>Programas de biohacking y optimización del rendimiento</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">3. Responsabilidad y Riesgos</h2>
                <p className="text-neutral-mid leading-relaxed mb-4">
                  Al participar en nuestras actividades, reconoces que:
                </p>
                <ul className="list-disc pl-6 text-neutral-mid space-y-2">
                  <li>Las actividades físicas conllevan riesgos inherentes</li>
                  <li>Debes consultar con un médico antes de participar si tienes condiciones de salud</li>
                  <li>Participas bajo tu propia responsabilidad</li>
                  <li>Nave Studio no se hace responsable por lesiones derivadas del mal uso de las instalaciones</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">4. Contraindicaciones</h2>
                <p className="text-neutral-mid leading-relaxed mb-4">
                  No debes participar en Ice Bath si tienes:
                </p>
                <ul className="list-disc pl-6 text-neutral-mid space-y-2">
                  <li>Problemas cardíacos graves</li>
                  <li>Presión arterial descontrolada</li>
                  <li>Embarazo</li>
                  <li>Epilepsia no controlada</li>
                  <li>Trastornos de la alimentación severos</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">5. Política de Cancelaciones</h2>
                <ul className="list-disc pl-6 text-neutral-mid space-y-2">
                  <li>Cancelaciones hasta 2 horas antes: sin penalización</li>
                  <li>Cancelaciones con menos de 2 horas: pérdida de la clase</li>
                  <li>No-shows: pérdida de la clase</li>
                  <li>Emergencias médicas: evaluación caso a caso</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">6. Membresías y Pagos</h2>
                <ul className="list-disc pl-6 text-neutral-mid space-y-2">
                  <li>Los pagos se procesan a través de plataformas seguras</li>
                  <li>Las membresías son intransferibles</li>
                  <li>No hay reembolsos por clases no utilizadas</li>
                  <li>Los precios pueden cambiar con 30 días de aviso</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">7. Comportamiento en el Estudio</h2>
                <ul className="list-disc pl-6 text-neutral-mid space-y-2">
                  <li>Respetar a otros participantes y coaches</li>
                  <li>Seguir las instrucciones de seguridad</li>
                  <li>Mantener las instalaciones limpias</li>
                  <li>Llegar puntualmente a las clases</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">8. Privacidad y Datos</h2>
                <p className="text-neutral-mid leading-relaxed">
                  Protegemos tu información personal según nuestra política de privacidad. 
                  No compartimos datos con terceros sin tu consentimiento explícito.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">9. Modificaciones</h2>
                <p className="text-neutral-mid leading-relaxed">
                  Nos reservamos el derecho de modificar estos términos. 
                  Los cambios serán notificados con al menos 15 días de anticipación.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">10. Contacto</h2>
                <p className="text-neutral-mid leading-relaxed">
                  Para consultas sobre estos términos, contáctanos en:
                  <br />
                  WhatsApp: +56 9 1234 5678
                  <br />
                  Dirección: Antares 259, Las Condes, Chile
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Terminos;