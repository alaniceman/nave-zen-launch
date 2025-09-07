import { MessageCircle } from "lucide-react"
import { useState } from "react"

const WhatsAppWidget = () => {
  const [isHovered, setIsHovered] = useState(false)
  
  const handleWhatsAppClick = () => {
    const phoneNumber = "56946120426"
    const message = "¡Hola! Me interesa conocer más sobre las clases en Nave Studio"
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-[#25d366] hover:bg-[#128c7e] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-pulse hover:animate-none focus:outline-none focus:ring-4 focus:ring-[#25d366]/30"
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
        
        {/* Tooltip */}
        <div className={`absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap transition-all duration-200 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          ¡Escríbenos por WhatsApp!
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </button>
    </div>
  )
}

export { WhatsAppWidget }