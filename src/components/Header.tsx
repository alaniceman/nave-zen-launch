import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CheckoutRedirectButton } from "@/components/CheckoutRedirectButton"

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('[aria-controls="start-menu"]') && !target.closest('#start-menu')) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [])

  const navigationLinks = [
    { label: "Experiencias", href: "/experiencias", isExternal: true },
    { label: "Criomedicina", href: "/criomedicina-metodo-wim-hof", isExternal: true },
    { label: "Horarios", href: "/horarios", isExternal: true },
    { label: "Planes & Precios", href: "/planes-precios", isExternal: true },
    { label: "Coaches", href: "/coaches", isExternal: true },
    { label: "Blog", href: "/blog", isExternal: true },
    { label: "Contacto", href: "/contacto", isExternal: true }
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
          <div className="relative hidden md:block">
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-primary text-white font-inter font-medium px-6 py-2.5 rounded-[10px] transition-all duration-200 hover:scale-105 focus:outline-dashed focus:outline-2 focus:outline-secondary"
              aria-haspopup="menu"
              aria-expanded={isDropdownOpen ? "true" : "false"}
              aria-controls="start-menu"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              Empezar
              <svg aria-hidden="true" className={`w-4 h-4 transition ${isDropdownOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20">
                <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.92 1.18l-4.25 3.37a.75.75 0 01-.92 0L5.21 8.41a.75.75 0 01.02-1.2z" fill="currentColor"/>
              </svg>
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div
                id="start-menu"
                role="menu"
                aria-label="Opciones de empezar"
                className="absolute right-0 mt-2 w-56 rounded-xl bg-background shadow-lg ring-1 ring-black/5 overflow-hidden z-50"
              >
                <a
                  role="menuitem"
                  href="https://members.boxmagic.app/"
                  className="block px-4 py-3 text-foreground hover:bg-neutral-light transition-all duration-200 focus:outline-dashed focus:outline-2 focus:outline-secondary"
                >
                  Ingresar a la app
                </a>
                <a
                  role="menuitem"
                  href="/clase-de-prueba"
                  className="block px-4 py-3 text-foreground hover:bg-neutral-light transition-all duration-200 focus:outline-dashed focus:outline-2 focus:outline-secondary"
                >
                  Clase de prueba
                </a>
              </div>
            )}
          </div>

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
            transform transition-transform duration-250 ease-out overflow-hidden
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="flex flex-col h-full max-h-screen">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b border-border flex-shrink-0">
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

            {/* Navigation Links - Scrollable */}
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => handleNavigation(link)}
                      className="block w-full text-left px-6 py-2.5 font-inter text-base text-neutral-dark hover:text-warm hover:bg-neutral-light transition-all duration-200"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile CTA - Fixed at bottom */}
            <div className="p-4 border-t border-border space-y-2.5 flex-shrink-0">
              <a
                href="https://members.boxmagic.app/"
                className="block w-full bg-secondary hover:bg-primary text-white font-inter font-medium py-2.5 rounded-[10px] transition-all duration-200 text-center text-sm"
              >
                Ingresar a la app
              </a>
              <a
                href="/clase-de-prueba"
                className="block w-full bg-warm hover:bg-forest text-white font-inter font-medium py-2.5 rounded-[10px] transition-all duration-200 text-center text-sm"
              >
                Clase de prueba
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content jump */}
      <div className={isScrolled ? 'h-16' : 'h-22'} />
    </>
  )
}