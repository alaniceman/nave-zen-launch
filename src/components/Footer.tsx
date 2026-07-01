import { Instagram, MessageCircle } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <a href="https://studiolanave.com/" className="text-2xl font-space font-bold tracking-heading">
              NAVE <span className="font-light">Studio</span>
            </a>
            <p className="mt-3 text-sm max-w-xs font-inter">
              Sanos, fuertes y felices — bienestar basado en ciencia.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <nav className="text-sm flex flex-col gap-2 font-inter">
            <a 
              href="https://studiolanave.com/experiencias" 
              className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
            >
              Experiencias
            </a>
            <a 
              href="https://studiolanave.com/criomedicina-metodo-wim-hof" 
              className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
            >
              Criomedicina
            </a>
            <a 
              href="https://studiolanave.com/horarios" 
              className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
            >
              Horarios
            </a>
            <a 
              href="https://studiolanave.com/planes-precios" 
              className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
            >
              Planes & Precios
            </a>
            <a 
              href="https://studiolanave.com/giftcards" 
              className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
            >
              Gift Cards
            </a>
            <a 
              href="https://studiolanave.com/coaches" 
              className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
            >
              Coaches
            </a>
            <a 
              href="https://studiolanave.com/contacto" 
              className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
            >
              Contacto y Ubicación
            </a>
            <a 
              href="https://studiolanave.com/faq" 
              className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
            >
              FAQ
            </a>
            <a 
              href="https://cualesmi.boxmagic.app/members/" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
            >
              Descargar App
            </a>
          </nav>

          {/* Column 3: Más de la Nave */}
          <div className="text-sm font-inter">
            <p className="font-semibold mb-3 text-white/90">Más de la Nave</p>
            <div className="flex flex-col gap-2">
              <a
                href="https://crionave.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
              >
                Compra tu bañera de hielo
              </a>
              <a
                href="https://retiro.criomedicina.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
              >
                Retiro de invierno Wim Hof
              </a>
              <a
                href="https://guatemala.criomedicina.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
              >
                Retiro Guatemala
              </a>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="text-sm font-inter md:col-span-2 lg:col-span-1">
            <p className="mb-2">
              <a 
                href="https://maps.app.goo.gl/PvKkqNvETsDZEAGFA"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-white transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
              >
                Antares 259, Las Condes
              </a>
            </p>
            <p className="mb-2">
              WhatsApp:{" "}
              <a 
                href="https://wa.me/56946120426" 
                className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
              >
                +56 9 4612 0426
              </a>
            </p>
            <p className="mb-4">
              Instagram:{" "}
              <a 
                href="https://www.instagram.com/nave.icestudio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
              >
                @nave.icestudio
              </a>
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/nave.icestudio" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-warm hover:scale-110 transition-all duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/56946120426" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-warm hover:scale-110 transition-all duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/20 mt-10 pt-6 text-xs text-center font-inter">
          © {new Date().getFullYear()} Nave Studio. Todos los derechos reservados ·{" "}
          <a 
            href="https://studiolanave.com/terminos" 
            className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
          >
            Términos de servicio
          </a>{" "}
          ·{" "}
          <a 
            href="https://studiolanave.com/privacidad" 
            className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
          >
            Política de privacidad
          </a>{" "}
          ·{" "}
          <a 
            href="https://studiolanave.com/reglas-nave-studio" 
            className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
          >
            Reglas Nave Studio
          </a>
        </div>
      </div>
    </footer>
  )
}

export { Footer }