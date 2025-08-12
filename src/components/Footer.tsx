import { Instagram, MessageCircle } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {/* Column 1: Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <a href="#home" className="text-2xl font-space font-bold tracking-heading">
              NAVE <span className="font-light">Studio</span>
            </a>
            <p className="mt-3 text-sm max-w-xs font-inter">
              Sanos, fuertes y felices — bienestar basado en ciencia.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <nav className="text-sm flex flex-col gap-2 font-inter">
            <a 
              href="/experiencias" 
              className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
            >
              Experiencias
            </a>
            <a 
              href="/planes" 
              className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
            >
              Planes & Precios
            </a>
            <a 
              href="/coaches" 
              className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
            >
              Coaches
            </a>
            <a 
              href="/contacto" 
              className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
            >
              Contacto
            </a>
          </nav>

          {/* Column 3: Contact */}
          <div className="text-sm font-inter md:col-span-2 lg:col-span-1">
            <p className="mb-2">
              <a 
                href="https://maps.app.goo.gl/oW6G58gLd5oYWmGn8"
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
                href="https://wa.me/56985273088" 
                className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
              >
                +56 9 8527 3088
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
                href="https://wa.me/56985273088" 
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
          © 2025 Nave Studio. Todos los derechos reservados ·{" "}
          <a 
            href="/terminos" 
            className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
          >
            Términos de servicio
          </a>{" "}
          ·{" "}
          <a 
            href="/privacidad" 
            className="text-accent hover:text-warm transition-colors duration-200 focus:outline-2 focus:outline-dashed focus:outline-accent"
          >
            Política de privacidad
          </a>
        </div>
      </div>
    </footer>
  )
}

export { Footer }