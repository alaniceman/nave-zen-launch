import { Footer } from "@/components/Footer";

const Privacidad = () => {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading text-primary mb-6">
              Política de Privacidad
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
                <h2 className="text-2xl font-heading text-primary mb-4">1. Información que Recopilamos</h2>
                <p className="text-neutral-mid leading-relaxed mb-4">
                  En Nave Studio recopilamos únicamente la información necesaria para brindar nuestros servicios:
                </p>
                <ul className="list-disc pl-6 text-neutral-mid space-y-2">
                  <li>Datos de contacto: nombre, teléfono, email</li>
                  <li>Información de salud relevante para la seguridad en nuestras actividades</li>
                  <li>Historial de clases y preferencias de servicios</li>
                  <li>Información de pago para procesar transacciones</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">2. Cómo Usamos tu Información</h2>
                <p className="text-neutral-mid leading-relaxed mb-4">
                  Utilizamos tu información exclusivamente para:
                </p>
                <ul className="list-disc pl-6 text-neutral-mid space-y-2">
                  <li>Programar y gestionar tus clases</li>
                  <li>Garantizar tu seguridad durante las actividades</li>
                  <li>Procesar pagos y gestionar membresías</li>
                  <li>Enviarte recordatorios y comunicaciones relacionadas con el servicio</li>
                  <li>Mejorar nuestros servicios basándose en tu feedback</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">3. Protección de Datos</h2>
                <p className="text-neutral-mid leading-relaxed mb-4">
                  Implementamos medidas de seguridad para proteger tu información:
                </p>
                <ul className="list-disc pl-6 text-neutral-mid space-y-2">
                  <li>Almacenamiento seguro en sistemas protegidos</li>
                  <li>Acceso limitado solo al personal autorizado</li>
                  <li>Encriptación de datos sensibles</li>
                  <li>Actualizaciones regulares de sistemas de seguridad</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">4. Compartir Información</h2>
                <p className="text-neutral-mid leading-relaxed mb-4">
                  No compartimos tu información personal con terceros, excepto:
                </p>
                <ul className="list-disc pl-6 text-neutral-mid space-y-2">
                  <li>Cuando sea requerido por ley</li>
                  <li>Con procesadores de pago para completar transacciones</li>
                  <li>En caso de emergencia médica, con servicios de salud</li>
                  <li>Con tu consentimiento explícito</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">5. Cookies y Tecnologías de Seguimiento</h2>
                <p className="text-neutral-mid leading-relaxed mb-4">
                  Nuestro sitio web utiliza cookies para:
                </p>
                <ul className="list-disc pl-6 text-neutral-mid space-y-2">
                  <li>Mejorar la experiencia de navegación</li>
                  <li>Recordar tus preferencias</li>
                  <li>Analizar el uso del sitio web</li>
                  <li>Facilitar el proceso de reserva</li>
                </ul>
                <p className="text-neutral-mid leading-relaxed mt-4">
                  Puedes desactivar las cookies en tu navegador, aunque esto puede afectar la funcionalidad del sitio.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">6. Tus Derechos</h2>
                <p className="text-neutral-mid leading-relaxed mb-4">
                  Tienes derecho a:
                </p>
                <ul className="list-disc pl-6 text-neutral-mid space-y-2">
                  <li>Acceder a tu información personal</li>
                  <li>Corregir datos inexactos</li>
                  <li>Solicitar la eliminación de tus datos</li>
                  <li>Limitar el procesamiento de tu información</li>
                  <li>Retirar tu consentimiento en cualquier momento</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">7. Retención de Datos</h2>
                <p className="text-neutral-mid leading-relaxed">
                  Conservamos tu información personal solo durante el tiempo necesario para los fines establecidos, 
                  o según lo requerido por la ley chilena. Los datos de salud se mantienen según las regulaciones 
                  sanitarias aplicables.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">8. Menores de Edad</h2>
                <p className="text-neutral-mid leading-relaxed">
                  Nuestros servicios están dirigidos a personas mayores de 18 años. 
                  Los menores de 18 años deben contar con autorización y supervisión de un tutor legal.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">9. Cambios en esta Política</h2>
                <p className="text-neutral-mid leading-relaxed">
                  Podemos actualizar esta política de privacidad ocasionalmente. 
                  Te notificaremos sobre cambios significativos por email o a través de nuestro sitio web.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-heading text-primary mb-4">10. Contacto</h2>
                <p className="text-neutral-mid leading-relaxed">
                  Si tienes preguntas sobre esta política de privacidad o quieres ejercer tus derechos, contáctanos:
                  <br />
                  WhatsApp: +56 9 1234 5678
                  <br />
                  Email: privacidad@navestudio.cl
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

export default Privacidad;