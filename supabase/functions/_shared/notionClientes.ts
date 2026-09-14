/**
 * Sincroniza clientes de plan de prueba con la tabla "Clientes" de Notion.
 * Gateway-backed: todas las llamadas van por el connector gateway de Lovable.
 */
const GATEWAY = "https://connector-gateway.lovable.dev/notion/v1";
const CLIENTES_DATA_SOURCE_ID = "649c6d6d-f397-83f9-9494-876631271540";

export type NotionPaymentMethod = "Pago online" | "Transferencia";

export interface NotionTrialClient {
  name: string;
  email: string;
  phone?: string | null;
  /** trial_7d | trial_15d */
  planType?: string | null;
  /** Fecha de inicio del plan de prueba (YYYY-MM-DD) */
  startDate?: string | null;
  /** Fecha de término del plan de prueba (YYYY-MM-DD) → Próximo Follow-Up */
  endDate?: string | null;
  /** Si aún no pagó, el Estado queda como "Lead" */
  paid: boolean;
  paymentMethod?: NotionPaymentMethod | null;
}

function headers() {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const notionKey = Deno.env.get("NOTION_API_KEY");
  if (!lovableKey) throw new Error("LOVABLE_API_KEY no configurada");
  if (!notionKey) throw new Error("NOTION_API_KEY no configurada");
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": notionKey,
    "Notion-Version": "2025-09-03",
    "Content-Type": "application/json",
  };
}

/** Formatea a "+56 9 1234 5678" cuando es un móvil chileno. */
export function formatWhatsapp(raw?: string | null): string | null {
  if (!raw) return null;
  let digits = raw.replace(/[^0-9]/g, "");
  if (digits.length === 8) digits = `569${digits}`;
  if (digits.length === 9 && digits.startsWith("9")) digits = `56${digits}`;
  if (digits.startsWith("56") && digits.length === 11) {
    const n = digits.slice(3); // 8 dígitos después del 9
    return `+56 9 ${n.slice(0, 4)} ${n.slice(4)}`;
  }
  return `+${digits}`;
}

const ESTADO_BY_PLAN: Record<string, string> = {
  trial_7d: "plan de prueba 7",
  trial_15d: "plan de prueba 15",
};
const PLAN_SELECT: Record<string, string> = {
  trial_7d: "7 días",
  trial_15d: "15 días",
};

async function notion(path: string, init: RequestInit) {
  const res = await fetch(`${GATEWAY}${path}`, { ...init, headers: headers() });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Notion [${res.status}]: ${text}`);
  }
  return text ? JSON.parse(text) : {};
}

async function findPageIdByEmail(email: string): Promise<string | null> {
  const data = await notion(`/data_sources/${CLIENTES_DATA_SOURCE_ID}/query`, {
    method: "POST",
    body: JSON.stringify({
      filter: { property: "Mail", email: { equals: email } },
      page_size: 1,
    }),
  });
  return data?.results?.[0]?.id ?? null;
}

function buildProperties(c: NotionTrialClient) {
  const estado = c.paid && c.planType && ESTADO_BY_PLAN[c.planType]
    ? ESTADO_BY_PLAN[c.planType]
    : "Lead";

  const props: Record<string, unknown> = {
    Nombre: { title: [{ text: { content: c.name || c.email } }] },
    Mail: { email: c.email },
    Estado: { multi_select: [{ name: estado }] },
    "Tipo de membresía": { multi_select: [{ name: "Plan de prueba" }] },
  };

  const whatsapp = formatWhatsapp(c.phone);
  if (whatsapp) props["Whatsapp"] = { phone_number: whatsapp };

  if (c.planType && PLAN_SELECT[c.planType]) {
    props["Plan de Prueba"] = { select: { name: PLAN_SELECT[c.planType] } };
  }

  // Fecha de ingreso = fecha en que inicia el plan de prueba
  if (c.startDate) props["Fecha Ingreso"] = { date: { start: c.startDate } };

  // Próximo follow-up = fecha de término del plan de prueba
  if (c.endDate) props["Próximo Follow-Up"] = { date: { start: c.endDate } };

  if (c.paid && c.paymentMethod) {
    props["Forma de pago"] = { select: { name: c.paymentMethod } };
  }

  return props;
}

/** Crea o actualiza el cliente en Notion. No lanza: registra y devuelve el resultado. */
export async function syncTrialClientToNotion(c: NotionTrialClient) {
  const email = c.email.toLowerCase().trim();
  try {
    const properties = buildProperties({ ...c, email });
    const existingId = await findPageIdByEmail(email);

    if (existingId) {
      await notion(`/pages/${existingId}`, {
        method: "PATCH",
        body: JSON.stringify({ properties }),
      });
      console.log(`[Notion] cliente actualizado: ${email}`);
      return { ok: true, action: "updated", pageId: existingId };
    }

    const page = await notion(`/pages`, {
      method: "POST",
      body: JSON.stringify({
        parent: { type: "data_source_id", data_source_id: CLIENTES_DATA_SOURCE_ID },
        properties,
      }),
    });
    console.log(`[Notion] cliente creado: ${email}`);
    return { ok: true, action: "created", pageId: page?.id ?? null };
  } catch (err) {
    console.error("[Notion] sync error:", err);
    return { ok: false, error: String(err) };
  }
}
