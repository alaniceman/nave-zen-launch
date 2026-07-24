import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const seoData = {
  "/": {
    title: "Nave Studio | Ice Bath, Wim Hof y Yoga en Las Condes",
    description: "Ice Bath, Breathwork Wim Hof, Yoga y biohacking en Las Condes. Reserva tu clase y regula tu sistema nervioso.",
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
    title: "Términos y condiciones de servicio | Nave Studio",
    description: "Términos y condiciones de uso de los servicios de Nave Studio: reservas, cancelaciones, membresías, pagos y responsabilidades del usuario.",
    canonical: "https://studiolanave.com/terminos",
    ogTitle: "Términos y condiciones | Nave Studio",
    ogDescription: "Condiciones de reservas, cancelaciones, membresías y pagos de Nave Studio.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/privacidad": {
    title: "Política de privacidad y datos personales | Nave Studio",
    description: "Cómo Nave Studio recopila, usa y protege tus datos personales conforme a la Ley 19.628. Derechos, cookies y contacto para consultas de privacidad.",
    canonical: "https://studiolanave.com/privacidad",
    ogTitle: "Política de privacidad | Nave Studio",
    ogDescription: "Cómo protegemos tus datos personales y qué derechos tienes bajo la Ley 19.628 en Chile.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/criomedicina-metodo-wim-hof": {
    title: "Criomedicina Wim Hof en Santiago | Nave Studio",
    description: "Sesiones guiadas de Método Wim Hof en Las Condes: respiración + baño de hielo a 3 °C. Horarios, precios y reserva online.",
    canonical: "https://studiolanave.com/criomedicina-metodo-wim-hof",
    ogTitle: "Método Wim Hof en Chile — Ice Bath y Breathwork | Nave Studio",
    ogDescription: "Sesiones guiadas de respiración + baño de hielo a 3°C en Las Condes. Instructores certificados. Reserva online.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/criomedicina-ice-bath-en-grupo": {
    title: "Ice Bath grupal Wim Hof | Nave Studio",
    description: "Experiencia grupal de criomedicina (Método Wim Hof) en Santiago. Descuentos para grupos de 3-10 personas. Reserva tu cupo grupal.",
    canonical: "https://studiolanave.com/criomedicina-ice-bath-en-grupo",
    ogTitle: "Ice Bath grupal con descuento | Nave Studio",
    ogDescription: "Método Wim Hof para grupos de 3-10 personas. Descuentos especiales. Reserva tu cupo grupal.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/criomedicina-metodo-wim-hof-las-condes": {
    title: "Método Wim Hof en Las Condes | Nave Studio",
    description: "Vive el Método Wim Hof en Las Condes: respiración consciente + baño de hielo a 3 °C guiado por instructores certificados. Reserva tu sesión.",
    canonical: "https://studiolanave.com/criomedicina-metodo-wim-hof-las-condes",
    ogTitle: "Método Wim Hof en Las Condes | Nave Studio",
    ogDescription: "Respiración + Ice Bath a 3 °C con instructores certificados en Las Condes. Agenda tu sesión.",
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
  },
  "/san-valentin": {
    title: "San Valentín en Nave Studio | Regalo de bienestar en pareja",
    description: "Regala una experiencia distinta este San Valentín: sesión de Ice Bath, Wim Hof o Yoga en pareja en Nave Studio Las Condes.",
    canonical: "https://studiolanave.com/san-valentin",
    ogTitle: "San Valentín en Nave Studio — Bienestar en pareja",
    ogDescription: "Experiencia de Ice Bath, Wim Hof o Yoga en pareja este 14 de febrero en Las Condes.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/marzo-reset": {
    title: "Marzo Reset | Vuelve con energía a la rutina | Nave Studio",
    description: "Reinicia tu año en marzo con Ice Bath, Wim Hof y Yoga en Las Condes. Planes especiales para volver con energía y foco a tu rutina.",
    canonical: "https://studiolanave.com/marzo-reset",
    ogTitle: "Marzo Reset — Empieza el año con energía | Nave Studio",
    ogDescription: "Planes de marzo con Ice Bath, Wim Hof y Yoga para reiniciar tu año en Las Condes.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/dia-de-la-madre": {
    title: "Día de la Madre | Regala bienestar en Nave Studio",
    description: "Sorprende a mamá con una experiencia de bienestar en Nave Studio: Yoga, Ice Bath o Wim Hof con giftcards personalizadas en Las Condes.",
    canonical: "https://studiolanave.com/dia-de-la-madre",
    ogTitle: "Día de la Madre — Giftcards de bienestar | Nave Studio",
    ogDescription: "Regálale a mamá una experiencia de Yoga, Ice Bath o Wim Hof en Las Condes.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/promo-invierno": {
    title: "Promo de Invierno | Ice Bath y Wim Hof | Nave Studio",
    description: "Aprovecha nuestra promoción de invierno para vivir el Método Wim Hof y baños de hielo en Las Condes. Precios especiales por tiempo limitado.",
    canonical: "https://studiolanave.com/promo-invierno",
    ogTitle: "Promo de Invierno — Ice Bath y Wim Hof | Nave Studio",
    ogDescription: "Vive el Método Wim Hof e Ice Bath en Las Condes con precios especiales de invierno.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/anual": {
    title: "Plan Anual 2026 | Membresía Nave Studio Las Condes",
    description: "Membresía anual de Nave Studio: Yoga ilimitado, Ice Bath y Wim Hof en Las Condes con el mejor precio del año. Cupos limitados.",
    canonical: "https://studiolanave.com/anual",
    ogTitle: "Plan Anual 2026 | Nave Studio",
    ogDescription: "Membresía anual con el mejor precio: Yoga ilimitado, Ice Bath y Wim Hof en Las Condes.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/plan-de-prueba": {
    title: "Plan de prueba 7 o 15 días | Nave Studio Las Condes",
    description: "Accede a Yoga, Ice Bath, Wim Hof y Breathwork por 7 días ($9.900) o 15 días ($19.900) en Las Condes. Elige tu fecha de inicio.",
    canonical: "https://studiolanave.com/plan-de-prueba",
    ogTitle: "Plan de prueba 7 o 15 días | Nave Studio",
    ogDescription: "Prueba Yoga, Ice Bath y Wim Hof por 7 o 15 días en Las Condes desde $9.900.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/bonos": {
    title: "Bonos de sesiones | Packs Ice Bath, Wim Hof y Yoga | Nave Studio",
    description: "Compra packs de 5, 10 o más sesiones de Ice Bath, Wim Hof o Yoga en Nave Studio Las Condes con descuentos progresivos.",
    canonical: "https://studiolanave.com/bonos",
    ogTitle: "Bonos y packs de sesiones | Nave Studio",
    ogDescription: "Packs de sesiones con descuento para Ice Bath, Wim Hof y Yoga en Las Condes.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/giftcards": {
    title: "Giftcards de bienestar | Regala Nave Studio",
    description: "Regala una giftcard de Nave Studio: Yoga, Ice Bath, Wim Hof o membresías completas. Envío digital inmediato y personalizable.",
    canonical: "https://studiolanave.com/giftcards",
    ogTitle: "Giftcards de Nave Studio",
    ogDescription: "Regala una experiencia de Yoga, Ice Bath o Wim Hof. Envío digital inmediato.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/conoce-el-lugar": {
    title: "Conoce el estudio | Nave Studio Las Condes",
    description: "Recorre nuestras instalaciones: sala de Yoga, zona de Ice Bath, camarines y espacio de comunidad en Antares 259, Las Condes.",
    canonical: "https://studiolanave.com/conoce-el-lugar",
    ogTitle: "Conoce Nave Studio Las Condes",
    ogDescription: "Sala de Yoga, zona de Ice Bath y comunidad en Antares 259, Las Condes.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/icefest": {
    title: "IceFest | Festival de Ice Bath y Wim Hof | Nave Studio",
    description: "Vive IceFest en Nave Studio: sesiones grupales de Ice Bath, Wim Hof y comunidad en Las Condes. Cupos limitados.",
    canonical: "https://studiolanave.com/icefest",
    ogTitle: "IceFest — Festival de Ice Bath | Nave Studio",
    ogDescription: "Sesiones grupales de Ice Bath, Wim Hof y comunidad en Las Condes.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/bautizo-hielo": {
    title: "Bautizo de hielo | Tu primera sesión de Ice Bath | Nave Studio",
    description: "Vive tu primer baño de hielo con guía experta en Nave Studio Las Condes. Sesión introductoria segura y transformadora.",
    canonical: "https://studiolanave.com/bautizo-hielo",
    ogTitle: "Bautizo de hielo — Tu primer Ice Bath | Nave Studio",
    ogDescription: "Sesión introductoria de Ice Bath con guía experta en Las Condes.",
    ogImage: "https://studiolanave.com/og-image.png",
    ogType: "website"
  },
  "/tienda": {
    title: "Tienda | Merchandising y productos Nave Studio",
    description: "Compra productos oficiales de Nave Studio: ropa, accesorios y equipamiento para tu práctica de Ice Bath, Wim Hof y Yoga.",
    canonical: "https://studiolanave.com/tienda",
    ogTitle: "Tienda Nave Studio",
    ogDescription: "Productos oficiales de Nave Studio para tu práctica de bienestar.",
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
  const pageData = seoData[currentPath as keyof typeof seoData];

  // If this route isn't in the map, do nothing — let the page's own <Helmet>
  // set title / description / canonical / og tags. Prevents home metadata from
  // leaking to routes like /horarios, /instructor/:slug, /blog/:slug.
  if (!pageData) return null;

  const ogTitle = pageData.ogTitle || pageData.title;
  const ogDescription = pageData.ogDescription || pageData.description;
  const ogImage = pageData.ogImage || "https://studiolanave.com/og-image.png";
  const ogType = pageData.ogType || "website";

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://studiolanave.com/" },
      { "@type": "ListItem", "position": 2, "name": pageData.title.split(" | ")[0], "item": pageData.canonical }
    ]
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "¿Es seguro el Ice Bath?", "acceptedAnswer": { "@type": "Answer", "text": "El Ice Bath es seguro cuando se practica bajo supervisión de coaches certificados. Contraindicaciones: embarazo, problemas cardíacos graves, presión arterial descontrolada." } },
      { "@type": "Question", "name": "¿Tienen clase de prueba gratis?", "acceptedAnswer": { "@type": "Answer", "text": "No ofrecemos clases gratuitas. Contamos con Planes de Prueba pagados con acceso ilimitado por 7 días ($9.900) o 15 días ($19.900)." } },
      { "@type": "Question", "name": "¿El plan de prueba incluye agua fría (Ice Bath)?", "acceptedAnswer": { "@type": "Answer", "text": "Sí, incluye Yoga, Breathwork, Criomedicina y Método Wim Hof. Para entrar al agua fría necesitas una sesión guiada de Wim Hof previa (puede ser dentro del mismo plan)." } },
      { "@type": "Question", "name": "¿Qué debo llevar a mi primera clase?", "acceptedAnswer": { "@type": "Answer", "text": "Para Ice Bath o Wim Hof: traje de baño, toalla y bolsa para ropa mojada. Para Yoga: ropa deportiva cómoda. Nosotros proporcionamos mats." } },
      { "@type": "Question", "name": "¿Puedo cancelar o reagendar mi sesión?", "acceptedAnswer": { "@type": "Answer", "text": "Packs: cancelar/reagendar con 24h de anticipación. Membresías mensuales: cancelar con 6h desde la app, si no la clase se considera utilizada." } },
      { "@type": "Question", "name": "¿Qué temperatura tiene el agua del Ice Bath?", "acceptedAnswer": { "@type": "Answer", "text": "Mantenemos el agua entre 3-12°C, temperatura óptima para beneficios terapéuticos sin riesgo." } }
    ]
  };

  const membershipList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Membresías Nave Studio",
    "itemListElement": [
      { "@type": "Product", "name": "Membresía Solo Yoga", "description": "Yoga ilimitado en Nave Studio Las Condes.", "brand": { "@type": "Brand", "name": "Nave Studio" }, "offers": { "@type": "Offer", "priceCurrency": "CLP", "price": "69000", "availability": "https://schema.org/InStock", "url": "https://studiolanave.com/planes-precios" } },
      { "@type": "Product", "name": "Membresía Universo (Completa)", "description": "Yoga, Ice Bath y Wim Hof ilimitados en Las Condes.", "brand": { "@type": "Brand", "name": "Nave Studio" }, "offers": { "@type": "Offer", "priceCurrency": "CLP", "price": "129000", "availability": "https://schema.org/InStock", "url": "https://studiolanave.com/planes-precios" } },
      { "@type": "Product", "name": "Plan de Prueba 7 días", "description": "Acceso ilimitado por 7 días a Yoga, Ice Bath y Wim Hof.", "brand": { "@type": "Brand", "name": "Nave Studio" }, "offers": { "@type": "Offer", "priceCurrency": "CLP", "price": "9900", "availability": "https://schema.org/InStock", "url": "https://studiolanave.com/plan-de-prueba" } }
    ]
  };

  let ldPayload: unknown;
  if (currentPath === "/") {
    ldPayload = [structuredData.organization, structuredData.localBusiness];
  } else if (currentPath === "/faq") {
    ldPayload = [structuredData.organization, breadcrumb, faqPage];
  } else if (currentPath === "/planes-precios") {
    ldPayload = [structuredData.organization, breadcrumb, membershipList];
  } else {
    ldPayload = [structuredData.organization, breadcrumb];
  }

  return (
    <Helmet>
      <title>{pageData.title}</title>
      <meta name="description" content={pageData.description} />
      <link rel="canonical" href={pageData.canonical} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:url" content={pageData.canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
      <script type="application/ld+json">{JSON.stringify(ldPayload)}</script>
    </Helmet>
  );
};
