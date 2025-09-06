import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Footer } from "@/components/Footer"
import { TrialClassModal } from "@/components/TrialClassModal"
import { MapPin, Phone, Instagram, Clock } from "lucide-react"

const Contacto = () => {
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Construct WhatsApp message
    const message = `Hola! Mi nombre es ${formData.name}.
    
Email: ${formData.email}

Mensaje: ${formData.message}`
    
    // Create WhatsApp URL
    const whatsappURL = `https://wa.me/56946120426?text=${encodeURIComponent(message)}`
    
    // Open WhatsApp in new tab
    window.open(whatsappURL, '_blank')
    
    // Reset form
    setFormData({ name: "", email: "", message: "" })
  }

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      window.location.href = href
    }
  }

  return (
    <main className="min-h-screen" id="contacto">
      {/* Hero Section */}
      <section 
        className="relative h-[60vh] flex flex-col items-center justify-center text-center px-6 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(46, 77, 58, 0.5), rgba(46, 77, 58, 0.5)), url('/lovable-uploads/7abb4236-6843-43ff-b24a-755130061826.png')`,
        }}
      >
        <h1 className="text-4xl md:text-5xl font-heading text-white mb-4 animate-fade-in">
          Hablemos y sumérgete en la experiencia
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-xl animate-fade-in">
          Preguntas, reservas o simplemente curiosidad — estamos aquí para ayudarte.
        </p>
        <Button
          onClick={() => scrollToSection('#form-contacto')}
          className="mt-8 bg-secondary hover:bg-primary text-white py-3 px-8 rounded-[10px] transition-all duration-200 hover:scale-105 animate-fade-in"
        >
          Enviar mensaje
        </Button>
      </section>

      {/* Contact Info + Map Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div className="animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-heading text-primary mb-6">
                Dónde encontrarnos
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-neutral-mid mb-2">Antares 259, Las Condes, Santiago</p>
                    <a 
                      href="https://maps.app.goo.gl/oW6G58gLd5oYWmGn8" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-secondary underline hover:text-primary transition-colors duration-200"
                    >
                      Ver mapa en Google →
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div>
                    <span className="font-medium text-neutral-dark">WhatsApp: </span>
                    <a 
                      href="https://wa.me/56946120426" 
                      className="text-secondary underline hover:text-primary transition-colors duration-200"
                    >
                      +56 9 4612 0426
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Instagram className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div>
                    <span className="font-medium text-neutral-dark">Instagram: </span>
                    <a 
                      href="https://www.instagram.com/nave.icestudio" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-secondary underline hover:text-primary transition-colors duration-200"
                    >
                      @nave.icestudio
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-secondary flex-shrink-0" />
                  <p className="text-neutral-dark">
                    <span className="font-medium">Horarios: </span>
                    Lun–Dom · 07:00 – 20:00 h
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col md:flex-row gap-4 mt-10">
                <Button
                  onClick={() => scrollToSection('/planes')}
                  className="bg-secondary hover:bg-primary text-white py-3 px-6 rounded-[10px] transition-all duration-200 hover:scale-105"
                >
                  Ver planes
                </Button>
                <Button
                  onClick={() => scrollToSection('/coaches')}
                  variant="outline"
                  className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white py-3 px-6 rounded-[10px] transition-all duration-200 hover:scale-105"
                >
                  Conocer coaches
                </Button>
              </div>
            </div>

            {/* Map */}
            <div className="animate-fade-in">
              <div className="relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3328.4234567890123!2d-70.61234567890123!3d-33.41234567890123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c5a1234567890%3A0x1234567890abcdef!2sAntares%20259%2C%20Las%20Condes%2C%20Regi%C3%B3n%20Metropolitana%2C%20Chile!5e0!3m2!1sen!2scl!4v1234567890123!5m2!1sen!2scl"
                  width="100%" 
                  height="320" 
                  loading="lazy"
                  className="rounded-[10px] shadow-lg border-0"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Nave Studio"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="form-contacto" className="bg-neutral-light py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-center text-2xl md:text-3xl font-heading text-primary mb-8 animate-fade-in">
            Envíanos un mensaje
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            <div>
              <Input
                type="text"
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-neutral-light rounded-[10px] py-3 px-4 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all duration-200"
                aria-label="Nombre completo"
              />
            </div>
            
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-neutral-light rounded-[10px] py-3 px-4 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all duration-200"
                aria-label="Correo electrónico"
              />
            </div>
            
            <div>
              <Textarea
                name="message"
                placeholder="¿Cómo podemos ayudarte?"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full bg-white border border-neutral-light rounded-[10px] py-3 px-4 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 resize-none transition-all duration-200"
                aria-label="Mensaje"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-primary text-white py-3 px-8 rounded-[10px] transition-all duration-200 hover:scale-105 font-medium"
            >
              Enviar WhatsApp
            </Button>
          </form>
        </div>
      </section>

      {/* Free Trial CTA Section */}
      <section className="py-20 px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-heading text-primary mb-4">
            ¿Quieres vivir Nave Studio antes de decidir?
          </h2>
          <p className="text-neutral-mid mb-8 max-w-lg mx-auto leading-relaxed">
            Agenda una clase gratuita de Yoga y siente la energía del espacio.
          </p>
          <Button
            onClick={() => setIsTrialModalOpen(true)}
            className="bg-secondary hover:bg-primary text-white py-3 px-10 rounded-[10px] transition-all duration-200 hover:scale-105"
          >
            Reservar clase de prueba
          </Button>
        </div>
      </section>

      
      <TrialClassModal 
        isOpen={isTrialModalOpen} 
        onClose={() => setIsTrialModalOpen(false)} 
      />
      
      <Footer />
    </main>
  )
}

export default Contacto