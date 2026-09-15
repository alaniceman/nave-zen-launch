import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { getCorsHeaders } from "../_shared/cors.ts";

/**
 * Lee la tabla "Clientes" de Notion, detecta quiénes pasaron de plan de prueba
 * a membresía o a un paquete de sesiones, actualiza el panel y envía un reporte
 * de KPIs por correo.
 *
 * Body opcional: { dryRun?: boolean, to?: string[] }
 */

const GATEWAY = "https://connector-gateway.lovable.dev/notion/v1";
const CLIENTES_DATA_SOURCE_ID = "649c6d6d-f397-83f9-9494-876631271540";
const DEFAULT_TO = ["lanave@alaniceman.com"];

// Notion "Tipo de membresía" → nombre exacto en membership_plans
const MEMBERSHIP_MAP: Record<string, string> = {
  "universo": "Universo",
  "orbita": "Órbita",
  "misión órbita": "Órbita",
  "mision orbita": "Órbita",
  "eclipse": "Eclipse",
  "yoga esencial": "Yoga Esencial",
  "yoga continuo": "Yoga Continuo",
  "yoga libre": "Yoga Libre",
};

// Tipos que representan paquetes de sesiones (no membresía)
const PACKAGE_HINTS = [
  "sesion",
  "sesiones",
  "icefest",
  "ice fest",
  "marzo reset",
  "día de la madre",
  "dia de la madre",
  "dia del padre",
  "promo san valentín",
  "promo san valentin",
];

// Tipos que no se asignan automáticamente
const AMBIGUOUS = [
  "otro",
  "acceso ilimitado",
  "ilimitado con descuento maral",
  "ilimitado anual",
  "eclipse anual",
  "plan duo",
  "2 horas de arriendo",
  "yin yang yoga - 1 sesión semanal",
];

const norm = (s: string) => s.toLowerCase().trim().replace(/\s+/g, " ");

function notionHeaders() {
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

interface NotionRow {
  pageId: string;
  name: string;
  email: string | null;
  tipos: string[];
  trialPlan: string | null;
  firstMembershipPayment: string | null;
}

async function fetchNotionTrialRows(): Promise<NotionRow[]> {
  const rows: NotionRow[] = [];
  let cursor: string | undefined;

  do {
    const res = await fetch(
      `${GATEWAY}/data_sources/${CLIENTES_DATA_SOURCE_ID}/query`,
      {
        method: "POST",
        headers: notionHeaders(),
        body: JSON.stringify({
          page_size: 100,
          start_cursor: cursor,
          filter: {
            or: [
              { property: "Plan de Prueba", select: { is_not_empty: true } },
              { property: "Tipo de membresía", multi_select: { contains: "Plan de prueba" } },
            ],
          },
        }),
      },
    );
    const text = await res.text();
    if (!res.ok) throw new Error(`Notion [${res.status}]: ${text}`);
    const data = JSON.parse(text);

    for (const page of data.results ?? []) {
      const p = page.properties ?? {};
      rows.push({
        pageId: page.id,
        name: p["Nombre"]?.title?.[0]?.plain_text ?? "(sin nombre)",
        email: p["Mail"]?.email ? String(p["Mail"].email).toLowerCase().trim() : null,
        tipos: (p["Tipo de membresía"]?.multi_select ?? []).map((o: { name: string }) => o.name),
        trialPlan: p["Plan de Prueba"]?.select?.name ?? null,
        firstMembershipPayment:
          p["Primer pago membresía"]?.rollup?.date?.start ??
          p["Fecha Primer Pago"]?.rollup?.date?.start ??
          null,
      });
    }

    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);

  return rows;
}

function classify(tipos: string[]) {
  const memberships: string[] = [];
  const packages: string[] = [];
  const ambiguous: string[] = [];

  for (const t of tipos) {
    const n = norm(t);
    if (n === "plan de prueba") continue;
    if (MEMBERSHIP_MAP[n]) {
      memberships.push(MEMBERSHIP_MAP[n]);
    } else if (AMBIGUOUS.includes(n)) {
      ambiguous.push(t);
    } else if (PACKAGE_HINTS.some((h) => n.includes(h))) {
      packages.push(t);
    } else {
      ambiguous.push(t);
    }
  }
  return { memberships, packages, ambiguous };
}

function money(n: number) {
  return `$${n.toLocaleString("es-CL")}`;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const dryRun = body?.dryRun === true;
    const to: string[] = Array.isArray(body?.to) && body.to.length ? body.to : DEFAULT_TO;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // --- Datos del panel ---
    const [{ data: plans }, { data: customers }, { data: leads }, { data: existingMemberships }] =
      await Promise.all([
        supabase.from("membership_plans").select("id, name, price_clp, plan_type, is_active"),
        supabase.from("customers").select("id, email, name"),
        supabase
          .from("trial_bookings")
          .select("id, customer_email, customer_name, plan_type, status, admin_notes, paid_at, actual_start_date, actual_end_date"),
        supabase.from("customer_memberships").select("id, customer_id, membership_plan_id, status"),
      ]);

    // Para nombres duplicados (Universo), se usa el plan vigente de mayor precio.
    const planByName = new Map<string, { id: string; name: string; price_clp: number }>();
    for (const p of plans ?? []) {
      if (p.plan_type !== "membership") continue;
      const key = norm(p.name);
      const current = planByName.get(key);
      if (!current || p.price_clp > current.price_clp) {
        planByName.set(key, { id: p.id, name: p.name, price_clp: p.price_clp });
      }
    }

    const customerByEmail = new Map<string, { id: string; name: string }>();
    for (const c of customers ?? []) {
      customerByEmail.set(String(c.email).toLowerCase().trim(), { id: c.id, name: c.name });
    }

    const leadByEmail = new Map<string, typeof leads extends (infer L)[] ? L : never>();
    for (const l of leads ?? []) {
      const key = String(l.customer_email).toLowerCase().trim();
      if (!leadByEmail.has(key)) leadByEmail.set(key, l as never);
    }

    const membershipKey = (customerId: string, planId: string) => `${customerId}|${planId}`;
    const haveMembership = new Set(
      (existingMemberships ?? []).map((m) => membershipKey(m.customer_id, m.membership_plan_id)),
    );

    const notionRows = await fetchNotionTrialRows();

    const convertedRows: {
      name: string; email: string; plan: string; price: number; action: string; customerId: string;
    }[] = [];
    const packageRows: { name: string; email: string; pkg: string; action: string }[] = [];
    const noPurchase: { name: string; email: string; trialPlan: string | null }[] = [];
    const review: { name: string; email: string | null; motivo: string }[] = [];

    for (const row of notionRows) {
      const { memberships, packages, ambiguous } = classify(row.tipos);

      if (!row.email) {
        review.push({ name: row.name, email: null, motivo: "Ficha en Notion sin correo" });
        continue;
      }
      const customer = customerByEmail.get(row.email);

      if (ambiguous.length) {
        review.push({
          name: row.name,
          email: row.email,
          motivo: `Tipo sin equivalencia clara: ${ambiguous.join(", ")}`,
        });
      }

      if (!memberships.length && !packages.length) {
        noPurchase.push({ name: row.name, email: row.email, trialPlan: row.trialPlan });
        continue;
      }

      if (!customer) {
        review.push({
          name: row.name,
          email: row.email,
          motivo: `Correo no existe en el panel (${[...memberships, ...packages].join(", ")})`,
        });
        continue;
      }

      // --- Membresías ---
      for (const planName of memberships) {
        const plan = planByName.get(norm(planName));
        if (!plan) {
          review.push({ name: row.name, email: row.email, motivo: `Plan "${planName}" no existe en el panel` });
          continue;
        }
        const already = haveMembership.has(membershipKey(customer.id, plan.id));
        if (!already && !dryRun) {
          const startDate = row.firstMembershipPayment?.slice(0, 10) ?? new Date().toISOString().slice(0, 10);
          const { error: insErr } = await supabase.from("customer_memberships").insert({
            customer_id: customer.id,
            membership_plan_id: plan.id,
            status: "active",
            start_date: startDate,
            notes: "Sincronizado desde Notion (conversión de plan de prueba)",
          });
          if (insErr) {
            review.push({ name: row.name, email: row.email, motivo: `Error al crear membresía: ${insErr.message}` });
            continue;
          }
          haveMembership.add(membershipKey(customer.id, plan.id));
          await supabase.from("customer_events").insert({
            customer_id: customer.id,
            event_type: "membership_started",
            title: `Pasó a membresía ${plan.name}`,
            description: "Detectado en Notion durante la sincronización de planes de prueba",
            amount: plan.price_clp,
            metadata: { source: "notion_sync", notion_page_id: row.pageId },
          });

          const lead = leadByEmail.get(row.email) as { id: string; status: string; admin_notes: string | null } | undefined;
          if (lead && lead.status !== "convertido_a_membresia") {
            await supabase
              .from("trial_bookings")
              .update({
                status: "convertido_a_membresia",
                admin_notes: [lead.admin_notes, `Pasó a membresía ${plan.name} (sincronizado desde Notion)`]
                  .filter(Boolean)
                  .join(" · "),
              })
              .eq("id", lead.id);
          }
        }
        convertedRows.push({
          name: row.name,
          email: row.email,
          plan: plan.name,
          price: plan.price_clp,
          action: already ? "ya registrada" : dryRun ? "se crearía" : "creada",
          customerId: customer.id,
        });
      }

      // --- Paquetes de sesiones ---
      for (const pkg of packages) {
        const [{ data: codes }, { data: orders }, { data: events }] = await Promise.all([
          supabase.from("session_codes").select("id").ilike("buyer_email", row.email).limit(1),
          supabase.from("package_orders").select("id").ilike("buyer_email", row.email).eq("status", "paid").limit(1),
          supabase
            .from("customer_events")
            .select("id")
            .eq("customer_id", customer.id)
            .eq("event_type", "package_purchased")
            .limit(1),
        ]);
        const alreadyTracked = (codes?.length ?? 0) > 0 || (orders?.length ?? 0) > 0 || (events?.length ?? 0) > 0;

        if (!alreadyTracked && !dryRun) {
          await supabase.from("customer_events").insert({
            customer_id: customer.id,
            event_type: "package_purchased",
            title: `Compró paquete: ${pkg}`,
            description: "Detectado en Notion durante la sincronización de planes de prueba",
            metadata: { source: "notion_sync", notion_page_id: row.pageId, package_label: pkg },
          });
        }
        packageRows.push({
          name: row.name,
          email: row.email,
          pkg,
          action: alreadyTracked ? "ya registrado" : dryRun ? "se registraría" : "registrado",
        });
      }
    }

    // --- KPIs ---
    const totalTrials = notionRows.length;
    const convertedEmails = new Set(convertedRows.map((r) => r.email));
    const packageEmails = new Set(packageRows.map((r) => r.email).filter((e) => !convertedEmails.has(e)));
    const conversionRate = totalTrials ? (convertedEmails.size / totalTrials) * 100 : 0;
    const mrr = convertedRows
      .filter((r, i, arr) => arr.findIndex((x) => x.email === r.email) === i)
      .reduce((sum, r) => sum + r.price, 0);

    const byPlan = new Map<string, number>();
    for (const r of convertedRows) byPlan.set(r.plan, (byPlan.get(r.plan) ?? 0) + 1);

    const byTrial = new Map<string, number>();
    for (const r of notionRows) byTrial.set(r.trialPlan ?? "Sin plan indicado", (byTrial.get(r.trialPlan ?? "Sin plan indicado") ?? 0) + 1);

    const S = {
      wrap: 'font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;color:#1E2A3B;line-height:1.7;max-width:640px;margin:0 auto;padding:24px;',
      h1: "font-size:22px;color:#2E4D3A;margin:0 0 4px;",
      h2: "font-size:15px;color:#2E4D3A;margin:28px 0 8px;text-transform:uppercase;letter-spacing:.5px;",
      kpi: "display:inline-block;min-width:150px;border:1px solid #E4E9E6;border-radius:12px;padding:12px 16px;margin:0 8px 8px 0;",
      td: "padding:8px 10px;border-bottom:1px solid #EEF1F0;font-size:14px;",
      th: "padding:8px 10px;text-align:left;font-size:12px;color:#6B7A72;text-transform:uppercase;",
    };

    const kpi = (label: string, value: string) =>
      `<div style="${S.kpi}"><div style="font-size:12px;color:#6B7A72;">${label}</div><div style="font-size:22px;font-weight:600;">${value}</div></div>`;

    const table = (headers: string[], rows: string[][]) =>
      rows.length
        ? `<table style="width:100%;border-collapse:collapse;"><tr>${headers.map((h) => `<th style="${S.th}">${h}</th>`).join("")}</tr>${rows
            .map((r) => `<tr>${r.map((c) => `<td style="${S.td}">${c}</td>`).join("")}</tr>`)
            .join("")}</table>`
        : `<p style="font-size:14px;color:#6B7A72;">Sin registros.</p>`;

    const html = `<div style="${S.wrap}">
      <h1 style="${S.h1}">Reporte de conversión · Plan de prueba</h1>
      <p style="font-size:13px;color:#6B7A72;margin:0 0 20px;">Cruce de la tabla Clientes de Notion con el panel${dryRun ? " · simulación (no se guardó nada)" : ""}.</p>

      <div>
        ${kpi("Planes de prueba en Notion", String(totalTrials))}
        ${kpi("Pasaron a membresía", String(convertedEmails.size))}
        ${kpi("Tasa de conversión", `${conversionRate.toFixed(1)}%`)}
        ${kpi("Compraron paquete", String(packageEmails.size))}
        ${kpi("Sin compra posterior", String(noPurchase.length))}
        ${kpi("Ingreso mensual de convertidos", money(mrr))}
      </div>

      <h2 style="${S.h2}">Conversiones a membresía</h2>
      ${table(["Cliente", "Correo", "Membresía", "Valor", "Panel"], convertedRows.map((r) => [
        `<a href="https://studiolanave.com/admin/clientes/${r.customerId}" style="color:#2E4D3A;">${r.name}</a>`,
        r.email,
        r.plan,
        money(r.price),
        r.action,
      ]))}

      <h2 style="${S.h2}">Membresías por plan</h2>
      ${table(["Plan", "Clientes"], [...byPlan.entries()].map(([p, n]) => [p, String(n)]))}

      <h2 style="${S.h2}">Paquetes de sesiones</h2>
      ${table(["Cliente", "Correo", "Paquete", "Panel"], packageRows.map((r) => [r.name, r.email, r.pkg, r.action]))}

      <h2 style="${S.h2}">Distribución por tipo de plan de prueba</h2>
      ${table(["Plan de prueba", "Personas"], [...byTrial.entries()].map(([p, n]) => [p, String(n)]))}

      <h2 style="${S.h2}">Requieren revisión manual</h2>
      ${table(["Cliente", "Correo", "Motivo"], review.map((r) => [r.name, r.email ?? "—", r.motivo]))}

      <h2 style="${S.h2}">Sin compra posterior al plan de prueba</h2>
      ${table(["Cliente", "Correo", "Plan"], noPurchase.map((r) => [r.name, r.email, r.trialPlan ?? "—"]))}

      <p style="font-size:12px;color:#9AA5A0;margin-top:28px;">Nota: existen dos planes llamados "Universo" en el panel; se usó el vigente de mayor valor. Notion no fue modificado.</p>
    </div>`;

    let emailSent = false;
    if (!dryRun) {
      const key = Deno.env.get("RESEND_API_KEY");
      if (!key) throw new Error("RESEND_API_KEY no configurado");
      const resend = new Resend(key);
      await resend.emails.send({
        from: "Nave Studio <agenda@studiolanave.com>",
        to,
        subject: `Reporte plan de prueba → membresía · ${convertedEmails.size} conversiones`,
        html,
      });
      emailSent = true;
    }

    return new Response(
      JSON.stringify({
        ok: true,
        dryRun,
        emailSent,
        kpis: {
          totalTrials,
          converted: convertedEmails.size,
          conversionRate: Number(conversionRate.toFixed(1)),
          packages: packageEmails.size,
          noPurchase: noPurchase.length,
          mrr,
        },
        convertedRows,
        packageRows,
        review,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[sync-notion-trial-status]", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
