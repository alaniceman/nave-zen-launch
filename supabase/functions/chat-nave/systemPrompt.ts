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
    id: "promo-invierno",
    expiresAt: "2026-09-30",
    content: `### ❄️ Promo Invierno (¡vigente!)
- **6 sesiones por $60.000** ($10.000 c/u) — intercambiables entre Yoga (Vinyasa, Yin, Integral, Power) y Criomedicina / Método Wim Hof.
- Validez **3 meses**, compartibles con quien tú quieras.
- Está comprobado: 6 sesiones te ayudan a tolerar el frío el doble. El invierno deja de ser tema.
- Info y compra: [Promo Invierno](https://studiolanave.com/promo-invierno)`,
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
