import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

interface Promo {
  id: string;
  expiresAt: string;
  content: string;
}

const PROMOS: Promo[] = [
  {
    id: "icefest",
    expiresAt: "2026-04-01",
    content: `### Promo actual: Icefest 🧊
6 sesiones de Criomedicina por $60.000 ($10.000/sesión). Válido por tiempo limitado. Info en [Icefest](https://studiolanave.com/icefest)`,
  },
  {
    id: "marzo-reset",
    expiresAt: "2026-04-01",
    content: `### Promo Marzo Reset
- 2 sesiones de Criomedicina: $40.000
- 3 sesiones de Criomedicina: $50.000
Válido 6 meses, compartible. Solo hasta el 31 de marzo. Info en [Bonos](https://studiolanave.com/bonos)`,
  },
  {
    id: "planes-anuales-2026",
    expiresAt: "2026-05-01",
    content: `### Planes Anuales 2026 (oferta vigente)
- Compromiso anual con hasta 2 meses gratis
- Entradas Icefest incluidas
- 12 cuotas sin interés
Info en: [Ver planes anuales](https://studiolanave.com/anual)`,
  },
  {
    id: "bautizo-hielo",
    expiresAt: "2026-06-01",
    content: `### 🧊 Promo Bautizo de Hielo (¡NUEVO!)
- **Tu primera sesión de Criomedicina por $15.000** (antes $30.000, 50% OFF)
- 1 sesión guiada de Método Wim Hof: Breathwork + 2 min en agua a 3°C
- Ideal para quienes nunca han hecho una sesión con nosotros
- Válido 60 días, también disponible como Gift Card para regalar
Info y compra en: [Bautizo de Hielo](https://studiolanave.com/bautizo-hielo)`,
  },
];

function getActivePromos(): string {
  const now = new Date();
  const chileDate = new Date(now.toLocaleString("en-US", { timeZone: "America/Santiago" }));
  const active = PROMOS.filter((p) => {
    const expires = new Date(p.expiresAt + "T00:00:00");
    return chileDate < expires;
  });
  if (active.length === 0) return "";
  return "\n\n" + active.map((p) => p.content).join("\n\n");
}

const FALLBACK_PROMPT = `Eres "Nave AI", asistente de Nave Studio en Las Condes, Santiago de Chile.
Responde solo sobre Nave Studio. Para precios y reservas redirige a [planes y precios](https://studiolanave.com/planes-precios) o [WhatsApp](https://wa.me/56946120426).`;

/* ── Live data from DB ── */
async function buildLiveDataSection(): Promise<string> {
  const sections: string[] = [];

  try {
    // Membership plans (live)
    const { data: plans } = await supabaseAdmin
      .from("membership_plans")
      .select("name, description, price_clp, original_price_clp, frequency, classes_included, plan_type, duration_days")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (plans && plans.length > 0) {
      const memberships = plans.filter((p: any) => p.plan_type !== "trial");
      const trials = plans.filter((p: any) => p.plan_type === "trial");

      if (memberships.length > 0) {
        const lines = memberships.map((p: any) => {
          const price = `$${p.price_clp.toLocaleString("es-CL")}`;
          const orig = p.original_price_clp ? ` (antes $${p.original_price_clp.toLocaleString("es-CL")})` : "";
          return `- **${p.name}**: ${price}${orig} — ${p.description || ""}`;
        }).join("\n");
        sections.push(`### Membresías y planes (datos en vivo)\n${lines}\nVer todos en: [Planes y precios](https://studiolanave.com/planes-precios)`);
      }

      if (trials.length > 0) {
        const lines = trials.map((p: any) => {
          const price = `$${p.price_clp.toLocaleString("es-CL")}`;
          const orig = p.original_price_clp ? ` (antes $${p.original_price_clp.toLocaleString("es-CL")})` : "";
          return `- **${p.name}** (${p.duration_days} días): ${price}${orig}`;
        }).join("\n");
        sections.push(`### Planes de prueba activos (datos en vivo)\n${lines}\nActivar en: [Plan de prueba](https://studiolanave.com/plan-de-prueba)`);
      }
    }

    // Active session packages
    const { data: packages } = await supabaseAdmin
      .from("session_packages")
      .select("name, sessions_quantity, price_clp, validity_days, description")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (packages && packages.length > 0) {
      const lines = packages.map((p: any) =>
        `- **${p.name}** (${p.sessions_quantity} sesiones): $${p.price_clp.toLocaleString("es-CL")} — válido ${p.validity_days} días`
      ).join("\n");
      sections.push(`### Paquetes/Bonos disponibles (datos en vivo)\n${lines}\nComprar en: [Bonos](https://studiolanave.com/bonos)`);
    }
  } catch (e) {
    console.error("Error loading live data:", e);
  }

  return sections.length > 0 ? "\n\n" + sections.join("\n\n") : "";
}

/* ── Editable knowledge base from DB ── */
async function buildKnowledgeSection(): Promise<string> {
  try {
    const { data, error } = await supabaseAdmin
      .from("ai_knowledge")
      .select("title, content, priority")
      .eq("is_active", true)
      .order("priority", { ascending: false });

    if (error) {
      console.error("ai_knowledge query error:", error);
      return "";
    }
    if (!data || data.length === 0) return "";

    return data.map((row: any) => row.content).join("\n\n");
  } catch (e) {
    console.error("Error loading ai_knowledge:", e);
    return "";
  }
}

export async function buildSystemPrompt(): Promise<string> {
  const [knowledge, liveData] = await Promise.all([
    buildKnowledgeSection(),
    buildLiveDataSection(),
  ]);

  const promos = getActivePromos();

  if (!knowledge) {
    // Safety fallback if DB is empty
    return FALLBACK_PROMPT + liveData + promos;
  }

  return knowledge + liveData + promos;
}
