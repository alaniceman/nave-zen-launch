import { useState, useEffect } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

type NavLink = { label: string; href: string }
type NavDropdown = { label: string; type: "dropdown"; children: NavLink[] }
type NavDirect = { label: string; href: string; type: "link" }
type NavItem = NavDropdown | NavDirect

const navigationItems: NavItem[] = [
  {
    label: "Experiencias",
    type: "dropdown",
    children: [
      { label: "Yoga en Las Condes", href: "/yoga-las-condes" },
      { label: "Criomedicina y Método Wim Hof", href: "/criomedicina-metodo-wim-hof-las-condes" },
      { label: "Todas las experiencias", href: "/experiencias" },
      { label: "Coaches", href: "/coaches" },
    ],
  },
  { label: "Horarios", href: "/horarios", type: "link" },
  {
    label: "Planes",
    type: "dropdown",
    children: [
      { label: "Membresías y Precios", href: "/planes-precios" },
      { label: "Paquete de sesiones", href: "/bonos" },
      { label: "Gift Cards", href: "/giftcards" },
    ],
  },
  { label: "Blog", href: "/blog", type: "link" },
  { label: "Contacto", href: "/contacto", type: "link" },
]

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close all dropdowns on outside click
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('[data-nav-dropdown]') && !target.closest('[data-nav-menu]')) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [])

  const navigateTo = (href: string) => {
    window.location.href = href
    setIsMobileMenuOpen(false)
    setOpenDropdown(null)
  }

  const toggleDropdown = (label: string) => {
    setOpenDropdown(prev => (prev === label ? null : label))
  }

  const toggleMobileSection = (label: string) => {
    setOpenMobileSection(prev => (prev === label ? null : label))
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
            onClick={() => (window.location.href = '/')}
            className="font-space-grotesk font-bold text-xl md:text-2xl text-primary hover:text-warm transition-colors duration-200 focus:outline-dashed focus:outline-2 focus:outline-secondary"
            aria-label="Ir al inicio"
          >
            NAVE Studio
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigationItems.map((item) =>
              item.type === "dropdown" ? (
                <div key={item.label} className="relative" data-nav-dropdown>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className="group inline-flex items-center gap-1 font-inter text-sm lg:text-base text-neutral-mid hover:text-warm transition-colors duration-200 focus:outline-dashed focus:outline-2 focus:outline-secondary"
                  >
                    {item.label}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openDropdown === item.label && (
                    <div
                      data-nav-menu
                      className="absolute left-0 mt-2 w-56 rounded-xl bg-background shadow-lg ring-1 ring-black/5 overflow-hidden z-50"
                    >
                      {item.children.map((child) => (
                        <a
                          key={child.href}
                          href={child.href}
                          onClick={(e) => { e.preventDefault(); navigateTo(child.href) }}
                          className="block px-4 py-3 text-foreground hover:bg-neutral-light transition-all duration-200 text-sm"
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.label}
                  onClick={() => navigateTo(item.href)}
                  className="group font-inter text-sm lg:text-base text-neutral-mid hover:text-warm transition-colors duration-200 relative focus:outline-dashed focus:outline-2 focus:outline-secondary"
                >
                  {item.label}
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-warm scale-x-0 origin-left transition-transform duration-200 group-hover:scale-x-100" />
                </button>
              )
            )}
          </nav>

          {/* Desktop CTA – Empezar dropdown (unchanged) */}
          <div className="relative hidden md:block" data-nav-dropdown>
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-secondary hover:bg-primary text-white font-inter font-medium px-6 py-2.5 rounded-[10px] transition-all duration-200 hover:scale-105 focus:outline-dashed focus:outline-2 focus:outline-secondary"
              aria-haspopup="menu"
              aria-expanded={openDropdown === "empezar" ? "true" : "false"}
              onClick={() => toggleDropdown("empezar")}
            >
              Empezar
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openDropdown === "empezar" ? "rotate-180" : ""}`} />
            </button>
            {openDropdown === "empezar" && (
              <div
                data-nav-menu
                role="menu"
                aria-label="Opciones de empezar"
                className="absolute right-0 mt-2 w-56 rounded-xl bg-background shadow-lg ring-1 ring-black/5 overflow-hidden z-50"
              >
                <a role="menuitem" href="/clase-de-prueba" className="block px-4 py-3 text-foreground hover:bg-neutral-light transition-all duration-200">Clase de prueba</a>
                <a role="menuitem" href="https://boxmagic.cl/crear_cuenta/NaveStudio" className="block px-4 py-3 text-foreground hover:bg-neutral-light transition-all duration-200">Registrarse</a>
                <a role="menuitem" href="https://members.boxmagic.app/a/g/Kp0MWKaL8x" className="block px-4 py-3 text-foreground hover:bg-neutral-light transition-all duration-200">Ingresar a la app</a>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-primary hover:text-warm transition-colors duration-200 focus:outline-dashed focus:outline-2 focus:outline-secondary"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
        <div className="absolute inset-0 bg-black/20" onClick={() => setIsMobileMenuOpen(false)} />
        <div
          className={`
            absolute right-0 top-0 h-full w-[72%] bg-background shadow-[0_4px_20px_rgba(0,0,0,0.15)]
            transform transition-transform duration-250 ease-out overflow-hidden
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="flex flex-col h-full max-h-screen">
            <div className="flex justify-between items-center p-4 border-b border-border flex-shrink-0">
              <span className="font-space-grotesk font-bold text-lg text-primary">Menú</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-primary hover:text-warm transition-colors duration-200" aria-label="Cerrar menú">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1">
                {navigationItems.map((item) =>
                  item.type === "dropdown" ? (
                    <li key={item.label}>
                      <button
                        onClick={() => toggleMobileSection(item.label)}
                        className="flex w-full items-center justify-between px-6 py-2.5 font-inter text-base text-neutral-dark hover:text-warm hover:bg-neutral-light transition-all duration-200"
                      >
                        {item.label}
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openMobileSection === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {openMobileSection === item.label && (
                        <ul className="bg-neutral-light/50">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <button
                                onClick={() => navigateTo(child.href)}
                                className="block w-full text-left pl-10 pr-6 py-2.5 font-inter text-sm text-neutral-mid hover:text-warm transition-all duration-200"
                              >
                                {child.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li key={item.label}>
                      <button
                        onClick={() => navigateTo(item.href)}
                        className="block w-full text-left px-6 py-2.5 font-inter text-base text-neutral-dark hover:text-warm hover:bg-neutral-light transition-all duration-200"
                      >
                        {item.label}
                      </button>
                    </li>
                  )
                )}
              </ul>

              {/* Action buttons */}
              <div className="mt-6 px-6 space-y-2.5">
                <a href="/clase-de-prueba" className="block w-full bg-warm hover:bg-forest text-white font-inter font-medium py-2.5 rounded-[10px] transition-all duration-200 text-center text-sm">Clase de prueba</a>
                <a href="https://boxmagic.cl/crear_cuenta/NaveStudio" className="block w-full bg-primary hover:bg-secondary text-white font-inter font-medium py-2.5 rounded-[10px] transition-all duration-200 text-center text-sm">Registrarse</a>
                <a href="https://members.boxmagic.app/a/g/Kp0MWKaL8x" className="block w-full bg-secondary hover:bg-primary text-white font-inter font-medium py-2.5 rounded-[10px] transition-all duration-200 text-center text-sm">Ingresar a la app</a>
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className={isScrolled ? 'h-16' : 'h-22'} />
    </>
  )
}
