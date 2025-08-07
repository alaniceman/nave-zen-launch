import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Scroll detection for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navigationLinks = [
    { label: "Experiencias", href: "/experiencias", isExternal: true },
    { label: "Planes & Precios", href: "/planes", isExternal: true },
    { label: "Coaches", href: "/coaches", isExternal: true },
    { label: "Contacto", href: "#contacto" }
  ]

  const handleNavigation = (link: { href: string; isExternal?: boolean }) => {
    if (link.isExternal) {
      window.location.href = link.href
    } else {
      const element = document.querySelector(link.href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header 
        className={`
          fixed top-0 left-0 right-0 z-50 bg-background transition-all duration-300 ease-out
          ${isScrolled ? 'h-16 shadow-[0_4px_10px_rgba(0,0,0,0.08)]' : 'h-22'}
        `}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.location.href = '/'}
            className="font-space-grotesk font-bold text-xl md:text-2xl text-primary hover:text-warm transition-colors duration-200 focus:outline-dashed focus:outline-2 focus:outline-secondary"
            aria-label="Ir al inicio"
          >
            NAVE Studio
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavigation(link)}
                className="group font-inter text-sm lg:text-base text-neutral-mid hover:text-warm transition-colors duration-200 relative focus:outline-dashed focus:outline-2 focus:outline-secondary"
              >
                {link.label}
                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-warm scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100" />
              </button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Button
            onClick={() => handleNavigation({ href: '#reservar' })}
            className="hidden md:inline-flex bg-secondary hover:bg-primary text-white font-inter font-medium px-6 py-2.5 rounded-[10px] transition-all duration-200 hover:scale-105 focus:outline-dashed focus:outline-2 focus:outline-secondary"
          >
            Reservar clase
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-primary hover:text-warm transition-colors duration-200 focus:outline-dashed focus:outline-2 focus:outline-secondary"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden transition-opacity duration-250 ease-out
          ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Drawer */}
        <div
          className={`
            absolute right-0 top-0 h-full w-[72%] bg-background shadow-[0_4px_20px_rgba(0,0,0,0.15)]
            transform transition-transform duration-250 ease-out
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-6 border-b border-border">
              <span className="font-space-grotesk font-bold text-lg text-primary">
                Menú
              </span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-primary hover:text-warm transition-colors duration-200"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 py-8">
              <ul className="space-y-6">
                {navigationLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNavigation(link)}
                      className="block w-full text-left px-6 py-3 font-inter text-lg text-neutral-dark hover:text-warm hover:bg-neutral-light transition-all duration-200"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile CTA */}
            <div className="p-6 border-t border-border">
              <Button
                onClick={() => handleNavigation({ href: '#reservar' })}
                className="w-full bg-secondary hover:bg-primary text-white font-inter font-medium py-3 rounded-[10px] transition-all duration-200 hover:scale-105"
              >
                Reservar clase
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content jump */}
      <div className={isScrolled ? 'h-16' : 'h-22'} />
    </>
  )
}