import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const seoData = {
  "/": {
    title: "Nave Studio | Centro de bienestar basado en ciencia en Las Condes",
    description: "Ice Bath, Breathwork Wim Hof, Yoga y biohacking. Reserva tu clase en Las Condes y regula tu sistema nervioso.",
    canonical: "https://studiolanave.com/"
  },
  "/experiencias": {
    title: "Experiencias: Ice Bath, Breathwork y Yoga | Nave Studio",
    description: "Explora nuestras sesiones guiadas: baño de hielo, respiración Wim Hof y Yoga. Resultados visibles desde la primera sesión.",
    canonical: "https://studiolanave.com/experiencias"
  },
  "/planes-precios": {
    title: "Planes y precios: membresías y sesiones | Nave Studio Las Condes",
    description: "Elige 1/semana, 2/semana o ilimitado. Ahorra con membresía. Reserva en línea en minutos.",
    canonical: "https://studiolanave.com/planes-precios"
  },
  "/coaches": {
    title: "Coaches certificados y equipo | Nave Studio",
    description: "Guías certificados en WHM, Yoga y movimiento. Conócenos y agenda con tu coach ideal.",
    canonical: "https://studiolanave.com/coaches"
  },
  "/contacto": {
    title: "Contacto y ubicación | Nave Studio Las Condes",
    description: "Escríbenos por WhatsApp y visita nuestro estudio en Antares 259, Las Condes. Agenda tu clase hoy.",
    canonical: "https://studiolanave.com/contacto"
  },
  "/blog": {
    title: "Blog: frío, respiración y longevidad | Nave Studio",
    description: "Artículos con ciencia aplicada a Ice Bath, WHM y bienestar. Aprende y mejora tu energía.",
    canonical: "https://studiolanave.com/blog"
  },
  "/faq": {
    title: "Preguntas frecuentes | Nave Studio",
    description: "Resolvemos dudas sobre clases, hielo, breathwork, seguridad y reservas.",
    canonical: "https://studiolanave.com/faq"
  },
  "/terminos": {
    title: "Términos de servicio | Nave Studio",
    description: "Términos de servicio de Nave Studio",
    canonical: "https://studiolanave.com/terminos"
  },
  "/privacidad": {
    title: "Política de privacidad | Nave Studio",
    description: "Política de privacidad de Nave Studio",
    canonical: "https://studiolanave.com/privacidad"
  },
  "/criomedicina-metodo-wim-hof": {
    title: "Criomedicina (Método Wim Hof) en Chile — Ice Bath & Breathwork | Nave Studio",
    description: "Sesiones guiadas de Método Wim Hof en Santiago (Las Condes): respiración + baño de hielo a 3 °C. Horarios, precios y reserva online.",
    canonical: "https://studiolanave.com/criomedicina-metodo-wim-hof"
  },
  "/criomedicina-ice-bath-en-grupo": {
    title: "Criomedicina en grupo — Ice Bath grupal con descuento | Nave Studio",
    description: "Experiencia grupal de criomedicina (Método Wim Hof) en Santiago. Descuentos especiales para grupos de 3-10 personas. Reserva tu cupo grupal.",
    canonical: "https://studiolanave.com/criomedicina-ice-bath-en-grupo"
  }
};

const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Nave Studio",
    "url": "https://studiolanave.com",
    "logo": "https://studiolanave.com/lovable-uploads/79b55bf0-58ef-4275-a156-4523124bd6b8.png",
    "sameAs": [
      "https://instagram.com/navestudio.cl"
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Antares 259",
      "addressLocality": "Las Condes",
      "addressRegion": "Región Metropolitana",
      "addressCountry": "CL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -33.4172,
      "longitude": -70.5885
    },
    "areaServed": {
      "@type": "City",
      "name": "Las Condes"
    },
    "priceRange": "$$",
    "inLanguage": "es-CL"
  },
  localBusiness: {
    "@context": "https://schema.org",
    "@type": "HealthAndBeautyBusiness",
    "name": "Nave Studio",
    "description": "Centro de bienestar basado en ciencia especializado en Ice Bath, Breathwork Wim Hof, Yoga y biohacking",
    "url": "https://studiolanave.com",
    "telephone": "+56987654321",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Antares 259",
      "addressLocality": "Las Condes",
      "addressRegion": "Región Metropolitana",
      "postalCode": "7550000",
      "addressCountry": "CL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -33.4172,
      "longitude": -70.5885
    },
    "openingHours": [
      "Mo-Fr 06:00-22:00",
      "Sa-Su 07:00-20:00"
    ],
    "priceRange": "$$",
    "areaServed": "Las Condes, Chile",
    "sameAs": [
      "https://instagram.com/navestudio.cl"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Servicios de bienestar",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Ice Bath",
            "description": "Sesiones de inmersión en frío para regulación del sistema nervioso"
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Service",
            "name": "Breathwork Wim Hof",
            "description": "Técnicas de respiración consciente para mejorar energía y reducir estrés"
          }
        },
        {
          "@type": "Service",
          "name": "Yoga",
          "description": "Clases de yoga para flexibilidad, fuerza y mindfulness"
        },
        {
          "@type": "Service",
          "name": "Biohacking",
          "description": "Optimización del rendimiento físico y mental"
        }
      ]
    },
    "inLanguage": "es-CL"
  }
};

export const SEOHead = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const pageData = seoData[currentPath as keyof typeof seoData] || seoData["/"];

  useEffect(() => {
    // Update page title and meta description
    document.title = pageData.title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', pageData.description);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageData.canonical);

    // Add structured data for current page
    const existingScript = document.querySelector('#seo-structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'seo-structured-data';
    script.type = 'application/ld+json';
    
    if (currentPath === "/") {
      script.textContent = JSON.stringify([structuredData.organization, structuredData.localBusiness]);
    } else {
      script.textContent = JSON.stringify([
        structuredData.organization,
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Inicio",
              "item": "https://studiolanave.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": pageData.title.split(" | ")[0],
              "item": pageData.canonical
            }
          ]
        }
      ]);
    }
    
    document.head.appendChild(script);
  }, [currentPath, pageData]);

  return null;
};