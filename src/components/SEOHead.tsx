import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const seoData = {
  "/": {
    title: "Nave Studio | Centro de bienestar basado en ciencia en Las Condes",
    description: "Ice Bath, Breathwork Wim Hof, Yoga y biohacking. Reserva tu clase en Las Condes y regula tu sistema nervioso.",
    canonical: "https://studiolanave.com/",
    ogTitle: "Nave Studio | Ice Bath, Breathwork y Yoga en Las Condes",
    ogDescription: "Centro de bienestar basado en ciencia. Regula tu sistema nervioso con Método Wim Hof, baños de hielo y yoga. Plan de prueba 7 días por $9.900.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/experiencias": {
    title: "Experiencias: Ice Bath, Breathwork y Yoga | Nave Studio",
    description: "Explora nuestras sesiones guiadas: baño de hielo, respiración Wim Hof y Yoga. Resultados visibles desde la primera sesión.",
    canonical: "https://studiolanave.com/experiencias",
    ogTitle: "Ice Bath, Breathwork Wim Hof y Yoga | Nave Studio",
    ogDescription: "Sesiones guiadas de inmersión en frío, respiración consciente y yoga. Resultados desde la primera clase. Reserva tu experiencia.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/planes-precios": {
    title: "Planes y precios: membresías y sesiones | Nave Studio Las Condes",
    description: "Elige 1/semana, 2/semana o ilimitado. Ahorra con membresía. Reserva en línea en minutos.",
    canonical: "https://studiolanave.com/planes-precios",
    ogTitle: "Planes desde 1x/semana hasta ilimitado | Nave Studio",
    ogDescription: "Membresías flexibles y sesiones individuales. Ahorra hasta 40% con suscripción. Reserva online en minutos.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/coaches": {
    title: "Coaches certificados y equipo | Nave Studio",
    description: "Guías certificados en WHM, Yoga y movimiento. Conócenos y agenda con tu coach ideal.",
    canonical: "https://studiolanave.com/coaches",
    ogTitle: "Coaches certificados en Wim Hof, Yoga y Bienestar | Nave Studio",
    ogDescription: "Guías certificados en Método Wim Hof, Yoga Alliance y movimiento consciente. Conoce a tu coach ideal.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/contacto": {
    title: "Contacto y ubicación | Nave Studio Las Condes",
    description: "Escríbenos por WhatsApp y visita nuestro estudio en Antares 259, Las Condes. Agenda tu clase hoy.",
    canonical: "https://studiolanave.com/contacto",
    ogTitle: "Contacto | Nave Studio en Antares 259, Las Condes",
    ogDescription: "Escríbenos por WhatsApp o visítanos. Estamos en Antares 259, Las Condes. Agenda tu clase hoy.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/blog": {
    title: "Blog: frío, respiración y longevidad | Nave Studio",
    description: "Artículos con ciencia aplicada a Ice Bath, WHM y bienestar. Aprende y mejora tu energía.",
    canonical: "https://studiolanave.com/blog",
    ogTitle: "Blog: Ice Bath, Wim Hof y ciencia del bienestar | Nave Studio",
    ogDescription: "Artículos con ciencia aplicada a criomedicina, respiración y longevidad. Aprende y mejora tu energía.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/faq": {
    title: "Preguntas frecuentes | Nave Studio",
    description: "Resolvemos dudas sobre clases, hielo, breathwork, seguridad y reservas.",
    canonical: "https://studiolanave.com/faq",
    ogTitle: "Preguntas frecuentes sobre Ice Bath y Wim Hof | Nave Studio",
    ogDescription: "Resolvemos tus dudas sobre inmersión en frío, breathwork, seguridad y reservas. Todo lo que necesitas saber.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/terminos": {
    title: "Términos de servicio | Nave Studio",
    description: "Términos de servicio de Nave Studio",
    canonical: "https://studiolanave.com/terminos",
    ogTitle: "Términos de servicio | Nave Studio",
    ogDescription: "Términos y condiciones de servicio de Nave Studio.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/privacidad": {
    title: "Política de privacidad | Nave Studio",
    description: "Política de privacidad de Nave Studio",
    canonical: "https://studiolanave.com/privacidad",
    ogTitle: "Política de privacidad | Nave Studio",
    ogDescription: "Política de privacidad y protección de datos de Nave Studio.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/criomedicina-metodo-wim-hof": {
    title: "Criomedicina (Método Wim Hof) en Chile — Ice Bath & Breathwork | Nave Studio",
    description: "Sesiones guiadas de Método Wim Hof en Santiago (Las Condes): respiración + baño de hielo a 3 °C. Horarios, precios y reserva online.",
    canonical: "https://studiolanave.com/criomedicina-metodo-wim-hof",
    ogTitle: "Método Wim Hof en Chile — Ice Bath y Breathwork | Nave Studio",
    ogDescription: "Sesiones guiadas de respiración + baño de hielo a 3°C en Las Condes. Instructores certificados. Reserva online.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/criomedicina-ice-bath-en-grupo": {
    title: "Criomedicina en grupo — Ice Bath grupal con descuento | Nave Studio",
    description: "Experiencia grupal de criomedicina (Método Wim Hof) en Santiago. Descuentos especiales para grupos de 3-10 personas. Reserva tu cupo grupal.",
    canonical: "https://studiolanave.com/criomedicina-ice-bath-en-grupo",
    ogTitle: "Ice Bath grupal con descuento — Criomedicina en grupo | Nave Studio",
    ogDescription: "Experiencia de Método Wim Hof para grupos de 3-10 personas. Descuentos especiales. Reserva tu cupo grupal ahora.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/yoga-las-condes": {
    title: "Yoga en Las Condes | Yin, Vinyasa, Power Yoga | Nave Studio",
    description: "Clases de Yoga en Las Condes, Santiago. Yin, Vinyasa, Power e Integral Yoga con instructores certificados. Plan de prueba 7 días por $9.900. Antares 259.",
    canonical: "https://studiolanave.com/yoga-las-condes",
    ogTitle: "Yoga en Las Condes | Yin, Vinyasa, Power Yoga | Nave Studio",
    ogDescription: "Clases de Yoga en Las Condes. Prueba Yin, Vinyasa, Power e Integral Yoga. Plan de prueba 7 días por $9.900 en Antares 259.",
    ogImage: "https://studiolanave.com/lovable-uploads/82672388-9723-4aee-a1f2-ac72618cd26a.png",
    ogType: "website"
  },
  "/cyber-2025": {
    title: "Cyber La Nave 2025 — 80% OFF en Nave Studio Santiago",
    description: "Vive el poder del Método Wim Hof, Yoga y Biohacking con 80% de descuento por 2 meses. Solo del 6 al 8 de octubre en Nave Studio, Las Condes.",
    canonical: "https://studiolanave.com/cyber-2025",
    ogTitle: "🔥 Cyber La Nave 2025 — 80% OFF en entrenamientos de bienestar",
    ogDescription: "Solo quedan 4 cupos. Método Wim Hof, Ice Bath, Yoga y Biohacking a precio único. Termina el 8 de octubre. ⏰",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
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

    // Update Open Graph meta tags
    const ogTitle = pageData.ogTitle || pageData.title;
    const ogDescription = pageData.ogDescription || pageData.description;
    const ogImage = pageData.ogImage || "https://studiolanave.com/og-image.png";
    const ogType = pageData.ogType || "website";

    const updateOrCreateMeta = (property: string, content: string, isProperty = true) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Open Graph tags
    updateOrCreateMeta('og:title', ogTitle);
    updateOrCreateMeta('og:description', ogDescription);
    updateOrCreateMeta('og:url', pageData.canonical);
    updateOrCreateMeta('og:image', ogImage);
    updateOrCreateMeta('og:type', ogType);

    // Twitter Card tags
    updateOrCreateMeta('twitter:card', 'summary_large_image', false);
    updateOrCreateMeta('twitter:title', ogTitle, false);
    updateOrCreateMeta('twitter:description', ogDescription, false);
    updateOrCreateMeta('twitter:image', ogImage, false);

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